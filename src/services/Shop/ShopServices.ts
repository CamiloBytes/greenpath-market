import { apiRequest } from "@/src/services/apiClient";
import type {
  CreateShopPayload,
  Shop,
  ShopState,
  UpdateShopPayload,
} from "@/src/types/ShopTypes";
import type { CreateReviewPayload, Review } from "@/src/types/ReviewTypes";

export interface GetShopsParams {
  skip?: number;
  limit?: number;
}

export interface GetReviewsParams {
  skip?: number;
  limit?: number;
}

export class ReviewAlreadyExistsError extends Error {
  constructor(message = "Ya has publicado una reseña para esta tienda") {
    super(message);
    this.name = "ReviewAlreadyExistsError";
  }
}

const REVIEW_EXISTS_PATTERN = /ya|already|una sola|once|duplic/i;

function extractList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.detail)) return obj.detail as T[];
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.reviews)) return obj.reviews as T[];
  }
  return [];
}

function extractState(data: unknown): ShopState {
  if (typeof data === "string") return data as ShopState;
  if (data && typeof data === "object") {
    const state = (data as Record<string, unknown>).state;
    if (typeof state === "string") return state as ShopState;
  }
  throw new Error("No se pudo actualizar el estado de la tienda");
}

export async function getShops({
  skip = 0,
  limit = 100,
}: GetShopsParams = {}): Promise<Shop[]> {
  const query = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });

  const data = await apiRequest<unknown>(`/shops/?${query.toString()}`);
  return extractList<Shop>(data);
}

export async function getShopById(id: number): Promise<Shop> {
  const data = await apiRequest<unknown>(`/shops/${id}`);
  if (data && typeof data === "object" && "id_shop" in data) {
    return data as Shop;
  }
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (obj.detail && typeof obj.detail === "object") {
      return obj.detail as Shop;
    }
  }
  throw new Error("Tienda no encontrada");
}

export async function createShop(data: CreateShopPayload): Promise<Shop> {
  return apiRequest<Shop>("/shops", {
    method: "POST",
    body: data,
  });
}

export async function createShopWithImage(
  formData: FormData
): Promise<Shop> {
  return apiRequest<Shop>("/shops/upload", {
    method: "POST",
    formData,
  });
}

export async function updateShop(
  id: number,
  data: UpdateShopPayload
): Promise<Shop> {
  return apiRequest<Shop>(`/shops/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function updateShopWithImage(
  id: number,
  formData: FormData
): Promise<Shop> {
  return apiRequest<Shop>(`/shops/upload/${id}`, {
    method: "PUT",
    formData,
  });
}

/** Reemplaza únicamente el logo de una tienda existente. */
export async function replaceShopLogo(
  shopId: number,
  file: File
): Promise<string> {
  const formData = new FormData();
  formData.append("logo", file);

  const data = await apiRequest<unknown>(`/shops/${shopId}/image`, {
    method: "POST",
    formData,
  });

  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.logo_url === "string") return obj.logo_url;
    if (typeof obj.url === "string") return obj.url;
    if (typeof obj.secure_url === "string") return obj.secure_url;
    if (obj.detail && typeof obj.detail === "object") {
      const detail = obj.detail as Record<string, unknown>;
      if (typeof detail.logo_url === "string") return detail.logo_url;
      if (typeof detail.url === "string") return detail.url;
    }
  }
  throw new Error("No se pudo subir el logo de la tienda");
}

export async function deleteShop(id: number): Promise<void> {
  return apiRequest<void>(`/shops/${id}`, {
    method: "DELETE",
  });
}

export async function getShopReviews(
  shopId: number,
  { skip = 0, limit = 50 }: GetReviewsParams = {}
): Promise<Review[]> {
  const query = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });

  const data = await apiRequest<unknown>(
    `/shops/${shopId}/reviews/?${query.toString()}`,
    { auth: false }
  );
  return extractList<Review>(data);
}

/** Crea una reseña. Si el backend reporta que el usuario ya publicó una,
 *  lanza ReviewAlreadyExistsError para que la UI muestre el mensaje exacto. */
export async function createShopReview(
  shopId: number,
  payload: CreateReviewPayload
): Promise<Review> {
  try {
    return await apiRequest<Review>(`/shops/${shopId}/reviews`, {
      method: "POST",
      body: payload,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (REVIEW_EXISTS_PATTERN.test(message)) {
      throw new ReviewAlreadyExistsError();
    }
    throw error;
  }
}

/** El propietario solicita la desactivación temporal de su tienda. */
export async function requestShopDeactivation(
  shopId: number
): Promise<ShopState> {
  return extractState(
    await apiRequest<unknown>(`/shops/${shopId}/request-deactivation`, {
      method: "POST",
    })
  );
}

export async function approveShopDeactivation(
  shopId: number
): Promise<ShopState> {
  return extractState(
    await apiRequest<unknown>(`/shops/${shopId}/admin/approve-deactivation`, {
      method: "POST",
    })
  );
}

export async function rejectShopDeactivation(
  shopId: number
): Promise<ShopState> {
  return extractState(
    await apiRequest<unknown>(`/shops/${shopId}/admin/reject-deactivation`, {
      method: "POST",
    })
  );
}

export async function reactivateShop(shopId: number): Promise<ShopState> {
  return extractState(
    await apiRequest<unknown>(`/shops/${shopId}/admin/reactivate`, {
      method: "POST",
    })
  );
}