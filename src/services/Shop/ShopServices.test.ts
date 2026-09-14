import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Review } from "@/src/types/ReviewTypes";

vi.mock("@/src/services/apiClient", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "@/src/services/apiClient";
import {
  createShopReview,
  getShopReviews,
  requestShopDeactivation,
  approveShopDeactivation,
  rejectShopDeactivation,
  reactivateShop,
  ReviewAlreadyExistsError,
} from "./ShopServices";

const mockRequest = vi.mocked(apiRequest);

describe("ShopServices", () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  describe("createShopReview", () => {
    it("publica la reseña correctamente", async () => {
      const review: Review = {
        id_review: 9,
        id_shop: 1,
        id_user: 3,
        rating: 5,
        comment: "Excelente",
        created_at: "2026-01-01",
        full_name: "Ana",
      };
      mockRequest.mockResolvedValue(review);

      const result = await createShopReview(1, {
        rating: 5,
        comment: "Excelente",
      });

      expect(mockRequest).toHaveBeenCalledWith("/shops/1/reviews", {
        method: "POST",
        body: { rating: 5, comment: "Excelente" },
      });
      expect(result.rating).toBe(5);
    });

    it("lanza ReviewAlreadyExistsError si el usuario ya publicó una reseña", async () => {
      mockRequest.mockRejectedValue(
        new Error("Ya has publicado una reseña para esta tienda")
      );

      await expect(
        createShopReview(1, { rating: 5 })
      ).rejects.toBeInstanceOf(ReviewAlreadyExistsError);
    });

    it("repropaga errores que no indican reseña duplicada", async () => {
      mockRequest.mockRejectedValue(new Error("Internal Server Error"));

      const error = await createShopReview(1, { rating: 5 }).catch(
        (e) => e
      );

      expect(error).toBeInstanceOf(Error);
      expect(error).not.toBeInstanceOf(ReviewAlreadyExistsError);
      expect(error.message).toBe("Internal Server Error");
    });
  });

  describe("getShopReviews", () => {
    it("extrae la lista cuando la respuesta trae { reviews: [...] }", async () => {
      const reviews: Review[] = [
        {
          id_review: 1,
          id_shop: 1,
          id_user: 3,
          rating: 4,
          comment: "Bueno",
          created_at: "2026-01-01",
          full_name: "Ana",
        },
      ];
      mockRequest.mockResolvedValue({ reviews });

      const result = await getShopReviews(1);

      expect(result).toHaveLength(1);
      expect(result[0].rating).toBe(4);
      expect(mockRequest).toHaveBeenCalledWith(
        "/shops/1/reviews/?skip=0&limit=50",
        { auth: false }
      );
    });

    it("extrae la lista cuando la respuesta es un array directo", async () => {
      const reviews: Review[] = [
        {
          id_review: 2,
          id_shop: 1,
          id_user: 4,
          rating: 3,
          created_at: "2026-01-02",
          full_name: "Luis",
        },
      ];
      mockRequest.mockResolvedValue(reviews);

      const result = await getShopReviews(1);

      expect(result).toHaveLength(1);
      expect(result[0].id_review).toBe(2);
    });
  });

  describe("gestión de estados (desactivación)", () => {
    it("requestShopDeactivation devuelve el estado desde un objeto", async () => {
      mockRequest.mockResolvedValue({
        state: "solicitud_de_desactivacion_pendiente",
      });

      await expect(requestShopDeactivation(1)).resolves.toBe(
        "solicitud_de_desactivacion_pendiente"
      );
      expect(mockRequest).toHaveBeenCalledWith(
        "/shops/1/request-deactivation",
        { method: "POST" }
      );
    });

    it("approveShopDeactivation devuelve el estado como string plano", async () => {
      mockRequest.mockResolvedValue("desactivada_temporalmente");

      await expect(approveShopDeactivation(1)).resolves.toBe(
        "desactivada_temporalmente"
      );
      expect(mockRequest).toHaveBeenCalledWith(
        "/shops/1/admin/approve-deactivation",
        { method: "POST" }
      );
    });

    it("rejectShopDeactivation devuelve el estado persistido", async () => {
      mockRequest.mockResolvedValue({ state: "rechazada" });

      await expect(rejectShopDeactivation(1)).resolves.toBe("rechazada");
      expect(mockRequest).toHaveBeenCalledWith(
        "/shops/1/admin/reject-deactivation",
        { method: "POST" }
      );
    });

    it("reactivateShop devuelve el estado activo", async () => {
      mockRequest.mockResolvedValue({ state: "active" });

      await expect(reactivateShop(1)).resolves.toBe("active");
      expect(mockRequest).toHaveBeenCalledWith("/shops/1/admin/reactivate", {
        method: "POST",
      });
    });
  });
});