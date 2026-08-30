"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { FiChevronDown } from "react-icons/fi";

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
          pl-[10px]
          pr-9
          pt-5
          pb-1
          text-white
          text-[14px]
          leading-6
          outline-none
          border-none
          cursor-pointer
          appearance-none
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

      <FiChevronDown
        aria-hidden
        size={16}
        className="pointer-events-none absolute right-2 bottom-2 text-[#1DD317]"
      />

      {label && (
        <label
          className={`
            absolute
            left-[10px]
            top-2
            text-xs
            ${error ? "text-red-400" : "text-white"}
            pointer-events-none
            origin-left
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
          duration-300
          motion-reduce:transition-none
          ${
            error
              ? "bg-red-500"
              : "bg-gradient-to-r from-[#284827] via-[#20B11B] to-[#1DD317] peer-focus:bg-none peer-focus:bg-[#1DD317] peer-focus:h-[2px] peer-focus:shadow-[0_0_12px_rgba(29,211,23,0.45)]"
          }
        `}
      />

      {error && (
        <p role="alert" className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
