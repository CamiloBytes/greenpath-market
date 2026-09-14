import { useCallback, useEffect, useState } from "react";
import { useToastStore } from "@/src/stores/toastStore";
import {
  createSellerRequest,
  getMySellerRequest,
} from "@/src/services/Seller/SellerRequestServices";
import type {
  SellerRequest,
  SellerRequestPayload,
} from "@/src/types/SellerRequestTypes";

export const useSellerRequest = () => {
  const { showToast } = useToastStore();
  const [request, setRequest] = useState<SellerRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadRequest = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMySellerRequest();
      setRequest(data);
    } catch {
      showToast("Error al cargar la solicitud", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => loadRequest(), 0);
    return () => clearTimeout(timer);
  }, [loadRequest]);

  const submitRequest = useCallback(
    async (payload: SellerRequestPayload) => {
      setSubmitting(true);
      try {
        const result = await createSellerRequest(payload);
        setRequest(result);
        showToast("Solicitud enviada exitosamente", "success");
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Error al enviar la solicitud",
          "error"
        );
      } finally {
        setSubmitting(false);
      }
    },
    [showToast]
  );

  return {
    request,
    loading,
    submitting,
    submitRequest,
    refresh: loadRequest,
  };
};
