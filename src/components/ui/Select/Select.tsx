"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  error?: string;
  register?: UseFormRegisterReturn;
}

export const Select = ({
  label,
  options,
  error,
  register,
}: SelectProps) => {
  return (
    <div className="relative w-full flex flex-col gap-1">
      <select
        {...register}
        defaultValue=""
        aria-invalid={error ? "true" : "false"}
        className={`
          peer
          w-full
          bg-transparent
          px-[10px]
          pt-5
          pb-1
          text-white
          text-[14px]
          leading-6
          outline-none
          border-none
          cursor-pointer
          [&>option]:text-black
        `}
      >
        <option value="" disabled hidden />
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {label && (
        <label
          className={`
            absolute
            left-[10px]
            top-2
            text-xs
            text-white
            pointer-events-none
            origin-left
            transition-all
            duration-200
          `}
        >
          {label}
        </label>
      )}

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

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};