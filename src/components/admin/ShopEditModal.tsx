"use client";

import Image from "next/image";
import { Modal } from "../ui/Modal/Modal";
import { FiImage } from "react-icons/fi";
import type { Shop, ShopFormData } from "@/src/types/ShopTypes";
import { useShopEditForm } from "@/src/hooks/admin/useShopEditForm";

const fieldClass =
  "w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-[#1DD317] focus:bg-white/15 [color-scheme:dark]";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60";

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
    <Modal
      isOpen={Boolean(shop)}
      onClose={onClose}
      eyebrow="Panel admin"
      title="Editar tienda"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="admin-shop-name" className={labelClass}>
            Nombre de la tienda
          </label>
          <input
            id="admin-shop-name"
            type="text"
            required
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="admin-shop-description" className={labelClass}>
            Descripción
          </label>
          <textarea
            id="admin-shop-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${fieldClass} resize-none`}
          />
        </div>

        <div>
          <label htmlFor="admin-shop-address" className={labelClass}>
            Dirección
          </label>
          <input
            id="admin-shop-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <span className={labelClass}>Logo actual</span>
          {shop.logo_url ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/10">
              <Image
                src={shop.logo_url}
                alt="Logo"
                fill
                unoptimized={shop.logo_url.startsWith("http")}
                className="object-cover"
              />
            </div>
          ) : (
            <p className="text-sm text-white/50">No hay logo</p>
          )}
        </div>

        <div>
          <span className={labelClass}>Cambiar logo (opcional)</span>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#1DD317]/40 bg-white/5 px-4 py-3 text-sm text-white/70 transition-colors hover:border-[#1DD317] hover:bg-white/10">
            <FiImage className="shrink-0 text-[#1DD317]" />
            <span className="truncate">
              Cambiar logo de la tienda
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="min-h-11 flex-1 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};
