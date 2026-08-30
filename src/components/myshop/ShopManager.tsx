"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiEdit2 } from "react-icons/fi";
import type { Shop } from "@/src/types/ShopTypes";

export const ShopManager = ({
  shop,
  onEdit,
}: {
  shop: Shop | null;
  onEdit: () => void;
}) => {
  if (!shop) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full flex-col items-center gap-4 rounded-2xl border border-dashed border-[#1DD317]/40 bg-[#37963d2d] p-8 text-center backdrop-blur-md"
      >
        <p className="text-sm text-white/70">
          Aún no tienes tienda. Créala para empezar a vender tus productos.
        </p>
        <button
          onClick={onEdit}
          className="min-h-11 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-8 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
        >
          Crear mi tienda
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full flex-col items-center gap-3 rounded-2xl bg-[#37963d2d] p-6 backdrop-blur-md sm:flex-row sm:items-center sm:gap-8 sm:p-8"
    >
      <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#37963d5e] sm:h-[160px] sm:w-[160px]">
        {shop.logo_url ? (
          <Image
            src={shop.logo_url}
            alt="Logo de la tienda"
            width={160}
            height={160}
            unoptimized={shop.logo_url.startsWith("http")}
            className="object-cover"
          />
        ) : (
          <span className="text-sm text-white/60">No disponible</span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center sm:items-start sm:text-left">
        <h2 className="text-2xl font-bold text-white">{shop.shop_name}</h2>
        <p className="text-sm text-gray-200">
          {shop.description || "Sin descripción"}
        </p>
        <p className="text-sm text-gray-200">{shop.shop_address || ""}</p>
        <p className="text-sm text-gray-200">
          Reputación:{" "}
          <span
            className={`font-bold ${
              shop.shop_score >= 70
                ? "text-[#1DD317]"
                : shop.shop_score >= 40
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {shop.shop_score}
          </span>
          /100
        </p>
        <button
          onClick={onEdit}
          className="mt-3 flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
        >
          <FiEdit2 /> Editar tienda
        </button>
      </div>
    </motion.div>
  );
};
