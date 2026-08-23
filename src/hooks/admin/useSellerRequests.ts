import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/src/context/ToastContext";
import {
  getSellerRequests,
  approveSellerRequest,
  denySellerRequest,
} from "@/src/services/Admin/SellerRequestAdminServices";
import type {
  SellerRequest,
  AdminActionPayload,
} from "@/src/types/SellerRequestTypes";

export const useSellerRequests = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSellerRequests({ status: "pending" });
      setRequests(data);
    } catch {
      showToast("Error al cargar las solicitudes", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => loadRequests(), 0);
    return () => clearTimeout(timer);
  }, [loadRequests]);

  const handleApprove = useCallback(
    async (id: number, note: string) => {
      setProcessing(id);
      try {
        const payload: AdminActionPayload = {
          status: "approved",
          admin_note: note,
        };
        await approveSellerRequest(id, payload);
        showToast("Solicitud aprobada exitosamente", "success");
        loadRequests();
      } catch {
        showToast("Error al aprobar la solicitud", "error");
      } finally {
        setProcessing(null);
      }
    },
    [loadRequests, showToast]
  );

  const handleDeny = useCallback(
    async (id: number, note: string) => {
      setProcessing(id);
      try {
        const payload: AdminActionPayload = {
          status: "denied",
          admin_note: note,
        };
        await denySellerRequest(id, payload);
        showToast("Solicitud denegada", "success");
        loadRequests();
      } catch {
        showToast("Error al denegar la solicitud", "error");
      } finally {
        setProcessing(null);
      }
    },
    [loadRequests, showToast]
  );

  return {
    requests,
    loading,
    processing,
    handleApprove,
    handleDeny,
    refresh: loadRequests,
  };
};
