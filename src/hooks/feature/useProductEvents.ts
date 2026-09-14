"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/src/types/ProductTypes";

export type ProductEventType = "created" | "updated" | "deleted";

export interface ProductEvent {
  type: ProductEventType;
  product: Product;
}

interface UseProductEventsParams {
  onCreated?: (product: Product) => void;
  onUpdated?: (product: Product) => void;
  onDeleted?: (product: Product) => void;
}

export const useProductEvents = ({
  onCreated,
  onUpdated,
  onDeleted,
}: UseProductEventsParams) => {
  const handlers = useRef({ onCreated, onUpdated, onDeleted });

  useEffect(() => {
    handlers.current = { onCreated, onUpdated, onDeleted };
  }, [onCreated, onUpdated, onDeleted]);

  useEffect(() => {
    const source = new EventSource(
      `${process.env.API_URL}/products/stream`
    );

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ProductEvent;
        const current = handlers.current;

        if (data.type === "created") current.onCreated?.(data.product);
        if (data.type === "updated") current.onUpdated?.(data.product);
        if (data.type === "deleted") current.onDeleted?.(data.product);
      } catch {
        return;
      }
    };

    return () => {
      source.close();
    };
  }, []);
};
