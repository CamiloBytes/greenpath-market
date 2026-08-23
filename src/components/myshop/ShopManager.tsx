"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Shop } from "@/src/types/ShopTypes";
import type { ShopFormData } from "@/src/types/ShopTypes";
import { useShopForm } from "@/src/hooks/myshop/useShopForm";

export const ShopManager = ({
  shop,
  onSave,
  saving,
}: {
  shop: Shop | null;
  onSave: (data: ShopFormData) => void;
  saving: boolean;
}) => {
  const {
    editing,
    setEditing,
    shopName,
    setShopName,
    description,
    setDescription,
    address,
    setAddress,
    setLogoFile,
    resetForm,
    handleSubmit,
  } = useShopForm(shop);

  const onSubmit = (e: React.FormEvent) => {
    const data = handleSubmit(e);
    if (data) onSave(data);
  };

  if (shop && !editing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full flex-col items-center gap-3 rounded-2xl bg-[#37963d2d] p-8 backdrop-blur-md"
      >
        <div className="flex h-[160px] w-[160px] items-center justify-center overflow-hidden rounded-full bg-[#37963d5e]">
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
        <h2 className="text-2xl font-bold text-white">{shop.shop_name}</h2>
        <div className="text-center text-sm text-gray-200">
          <p>
            <strong className="text-white">Descripción:</strong>{" "}
            {shop.description || ""}
          </p>
          <p>
            <strong className="text-white">Dirección:</strong>{" "}
            {shop.shop_address || ""}
          </p>
          <p>
            <strong className="text-white">Reputación:</strong>{" "}
            <span className={`font-bold ${shop.shop_score >= 70 ? "text-[#1DD317]" : shop.shop_score >= 40 ? "text-yellow-400" : "text-red-400"}`}>
              {shop.shop_score}
            </span>/100
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditing(true);
          }}
          className="mt-2 rounded-xl bg-gradient-to-r from-[#284827] to-[#329a2e] px-6 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity"
        >
          Editar
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl bg-[#37963d2d] p-8 backdrop-blur-md"
    >
      <h3 className="mb-4 text-xl font-bold text-white">
        {shop ? "Editar Tienda" : "Crear Tienda"}
      </h3>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-white">
            Nombre de la tienda:
          </label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
            className="w-full rounded-lg border border-[#1DD317]/40 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#1DD317]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-white">
            Descripción:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full resize-none rounded-lg border border-[#1DD317]/40 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#1DD317]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-white">
            Dirección:
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-[#1DD317]/40 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#1DD317]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-white">
            Logo de la tienda{shop ? " (opcional - deja vacío para mantener el actual)" : ""}:
          </label>
          <input
            type="file"
            accept="image/*"
            required={!shop}
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-white/80 file:mr-3 file:rounded-lg file:border-0 file:bg-[#284827] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Guardando..." : shop ? "Actualizar Tienda" : "Crear Tienda"}
          </button>
          {shop && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setEditing(false);
              }}
              className="rounded-xl bg-white/10 px-6 py-2.5 text-sm font-bold text-gray-300 hover:bg-white/20 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};