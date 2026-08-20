"use client";

import { InputProps } from "@/src/types/InputTypes";
import { IoSearch } from "react-icons/io5";

export const Input = ({
  type,
  placeholder,
  label,
  icon,
  className,
  error,
  register,
}: InputProps) => {
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
        type={type}
        placeholder={placeholder ?? " "}
        {...register}
        aria-invalid={error ? "true" : "false"}
        className={className + `
          peer
          w-full
          bg-transparent
          px-[10px]
          pt-5
          ${icon ? "pl-10" : ""}
          text-white
          text-[14px]
          leading-6
          outline-none
          border-none
          placeholder:text-transparent
        `}
      />

      {/* Label */}
      <label
        className={`
          absolute
          ${icon ? "left-10" : "left-[10px]"}
          top-1/2
          -translate-y-1/2
          text-white
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
          duration-700
          ${
            error
              ? "bg-red-500"
              : "bg-gradient-to-r from-[#284827] via-[#20B11B] to-[#1DD317]"
          }
        `}
      />

      {/* Error */}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
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
        className="w-full py-2 pl-4 pr-11 rounded-full bg-white/10 text-white placeholder-white/40 outline-none focus:bg-white/15 focus:ring-2 focus:ring-[#1DD317] transition-all duration-200"
      />
      <button
        onClick={() => onSearch?.(value || "")}
        aria-label="Buscar"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-[#1DD317] text-[#07110C] hover:bg-[#20B11B] transition-colors"
      >
        <IoSearch size={16} />
      </button>
    </div>
  );
};
