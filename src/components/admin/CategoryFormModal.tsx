"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../ui/Modal/Modal";
import { ImageUploader } from "../ui/ImageUploader";
import { useToastStore } from "@/src/stores/toastStore";
import type { Category } from "@/src/types/CategoryTypes";
import {
  categorySchema,
  type CategoryFormData,
} from "@/src/validation/category/CategoryValidation";

const fieldClass =
  "w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-[#1DD317] focus:bg-white/15";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60";
const errorClass = "mt-1 text-xs text-red-400";

export const CategoryFormModal = ({
  category,
  saving,
  onSave,
  onClose,
}: {
  category: Category | null;
  saving: boolean;
  onSave: (data: CategoryFormData & { imageFile: File | null }) => void;
  onClose: () => void;
}) => {
  const { showToast } = useToastStore();
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category_name: category?.category_name ?? "",
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    onSave({ ...data, imageFile: files[0] ?? null });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      eyebrow="Panel admin"
      title={category ? "Editar categoría" : "Nueva categoría"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="category-name" className={labelClass}>
            Nombre
          </label>
          <input
            id="category-name"
            type="text"
            {...register("category_name")}
            placeholder="Ej: Lácteos y derivados"
            className={fieldClass}
          />
          {errors.category_name && (
            <p className={errorClass}>{errors.category_name.message}</p>
          )}
        </div>

        {category && (
          <div>
            <span className={labelClass}>Imagen actual</span>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/30">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.category_name}
                    fill
                    unoptimized={category.image_url.startsWith("http")}
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
                    N/A
                  </div>
                )}
              </div>
              <p className="text-xs text-white/50">
                Imagen actual de la categoría
              </p>
            </div>
          </div>
        )}

        <div>
          <ImageUploader
            label={category ? "Cambiar imagen (opcional)" : "Imagen"}
            files={files}
            onFilesChange={setFiles}
            onError={(message) => showToast(message, "error")}
          />
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="min-h-11 flex-1 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Guardando…"
              : category
                ? "Guardar cambios"
                : "Crear categoría"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};
