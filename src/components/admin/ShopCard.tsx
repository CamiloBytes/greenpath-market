"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Shop } from "@/src/types/ShopTypes";

export const ShopCard = ({
  shop,
  onEdit,
  onDelete,
}: {
  shop: Shop;
  onEdit: (shop: Shop) => void;
  onDelete: (shop: Shop) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm"
    >
      {shop.logo_url ? (
        <div className="relative h-[160px] w-[160px] overflow-hidden rounded-full">
          <Image
            src={shop.logo_url}
            alt={shop.shop_name}
            fill
            unoptimized={shop.logo_url.startsWith("http")}
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-400">
          🏪
        </div>
      )}

      <h3 className="text-lg font-bold text-gray-800">{shop.shop_name}</h3>
      <p className="text-sm text-gray-600">{shop.description}</p>
      <p className="text-sm text-gray-600">
        <strong>Address:</strong> {shop.shop_address || "N/A"}
      </p>
      <p className="text-sm font-semibold text-gray-700">
        Score: <span className={shop.shop_score >= 70 ? "text-green-600" : shop.shop_score >= 40 ? "text-yellow-600" : "text-red-600"}>{shop.shop_score}</span>/100
      </p>

      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onEdit(shop)}
          className="rounded-lg bg-[#007bff] px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(shop)}
          className="rounded-lg bg-[#dc3545] px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Borrar
        </button>
      </div>
    </motion.div>
  );
};