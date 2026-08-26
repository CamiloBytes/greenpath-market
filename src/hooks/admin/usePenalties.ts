import { useCallback, useEffect, useState } from "react";
import { useToastStore } from "@/src/stores/toastStore";
import {
  createPenalty,
  getShopPenalties,
  deletePenalty,
} from "@/src/services/Admin/PenaltyServices";
import { getShops } from "@/src/services/Shop/ShopServices";
import type { Penalty, PenaltyPayload } from "@/src/types/SellerRequestTypes";
import type { Shop } from "@/src/types/ShopTypes";

export const usePenalties = () => {
  const { showToast } = useToastStore();
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingPenalties, setLoadingPenalties] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadShops = useCallback(async () => {
    setLoadingShops(true);
    try {
      const data = await getShops({ limit: 200 });
      setShops(data);
      if (data.length > 0) setSelectedShopId(data[0].id_shop);
    } catch {
      showToast("Error al cargar las tiendas", "error");
    } finally {
      setLoadingShops(false);
    }
  }, [showToast]);

  const loadPenalties = useCallback(
    async (shopId: number) => {
      setLoadingPenalties(true);
      try {
        const data = await getShopPenalties(shopId);
        setPenalties(data);
      } catch {
        setPenalties([]);
      } finally {
        setLoadingPenalties(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => loadShops(), 0);
    return () => clearTimeout(timer);
  }, [loadShops]);

  useEffect(() => {
    if (selectedShopId) {
      const timer = setTimeout(() => loadPenalties(selectedShopId), 0);
      return () => clearTimeout(timer);
    }
  }, [selectedShopId, loadPenalties]);

  const handleApplyPenalty = useCallback(
    async (reason: string, points: number) => {
      if (!selectedShopId) return;
      setSubmitting(true);
      try {
        const payload: PenaltyPayload = {
          id_shop: selectedShopId,
          reason,
          points_deducted: points,
        };
        await createPenalty(payload);
        showToast("Penalización aplicada exitosamente", "success");
        loadPenalties(selectedShopId);
        loadShops();
      } catch {
        showToast("Error al aplicar la penalización", "error");
      } finally {
        setSubmitting(false);
      }
    },
    [selectedShopId, loadPenalties, loadShops, showToast]
  );

  const handleDeletePenalty = useCallback(
    async (penaltyId: number) => {
      try {
        await deletePenalty(penaltyId);
        showToast("Penalización eliminada", "success");
        if (selectedShopId) loadPenalties(selectedShopId);
        loadShops();
      } catch {
        showToast("Error al eliminar la penalización", "error");
      }
    },
    [selectedShopId, loadPenalties, loadShops, showToast]
  );

  return {
    shops,
    selectedShopId,
    setSelectedShopId,
    penalties,
    loadingShops,
    loadingPenalties,
    submitting,
    handleApplyPenalty,
    handleDeletePenalty,
  };
};
