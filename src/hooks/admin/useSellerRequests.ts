import { useCallback, useEffect, useState } from "react";
import { useToastStore } from "@/src/stores/toastStore";
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
  const { showToast } = useToastStore();
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSellerRequests({ status: "pending" });
      setRequests(data);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
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
      } catch (error) {
        console.error("Error al aprobar solicitud:", error);
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
      } catch (error) {
        console.error("Error al denegar solicitud:", error);
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
