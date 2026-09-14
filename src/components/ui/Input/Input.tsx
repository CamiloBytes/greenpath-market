"use client";

import { useState } from "react";
import { InputProps } from "@/src/types/InputTypes";
import { IoSearch } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";

export const Input = ({
  type,
  placeholder,
  label,
  icon,
  className = "",
  error,
  register,
  autoComplete,
  inputMode,
}: InputProps) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative w-full flex flex-col gap-1">
      {/* Icono */}
      {icon && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white z-10">
          {icon}
        </div>
      )}

      {/* Input */}
      <input
        type={isPassword && visible ? "text" : type}
        placeholder={placeholder ?? " "}
        {...register}
        aria-invalid={error ? "true" : "false"}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`${className}
          peer
          w-full
          bg-transparent
          px-[10px]
          pt-5
          pb-1
          ${icon ? "pl-10" : ""}
          ${isPassword ? "pr-11" : ""}
          text-white
          text-[14px]
          leading-6
          outline-none
          border-none
          [color-scheme:dark]
          placeholder:text-transparent
        `}
      />

      {/* Toggle de contraseña */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-2 bottom-2 p-1 text-white/50 hover:text-[#1DD317] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#1DD317]"
          tabIndex={0}
        >
          {visible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      )}

      {/* Label */}
      <label
        className={`
          absolute
          ${icon ? "left-10" : "left-[10px]"}
          top-1/2
          -translate-y-1/2
          ${error ? "text-red-400" : "text-white"}
          pointer-events-none
          origin-left
          transition-all
          duration-200

          peer-placeholder-shown:top-1/2
          peer-placeholder-shown:text-base
          peer-placeholder-shown:-translate-y-1/2

          peer-focus:top-2
          peer-focus:text-xs
          peer-focus:-translate-y-0

          peer-not-placeholder-shown:top-2
          peer-not-placeholder-shown:text-xs
          peer-not-placeholder-shown:-translate-y-0
        `}
      >
        {label}
      </label>

      {/* Línea inferior */}
      <div
        className={`
          h-[1.5px]
          w-full
          transition-all
          duration-300
          motion-reduce:transition-none
          ${
            error
              ? "bg-red-500"
              : "bg-gradient-to-r from-[#284827] via-[#20B11B] to-[#1DD317] peer-focus:bg-none peer-focus:bg-[#1DD317] peer-focus:h-[2px] peer-focus:shadow-[0_0_12px_rgba(29,211,23,0.45)]"
          }
        `}
      />

      {/* Error */}
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export const SearchInput = ({
  placeholder = "Search",
  value,
  onChange,
  onSearch,
  className = "",
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (value: string) => void;
  className?: string;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch((e.target as HTMLInputElement).value);
    }
  };

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className="min-h-11 w-full py-2 pl-4 pr-12 rounded-full bg-white/10 text-white placeholder-white/40 outline-none focus:bg-white/15 focus:ring-2 focus:ring-[#1DD317] transition-all duration-200"
      />
      <button
        onClick={() => onSearch?.(value || "")}
        aria-label="Buscar"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#1DD317] text-[#07110C] hover:bg-[#20B11B] transition-colors"
      >
        <IoSearch size={16} />
      </button>
    </div>
  );
};
