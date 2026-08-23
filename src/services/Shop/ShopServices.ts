import { apiRequest } from "@/src/services/apiClient";
import type {
  CreateShopPayload,
  Shop,
  UpdateShopPayload,
} from "@/src/types/ShopTypes";

export interface GetShopsParams {
  skip?: number;
  limit?: number;
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
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.detail)) return obj.detail as Shop[];
    if (Array.isArray(obj.items)) return obj.items as Shop[];
    if (Array.isArray(obj.data)) return obj.data as Shop[];
  }
  return [];
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

export async function deleteShop(id: number): Promise<void> {
  return apiRequest<void>(`/shops/${id}`, {
    method: "DELETE",
  });
}