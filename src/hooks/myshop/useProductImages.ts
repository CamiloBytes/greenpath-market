import { useCallback, useEffect, useRef, useState } from "react";
import type { Product, ProductImage } from "@/src/types/ProductTypes";
import {
  addProductImages,
  deleteProductImage,
  replaceProductImage,
} from "@/src/services/Dashboard/ProductServices";
import { useToastStore } from "@/src/stores/toastStore";
import { mapUploadError } from "@/src/utils/imageUpload";

export const useProductImages = (
  product: Product | null,
  onImagesChange?: (productId: number, images: ProductImage[]) => void
) => {
  const { showToast } = useToastStore();
  const productId = product?.id_product ?? 0;
  const handleRef = useRef(onImagesChange);

  useEffect(() => {
    handleRef.current = onImagesChange;
  }, [onImagesChange]);

  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
  const [busyIds, setBusyIds] = useState<number[]>([]);
  const [activeOps, setActiveOps] = useState(0);

  const uploading = activeOps > 0;

  const begin = useCallback(() => setActiveOps((n) => n + 1), []);
  const end = useCallback(() => setActiveOps((n) => n - 1), []);

  const commit = useCallback(
    (next: ProductImage[]) => {
      handleRef.current?.(productId, next);
    },
    [productId]
  );

  const addFiles = useCallback(
    async (files: File[]) => {
      if (!productId || files.length === 0) return;
      begin();
      try {
        const added = await addProductImages(productId, files);
        setImages((prev) => {
          const next = [...prev, ...added];
          commit(next);
          return next;
        });
        showToast("Imágenes agregadas exitosamente");
      } catch (err) {
        showToast(mapUploadError(err), "error");
      } finally {
        end();
      }
    },
    [productId, begin, end, commit, showToast]
  );

  const replaceImage = useCallback(
    async (imageId: number, file: File) => {
      if (!productId) return;
      setBusyIds((prev) => [...prev, imageId]);
      begin();
      try {
        const updated = await replaceProductImage(imageId, file);
        setImages((prev) => {
          const next = prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  image_url: updated.image_url,
                  image_public_id: updated.image_public_id,
                }
              : img
          );
          commit(next);
          return next;
        });
        showToast("Imagen reemplazada exitosamente");
      } catch (err) {
        showToast(mapUploadError(err), "error");
      } finally {
        end();
        setBusyIds((prev) => prev.filter((id) => id !== imageId));
      }
    },
    [productId, begin, end, commit, showToast]
  );

  const removeImage = useCallback(
    async (imageId: number) => {
      if (!productId) return;
      setBusyIds((prev) => [...prev, imageId]);
      begin();
      try {
        await deleteProductImage(imageId);
        setImages((prev) => {
          const next = prev.filter((img) => img.id !== imageId);
          commit(next);
          return next;
        });
        showToast("Imagen eliminada exitosamente");
      } catch (err) {
        showToast(mapUploadError(err), "error");
      } finally {
        end();
        setBusyIds((prev) => prev.filter((id) => id !== imageId));
      }
    },
    [productId, begin, end, commit, showToast]
  );

  return {
    images,
    uploading,
    busyIds,
    addFiles,
    replaceImage,
    removeImage,
  };
};