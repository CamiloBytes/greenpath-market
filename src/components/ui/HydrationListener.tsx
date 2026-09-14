"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/stores/authStore";
import { useCartStore } from "@/src/stores/cartStore";

export const HydrationListener = () => {
  useEffect(() => {
    useAuthStore.getState().hydrate();
    useCartStore.getState().hydrate();
  }, []);

  return null;
};
