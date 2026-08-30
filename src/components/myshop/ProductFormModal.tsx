"use client";

import { Modal } from "../ui/Modal/Modal";
import { useProductForm } from "@/src/hooks/myshop/useProductForm";
import { FiChevronDown, FiImage } from "react-icons/fi";
import type { Product, ProductFormData } from "@/src/types/ProductTypes";

const fieldClass =
  "w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-[#1DD317] focus:bg-white/15 [color-scheme:dark]";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60";

const CATEGORIES = [
  { value: "1", label: "Frutas y verduras" },
  { value: "2", label: "Granos y cereales" },
  { value: "3", label: "Lácteos y derivados" },
  { value: "4", label: "Res, pollo y pescado" },
];

export const ProductFormModal = ({
  isOpen,
  product,
  onSubmit,
  onClose,
  submitting,
}: {
  isOpen: boolean;
  product: Product | null;
  onSubmit: (data: ProductFormData) => void;
  onClose: () => void;
  submitting: boolean;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Mi tienda"
      title={product ? "Editar producto" : "Nuevo producto"}
    >
      {isOpen && (
        <ProductFormFields
          key={product?.id_product ?? "new"}
          product={product}
          onSubmit={onSubmit}
          onClose={onClose}
          submitting={submitting}
        />
      )}
    </Modal>
  );
};

const ProductFormFields = ({
  product,
  onSubmit,
  onClose,
  submitting,
}: {
  product: Product | null;
  onSubmit: (data: ProductFormData) => void;
  onClose: () => void;
  submitting: boolean;
}) => {
  const {
    name,
    setName,
    stock,
    setStock,
    price,
    setPrice,
    description,
    setDescription,
    category,
    setCategory,
    imageFile,
    setImageFile,
    handleSubmit,
  } = useProductForm(product);

  const onSubmitForm = (e: React.FormEvent) => {
    const data = handleSubmit(e);
    if (data) onSubmit(data);
  };

  return (
    <form onSubmit={onSubmitForm} className="flex flex-col gap-4">
      <div>
        <label htmlFor="product-name" className={labelClass}>
          Nombre
        </label>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Ej: Tomate chonto orgánico"
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product-stock" className={labelClass}>
            Cantidad
          </label>
          <input
            id="product-stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min={0}
            required
            inputMode="numeric"
            placeholder="0"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="product-price" className={labelClass}>
            Precio (COP)
          </label>
          <input
            id="product-price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min={0}
            required
            inputMode="decimal"
            placeholder="0.00"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="product-description" className={labelClass}>
          Descripción
        </label>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Opcional"
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div>
        <label htmlFor="product-category" className={labelClass}>
          Categoría
        </label>
        <div className="relative">
          <select
            id="product-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={`${fieldClass} appearance-none pr-10 [&>option]:text-black`}
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FiChevronDown
            aria-hidden
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#1DD317]"
          />
        </div>
      </div>

      <div>
        <span className={labelClass}>Imagen</span>
        {product ? (
          <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/50">
            La imagen no puede cambiarse después de crear el producto.
          </p>
        ) : (
          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#1DD317]/40 bg-white/5 px-4 py-3 text-sm text-white/70 transition-colors hover:border-[#1DD317] hover:bg-white/10">
            <FiImage className="shrink-0 text-[#1DD317]" />
            <span className="truncate">
              {imageFile ? imageFile.name : "Selecciona una imagen"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={submitting}
          className="min-h-11 flex-1 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Guardando…" : product ? "Guardar cambios" : "Agregar producto"}
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
  );
};
