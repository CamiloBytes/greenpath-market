"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Shop } from "@/src/types/ShopTypes";
import { ShopStatusBadge } from "../shop/ShopStatusBadge";
import type { ShopAdminAction } from "@/src/hooks/admin/useAdminShops";

export const ShopCard = ({
  shop,
  onEdit,
  onDelete,
  onAction,
}: {
  shop: Shop;
  onEdit: (shop: Shop) => void;
  onDelete: (shop: Shop) => void;
  onAction: (shop: Shop, action: ShopAdminAction) => void;
}) => {
  const state = shop.state ?? "active";
  const actionButtons: { action: ShopAdminAction; label: string }[] = [];

  if (state === "solicitud_de_desactivacion_pendiente") {
    actionButtons.push({ action: "approve", label: "Aprobar" });
    actionButtons.push({ action: "reject", label: "Rechazar" });
  } else if (state === "desactivada_temporalmente") {
    actionButtons.push({ action: "reactivate", label: "Reactivar" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-md"
    >
      {shop.logo_url ? (
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full sm:h-[150px] sm:w-[150px]">
          <Image
            src={shop.logo_url}
            alt={shop.shop_name}
            fill
            unoptimized={shop.logo_url.startsWith("http")}
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white/10 text-4xl text-white/40 sm:h-[150px] sm:w-[150px]">
          🏪
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <h3 className="text-lg font-bold text-white">{shop.shop_name}</h3>
        <ShopStatusBadge state={state} />
      </div>
      <p className="text-sm text-gray-300">{shop.description}</p>
      <p className="text-sm text-gray-300">
        <strong>Dirección:</strong> {shop.shop_address || "N/A"}
      </p>
      <p className="text-sm font-semibold text-gray-200">
        Reputación:{" "}
        <span
          className={
            shop.shop_score >= 70
              ? "text-[#1DD317]"
              : shop.shop_score >= 40
                ? "text-yellow-400"
                : "text-red-400"
          }
        >
          {shop.shop_score}
        </span>
        /100
      </p>
      <p className="text-sm text-gray-400">
        {shop.reviews_count ?? 0} reseña{(shop.reviews_count ?? 0) === 1 ? "" : "s"}
      </p>

      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {actionButtons.map((b) => (
          <button
            key={b.action}
            onClick={() => onAction(shop, b.action)}
            className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 ${
              b.action === "approve"
                ? "bg-gradient-to-r from-[#284827] to-[#1DD317]"
                : b.action === "reject"
                  ? "bg-[#dc3545]"
                  : "bg-[#007bff]"
            }`}
          >
            {b.label}
          </button>
        ))}

        <button
          onClick={() => onEdit(shop)}
          className="min-h-11 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:bg-white/20"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(shop)}
          className="min-h-11 rounded-lg bg-[#dc3545] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Borrar
        </button>
      </div>
    </motion.div>
  );
};