"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiAlertCircle, FiCheck, FiImage, FiLoader, FiX } from "react-icons/fi";
import {
  IMAGE_ACCEPT_ATTR,
  mapUploadError,
  validateImageFile,
} from "@/src/utils/imageUpload";

type EntryStatus = "idle" | "uploading" | "done" | "error";

interface EntryState {
  status: EntryStatus;
  error?: string;
}

interface ImageUploaderProps {
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  helperText?: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  onUpload?: (file: File) => Promise<unknown>;
  onUploadingChange?: (uploading: boolean) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const ImageUploader = ({
  multiple = false,
  maxSizeMB,
  label,
  helperText,
  files,
  onFilesChange,
  onUpload,
  onUploadingChange,
  onError,
  disabled = false,
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef(new Map<string, string>());
  const [entries, setEntries] = useState<Record<string, EntryState>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const getPreview = useCallback((file: File) => {
    const key = fileKey(file);
    if (!urlRef.current.has(key)) {
      urlRef.current.set(key, URL.createObjectURL(file));
    }
    return urlRef.current.get(key)!;
  }, []);

  useEffect(() => {
    const keys = new Set(files.map(fileKey));
    for (const key of urlRef.current.keys()) {
      if (!keys.has(key)) {
        const url = urlRef.current.get(key);
        if (url) URL.revokeObjectURL(url);
        urlRef.current.delete(key);
      }
    }
  }, [files]);

  useEffect(
    () => () => {
      for (const url of urlRef.current.values()) URL.revokeObjectURL(url);
      urlRef.current.clear();
    },
    []
  );

  const uploading = files.some(
    (file) => entries[fileKey(file)]?.status === "uploading"
  );

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  const uploadFile = useCallback(
    async (file: File) => {
      const key = fileKey(file);
      try {
        await onUpload?.(file);
        setEntries((prev) => ({ ...prev, [key]: { status: "done" } }));
      } catch (err) {
        setEntries((prev) => ({
          ...prev,
          [key]: { status: "error", error: mapUploadError(err) },
        }));
      }
    },
    [onUpload]
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      const valid: File[] = [];
      let firstError: string | null = null;

      for (const file of Array.from(fileList)) {
        const error = validateImageFile(file, maxSizeMB);
        if (error) {
          firstError ??= error;
          continue;
        }
        valid.push(file);
      }

      if (valid.length === 0) {
        setFormError(firstError);
        onError?.(firstError ?? "");
        return;
      }

      setFormError(null);
      const next = multiple ? [...files, ...valid] : [valid[valid.length - 1]];
      onFilesChange(next);

      for (const file of valid) {
        const key = fileKey(file);
        setEntries((prev) => ({
          ...prev,
          [key]: { status: onUpload ? "uploading" : "idle" },
        }));
        if (onUpload) void uploadFile(file);
      }
    },
    [files, multiple, maxSizeMB, onUpload, onFilesChange, onError, uploadFile]
  );

  const handleRemove = useCallback(
    (file: File) => {
      if (disabled) return;
      const key = fileKey(file);
      if (entries[key]?.status === "uploading") return;
      onFilesChange(files.filter((f) => fileKey(f) !== key));
    },
    [files, onFilesChange, entries, disabled]
  );

  return (
    <div className="flex flex-col gap-3">
      {label && <span className="text-xs font-bold text-white/60">{label}</span>}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#1DD317]/40 bg-white/5 px-4 py-3 text-sm text-white/70 transition-colors hover:border-[#1DD317] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FiImage className="shrink-0 text-[#1DD317]" />
        <span className="truncate">
          {multiple ? "Selecciona imágenes" : "Selecciona una imagen"}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT_ATTR}
        multiple={multiple}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {helperText && (
        <p className="text-xs text-white/40">{helperText}</p>
      )}

      {formError && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300"
        >
          <FiAlertCircle className="shrink-0" /> {formError}
        </p>
      )}

      {files.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {files.map((file) => {
            const key = fileKey(file);
            const state = entries[key] ?? { status: "idle" };
            return (
              <li
                key={key}
                className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-2"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/30">
                  <Image
                    src={getPreview(file)}
                    alt={file.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <p className="truncate text-xs font-semibold text-white">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-white/50">
                    {formatSize(file.size)}
                  </p>
                  <div className="flex items-center gap-2">
                    {state.status === "uploading" && (
                      <span className="flex items-center gap-1 text-[10px] text-[#1DD317]">
                        <FiLoader className="animate-spin" /> Subiendo…
                      </span>
                    )}
                    {state.status === "done" && (
                      <span className="flex items-center gap-1 text-[10px] text-[#1DD317]">
                        <FiCheck /> Listo
                      </span>
                    )}
                    {state.status === "error" && (
                      <span className="flex items-center gap-1 text-[10px] text-red-300">
                        <FiAlertCircle /> Error
                      </span>
                    )}
                    {state.status === "idle" && !onUpload && (
                      <span className="text-[10px] text-white/50">Lista</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(file)}
                  disabled={state.status === "uploading" || disabled}
                  aria-label={`Quitar ${file.name}`}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiX size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {uploading && (
        <p className="flex items-center gap-2 text-xs text-[#1DD317]">
          <FiLoader className="animate-spin" /> Subiendo imágenes…
        </p>
      )}
    </div>
  );
};