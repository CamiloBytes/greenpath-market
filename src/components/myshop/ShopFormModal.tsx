"use client";

import { Modal } from "../ui/Modal/Modal";
import { useShopForm } from "@/src/hooks/myshop/useShopForm";
import { FiImage } from "react-icons/fi";
import type { Shop, ShopFormData } from "@/src/types/ShopTypes";

const fieldClass =
  "w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-[#1DD317] focus:bg-white/15 [color-scheme:dark]";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60";

export const ShopFormModal = ({
  isOpen,
  shop,
  onSave,
  onClose,
  saving,
}: {
  isOpen: boolean;
  shop: Shop | null;
  onSave: (data: ShopFormData) => Promise<boolean>;
  onClose: () => void;
  saving: boolean;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Mi tienda"
      title={shop ? "Editar tienda" : "Crea tu tienda"}
    >
      {isOpen && (
        <ShopFormFields
          key={shop?.id_shop ?? "new"}
          shop={shop}
          onSave={onSave}
          onClose={onClose}
          saving={saving}
        />
      )}
    </Modal>
  );
};

const ShopFormFields = ({
  shop,
  onSave,
  onClose,
  saving,
}: {
  shop: Shop | null;
  onSave: (data: ShopFormData) => Promise<boolean>;
  onClose: () => void;
  saving: boolean;
}) => {
  const {
    shopName,
    setShopName,
    description,
    setDescription,
    address,
    setAddress,
    logoFile,
    setLogoFile,
    handleSubmit,
  } = useShopForm(shop);

  const onSubmit = async (e: React.FormEvent) => {
    const data = handleSubmit(e);
    if (!data) return;
    const ok = await onSave(data);
    if (ok) onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="shop-name" className={labelClass}>
          Nombre de la tienda
        </label>
        <input
          id="shop-name"
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          required
          placeholder="Ej: La Huerta de Doña Rosa"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="shop-description" className={labelClass}>
          Descripción
        </label>
        <textarea
          id="shop-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          placeholder="¿Qué vendes? ¿Por qué elegirte?"
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div>
        <label htmlFor="shop-address" className={labelClass}>
          Dirección
        </label>
        <input
          id="shop-address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ej: Vía Vereda El Rosal, Km 3"
          className={fieldClass}
        />
      </div>

      <div>
        <span className={labelClass}>
          Logo{shop ? " (opcional, deja vacío para conservar el actual)" : ""}
        </span>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#1DD317]/40 bg-white/5 px-4 py-3 text-sm text-white/70 transition-colors hover:border-[#1DD317] hover:bg-white/10">
          <FiImage className="shrink-0 text-[#1DD317]" />
          <span className="truncate">
            {logoFile ? logoFile.name : "Selecciona una imagen"}
          </span>
          <input
            type="file"
            accept="image/*"
            required={!shop}
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
          {saving ? "Guardando…" : shop ? "Guardar cambios" : "Crear tienda"}
        </button>
        {shop && (
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
