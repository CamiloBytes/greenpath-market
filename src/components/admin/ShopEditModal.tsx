"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Shop } from "@/src/types/ShopTypes";
import type { ShopFormData } from "@/src/types/ShopTypes";
import { useShopEditForm } from "@/src/hooks/admin/useShopEditForm";

export const ShopEditModal = ({
  shop,
  onClose,
  onSave,
  saving,
}: {
  shop: Shop;
  onClose: () => void;
  onSave: (data: ShopFormData) => void;
  saving: boolean;
}) => {
  const {
    shopName,
    setShopName,
    description,
    setDescription,
    address,
    setAddress,
    setLogoFile,
    handleSubmit,
  } = useShopEditForm(shop);

  const onSubmit = (e: React.FormEvent) => {
    const data = handleSubmit(e);
    if (data) onSave(data);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl bg-white p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Editar Tienda</h2>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="text-2xl leading-none text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Nombre de la tienda:
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#1DD317]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Descripción:
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#1DD317]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Dirección:
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#1DD317]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Logo actual:
              </label>
              <div className="flex items-center gap-3">
                {shop.logo_url ? (
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                    <Image
                      src={shop.logo_url}
                      alt="Logo"
                      fill
                      unoptimized={shop.logo_url.startsWith("http")}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No hay logo</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Cambiar logo (opcional):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#284827] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </div>

            <div className="mt-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-[#28a745] px-4 py-2.5 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg bg-[#6c757d] px-4 py-2.5 font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};