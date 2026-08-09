"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CardCategoryProps } from "@/src/types/CardsTypes";

export const CardCategory = ({
  imageUrl,
  title,
  onClick,
}: CardCategoryProps) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="group relative aspect-square w-full max-w-[240px] cursor-pointer overflow-hidden rounded-[28px]"
    >
      {/* Imagen */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Degradado */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Texto */}
      <div className="absolute inset-x-0 bottom-6 px-4 text-center">
        <h2 className="text-2xl font-extrabold uppercase leading-tight tracking-wide text-white drop-shadow-lg">
          {title}
        </h2>
      </div>
    </motion.div>
  );
};