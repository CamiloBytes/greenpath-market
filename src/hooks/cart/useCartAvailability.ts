import { useEffect, useState } from "react";
import { useCartStore } from "@/src/stores/cartStore";
import { useShopStore } from "@/src/stores/shopStore";
import { getUnavailableCartItemIds } from "@/src/utils/shopVisibility";

/** Detecta items del carrito cuyas tiendas están desactivadas o eliminadas. */
export const useCartAvailability = () => {
  const cart = useCartStore((s) => s.cart);
  const [unavailableIds, setUnavailableIds] = useState<Set<number>>(new Set());
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    useShopStore
      .getState()
      .refresh()
      .then((shops) => {
        if (!active) return;
        setUnavailableIds(getUnavailableCartItemIds(cart, shops));
      })
      .catch(() => {
        if (active) setUnavailableIds(new Set());
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [cart]);

  return {
    unavailableIds,
    checking,
    hasUnavailable: unavailableIds.size > 0,
  };
};