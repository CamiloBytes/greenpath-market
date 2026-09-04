"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../ui/Modal/Modal";
import { useProductImages } from "@/src/hooks/myshop/useProductImages";
import { ImageUploader } from "../ui/ImageUploader";
import { FiChevronDown, FiLoader, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { useToastStore } from "@/src/stores/toastStore";
import { IMAGE_ACCEPT_ATTR, validateImageFile } from "@/src/utils/imageUpload";
import {
  productFormSchema,
  type ProductFormInput,
} from "@/src/validation/product/ProductValidation";
import type {
  Product,
  ProductImage,
} from "@/src/types/ProductTypes";

const fieldClass =
  "w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-[#1DD317] focus:bg-white/15 [color-scheme:dark]";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60";
const errorClass = "mt-1 text-xs text-red-400";

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
  onImagesChange,
  onClose,
  submitting,
}: {
  isOpen: boolean;
  product: Product | null;
  onSubmit: (data: ProductFormInput) => void;
  onImagesChange?: (productId: number, images: ProductImage[]) => void;
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
          onImagesChange={onImagesChange}
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
  onImagesChange,
  onClose,
  submitting,
}: {
  product: Product | null;
  onSubmit: (data: ProductFormInput) => void;
  onImagesChange?: (productId: number, images: ProductImage[]) => void;
  onClose: () => void;
  submitting: boolean;
}) => {
  const { showToast } = useToastStore();
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const imageManager = useProductImages(product, onImagesChange);
  const imagesLoading = imageManager.uploading;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name_product: product?.name_product ?? "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      product_description: product?.product_description ?? "",
      id_category: product?.id_category ?? 0,
      product_star_rate: 0,
      imageFiles: [],
    },
  });

  const onSubmitForm = (data: ProductFormInput) => {
    onSubmit(data);
  };

  const saveDisabled = submitting || imagesLoading;

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="product-name" className={labelClass}>
          Nombre
        </label>
        <input
          id="product-name"
          type="text"
          {...register("name_product")}
          placeholder="Ej: Tomate chonto orgánico"
          className={fieldClass}
        />
        {errors.name_product && (
          <p className={errorClass}>{errors.name_product.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product-stock" className={labelClass}>
            Cantidad
          </label>
          <input
            id="product-stock"
            type="number"
            {...register("stock", { valueAsNumber: true })}
            min={0}
            inputMode="numeric"
            placeholder="0"
            className={fieldClass}
          />
          {errors.stock && (
            <p className={errorClass}>{errors.stock.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="product-price" className={labelClass}>
            Precio (COP)
          </label>
          <input
            id="product-price"
            type="number"
            {...register("price", { valueAsNumber: true })}
            step="0.01"
            min={0}
            inputMode="decimal"
            placeholder="0.00"
            className={fieldClass}
          />
          {errors.price && (
            <p className={errorClass}>{errors.price.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="product-description" className={labelClass}>
          Descripción
        </label>
        <textarea
          id="product-description"
          {...register("product_description")}
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
            {...register("id_category", { valueAsNumber: true })}
            className={`${fieldClass} appearance-none pr-10 [&>option]:text-black`}
          >
            <option value={0} disabled>
              Selecciona una categoría
            </option>
            {CATEGORIES.map((option) => (
              <option key={option.value} value={Number(option.value)}>
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
        {errors.id_category && (
          <p className={errorClass}>{errors.id_category.message}</p>
        )}
      </div>

      {product ? (
        <div className="flex flex-col gap-3">
          <span className={labelClass}>Imágenes</span>

          {imageManager.images.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {imageManager.images.map((img, index) => (
                <ExistingImageItem
                  key={img.id}
                  image={img}
                  isMain={index === 0}
                  busy={imageManager.busyIds.includes(img.id)}
                  onReplace={(file) => imageManager.replaceImage(img.id, file)}
                  onDelete={() => {
                    if (
                      window.confirm("¿Estás seguro de eliminar esta imagen?")
                    ) {
                      imageManager.removeImage(img.id);
                    }
                  }}
                />
              ))}
            </ul>
          ) : product.image_url ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/30">
                <Image
                  src={product.image_url}
                  alt={product.name_product}
                  fill
                  unoptimized={product.image_url.startsWith("http")}
                  className="object-cover"
                />
              </div>
              <p className="text-xs text-white/50">
                Imagen principal actual del producto.
              </p>
            </div>
          ) : null}

          <ImageUploader
            multiple
            label="Agregar imágenes"
            files={imageFiles}
            onFilesChange={setImageFiles}
            onUpload={async (file) => {
              await imageManager.addFiles([file]);
            }}
            onError={(message) => showToast(message, "error")}
          />
        </div>
      ) : (
        <div>
          <ImageUploader
            multiple
            label="Imágenes"
            helperText="Puedes agregar varias imágenes. La primera será la principal."
            files={imageFiles}
            onFilesChange={setImageFiles}
            onError={(message) => showToast(message, "error")}
          />
        </div>
      )}

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={saveDisabled}
          className="min-h-11 flex-1 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveDisabled
            ? "Guardando…"
            : product
              ? "Guardar cambios"
              : "Agregar producto"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={saveDisabled}
          className="min-h-11 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-gray-300 transition-colors hover:bg-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

const ExistingImageItem = ({
  image,
  isMain,
  busy,
  onReplace,
  onDelete,
}: {
  image: ProductImage;
  isMain: boolean;
  busy: boolean;
  onReplace: (file: File) => void;
  onDelete: () => void;
}) => {
  const { showToast } = useToastStore();

  const handleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      showToast(error, "error");
      return;
    }
    onReplace(file);
  };

  return (
    <li className="relative flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
      <div className="relative h-20 w-full overflow-hidden rounded-lg bg-black/30">
        <Image
          src={image.image_url}
          alt="Imagen del producto"
          fill
          unoptimized={image.image_url.startsWith("http")}
          className="object-cover"
        />
        {isMain && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-[#1DD317] px-2 py-0.5 text-[10px] font-bold text-[#07110C]">
            Principal
          </span>
        )}
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50">
            <FiLoader className="animate-spin text-[#1DD317]" />
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-1">
        <label className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg bg-white/10 text-[11px] font-semibold text-white transition-colors hover:bg-white/20">
          <FiRefreshCw size={12} /> Reemplazar
          <input
            type="file"
            accept={IMAGE_ACCEPT_ATTR}
            className="hidden"
            disabled={busy}
            onChange={handleReplace}
          />
        </label>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          aria-label="Eliminar imagen"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-300 transition-colors hover:bg-red-500/40 disabled:opacity-50"
        >
          <FiTrash2 size={13} />
        </button>
      </div>
    </li>
  );
};
