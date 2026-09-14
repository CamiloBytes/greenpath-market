import { useCallback, useEffect, useState } from "react";
import {
  createShopReview,
  getShopById,
  getShopReviews,
  ReviewAlreadyExistsError,
} from "@/src/services/Shop/ShopServices";
import { useShopStore } from "@/src/stores/shopStore";
import { isShopHidden, isShopReviewable } from "@/src/utils/shopVisibility";
import { useToastStore } from "@/src/stores/toastStore";
import { useAuthStore } from "@/src/stores/authStore";
import type { Shop } from "@/src/types/ShopTypes";
import type { CreateReviewPayload, Review } from "@/src/types/ReviewTypes";

export const useShopDetail = (shopId: number) => {
  const { showToast } = useToastStore();
  const { user } = useAuthStore();
  const upsertShop = useShopStore((s) => s.upsertShop);

  const [shop, setShop] = useState<Shop | null>(null);
  const [shopLoading, setShopLoading] = useState(true);
  const [shopError, setShopError] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  const loadShop = useCallback(async () => {
    setShopLoading(true);
    setShopError(null);
    try {
      const data = await getShopById(shopId);
      setShop(data);
      upsertShop(data);
      setHidden(isShopHidden(data.state));
    } catch (err) {
      setHidden(true);
      setShopError(err instanceof Error ? err.message : "Tienda no encontrada");
    } finally {
      setShopLoading(false);
    }
  }, [shopId, upsertShop]);

  const loadReviews = useCallback(async () => {
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const data = await getShopReviews(shopId);
      setReviews(data);
    } catch (err) {
      setReviewsError(
        err instanceof Error ? err.message : "Error al cargar las reseñas"
      );
    } finally {
      setReviewsLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadShop();
      loadReviews();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadShop, loadReviews]);

  const handleCreateReview = useCallback(
    async (payload: CreateReviewPayload) => {
      setSubmittingReview(true);
      try {
        await createShopReview(shopId, payload);
        showToast("¡Gracias por tu reseña!");
        setReviewFormOpen(false);
        await Promise.all([loadReviews(), loadShop()]);
        useShopStore.getState().refresh(true);
        return true;
      } catch (err) {
        if (err instanceof ReviewAlreadyExistsError) {
          showToast(err.message, "error");
        } else {
          showToast(
            err instanceof Error ? err.message : "Error al publicar la reseña",
            "error"
          );
        }
        return false;
      } finally {
        setSubmittingReview(false);
      }
    },
    [shopId, loadReviews, loadShop, showToast]
  );

  return {
    shop,
    shopLoading,
    shopError,
    hidden,
    reviews,
    reviewsLoading,
    reviewsError,
    showReviews,
    setShowReviews,
    reviewFormOpen,
    setReviewFormOpen,
    submittingReview,
    isAuthenticated: Boolean(user),
    reviewable: shop ? isShopReviewable(shop.state) : false,
    handleCreateReview,
    reloadShop: loadShop,
  };
};