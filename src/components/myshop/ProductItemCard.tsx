"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/src/types/ProductTypes";

export const ProductItemCard = ({
  product,
  shopName,
  onEdit,
  onDelete,
}: {
  product: Product;
  shopName: string;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative flex h-[300px] w-full flex-col justify-end overflow-hidden rounded-[25px] text-white shadow-xl shadow-black/30"
    >
      {product.image_url && (
        <Image
          src={product.image_url}
          alt={product.name_product}
          fill
          unoptimized={product.image_url.startsWith("http")}
          className="absolute inset-0 object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      <div className="relative z-[2] p-4 text-center">
        <h2 className="text-lg font-bold drop-shadow-md">
          {product.name_product}
        </h2>
        <div className="mb-1 flex items-center justify-center gap-2">
          <h3 className="rounded-[10px] bg-white/10 px-2.5 py-0.5 text-sm font-bold backdrop-blur-sm">
            {product.stock} L
          </h3>
          <h3 className="rounded-[10px] bg-white/10 px-2.5 py-0.5 text-sm font-bold backdrop-blur-sm">
            ${product.price.toLocaleString("es-CO")}
          </h3>
        </div>
        <p className="text-xs text-gray-300">
          Sold by: <strong className="text-white">{shopName}</strong>
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/25"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(product)}
            className="rounded-full bg-red-500/20 px-5 py-2 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-red-500/40"
          >
            Eliminar
          </button>
        </div>
      </div>
    </motion.article>
  );
};