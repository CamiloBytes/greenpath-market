"use client";

import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

interface StarsProps {
  value: number;
  size?: number | string;
  className?: string;
}

/** Muestra de 1 a 5 estrellas (soporta medios puntos). */
export const Stars = ({ value, size = 16, className = "" }: StarsProps) => {
  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      aria-label={`Calificación ${value.toFixed(1)} de 5`}
    >
      {[1, 2, 3, 4, 5].map((index) => {
        const full = value >= index - 0.25;
        const half = value >= index - 0.75 && value < index - 0.25;
        return (
          <span key={index} className="flex items-center">
            {full ? (
              <FaStar size={size} className="text-yellow-400" />
            ) : half ? (
              <FaStarHalfAlt size={size} className="text-yellow-400" />
            ) : (
              <FaRegStar size={size} className="text-white/40" />
            )}
          </span>
        );
      })}
    </div>
  );
};

export const starsFromShopScore = (score: number): number => score / 20;