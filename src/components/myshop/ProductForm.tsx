"use client";

import type { Product } from "@/src/types/ProductTypes";
import type { ProductFormData } from "@/src/types/ProductTypes";
import { useProductForm } from "@/src/hooks/myshop/useProductForm";

const inputClass =
  "w-full rounded-lg border border-[#1DD317]/40 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#1DD317]";

export const ProductForm = ({
  product,
  onSubmit,
  onCancel,
  submitting,
}: {
  product: Product | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
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
    setImageFile,
    handleSubmit,
  } = useProductForm(product);

  const onSubmitForm = (e: React.FormEvent) => {
    const data = handleSubmit(e);
    if (data) onSubmit(data);
  };

  return (
    <div className="rounded-2xl bg-white p-6">
      <form onSubmit={onSubmitForm} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Cantidad del producto"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min={0}
            required
            className={inputClass}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Valor unitario"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
            required
            className={inputClass}
          />
        </div>
        <input
          type="text"
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
        <input
          type="file"
          accept="image/*"
          disabled={!!product}
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-white/80 file:mr-3 file:rounded-lg file:border-0 file:bg-[#284827] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white disabled:opacity-40"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className={`${inputClass} [&>option]:text-black`}
        >
          <option value="">-- Selecciona una categoría --</option>
          <option value="1">Frutas y verduras</option>
          <option value="2">Granos y cereales</option>
          <option value="3">Lácteos y derivados</option>
          <option value="4">Res, pollo y pescado</option>
        </select>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Guardando..." : product ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-gray-200 px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};