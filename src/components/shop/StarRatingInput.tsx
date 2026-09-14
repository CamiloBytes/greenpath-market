"use client";

import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: number | string;
}

/** Selector de 1 a 5 estrellas. */
export const StarRatingInput = ({
  value,
  onChange,
  disabled = false,
  size = 32,
}: StarRatingInputProps) => {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div
      className="flex items-center justify-center gap-1.5"
      role="radiogroup"
      aria-label="Calificación"
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <button
          key={index}
          type="button"
          role="radio"
          aria-checked={value === index}
          aria-label={`${index} estrella${index > 1 ? "s" : ""}`}
          disabled={disabled}
          onMouseEnter={() => !disabled && setHover(index)}
          onMouseLeave={() => !disabled && setHover(0)}
          onClick={() => !disabled && onChange(index)}
          className="cursor-pointer p-0.5 text-yellow-400 transition-colors disabled:cursor-not-allowed"
        >
          {index <= active ? (
            <FaStar size={size} />
          ) : (
            <FaRegStar size={size} className="text-white/40" />
          )}
        </button>
      ))}
    </div>
  );
};