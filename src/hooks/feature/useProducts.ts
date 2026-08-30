import { useCallback, useEffect, useState } from "react";
import { getProducts, searchProducts } from "@/src/services/Dashboard/ProductServices";
import type { Product } from "@/src/types/ProductTypes";
import { useCartStore } from "@/src/stores/cartStore";
import { useToastStore } from "@/src/stores/toastStore";
import { useProductEvents } from "@/src/hooks/feature/useProductEvents";

export const useProducts = (searchQuery?: string) => {
  const { addToCart } = useCartStore();
  const { showToast } = useToastStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = searchQuery
      ? searchProducts({ keyword: searchQuery })
      : getProducts();

    load
      .then((data) => {
        if (active) setProducts(data);
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
  }, [searchQuery]);

  useProductEvents({
    onCreated: (product) => {
      if (searchQuery) return;
      setProducts((prev) =>
        prev.some((p) => p.id_product === product.id_product)
          ? prev
          : [product, ...prev]
      );
    },
    onUpdated: (product) => {
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