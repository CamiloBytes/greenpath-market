import { useCallback, useEffect, useState } from "react";
import { getProducts, searchProducts } from "@/src/services/Dashboard/ProductServices";
import type { Product } from "@/src/types/ProductTypes";
import { useCartStore } from "@/src/stores/cartStore";
import { useToastStore } from "@/src/stores/toastStore";
import { useProductEvents } from "@/src/hooks/feature/useProductEvents";
import { useShopStore } from "@/src/stores/shopStore";
import { filterProductsFromVisibleShops } from "@/src/utils/shopVisibility";

export const useProducts = (searchQuery?: string) => {
  const { addToCart } = useCartStore();
  const { showToast } = useToastStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyVisibility = useCallback(async (list: Product[]): Promise<Product[]> => {
    try {
      const shops = await useShopStore.getState().refresh();
      return filterProductsFromVisibleShops(list, shops);
    } catch {
      return list;
    }
  }, []);

  useEffect(() => {
    let active = true;

    const load = searchQuery
      ? searchProducts({ keyword: searchQuery })
      : getProducts();

    load
      .then(async (data) => {
        const visible = await applyVisibility(data);
        if (active) setProducts(visible);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Error al cargar productos"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [searchQuery, applyVisibility]);

  useProductEvents({
    onCreated: async (product) => {
      if (searchQuery) return;
      const visible = await applyVisibility([product]);
      if (visible.length === 0) return;
      setProducts((prev) =>
        prev.some((p) => p.id_product === product.id_product)
          ? prev
          : [product, ...prev]
      );
    },
    onUpdated: async (product) => {
      const visible = await applyVisibility([product]);
      if (visible.length === 0) {
        setProducts((prev) =>
          prev.filter((p) => p.id_product !== product.id_product)
        );
        return;
      }
      setProducts((prev) =>
        prev.map((p) =>
          p.id_product === product.id_product ? { ...p, ...product } : p
        )
      );
    },
    onDeleted: (product) => {
      setProducts((prev) =>
        prev.filter((p) => p.id_product !== product.id_product)
      );
    },
  });

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product);
      showToast(`${product.name_product} agregado al carrito`);
    },
    [addToCart, showToast]
  );

  return {
    products,
    loading,
    error,
    handleAddToCart,
  };
};