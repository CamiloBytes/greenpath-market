import { apiRequest } from "@/src/services/apiClient";
import type { Penalty, PenaltyPayload } from "@/src/types/SellerRequestTypes";

export async function createPenalty(data: PenaltyPayload): Promise<Penalty> {
  return apiRequest<Penalty>("/penalties/", {
    method: "POST",
    body: data,
  });
}

export async function getShopPenalties(shopId: number): Promise<Penalty[]> {
  const data = await apiRequest<unknown>(`/penalties/shop/${shopId}`);
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.detail)) return obj.detail as Penalty[];
    if (Array.isArray(obj.items)) return obj.items as Penalty[];
    if (Array.isArray(obj.data)) return obj.data as Penalty[];
  }
  return [];
}

export async function deletePenalty(id: number): Promise<void> {
  return apiRequest<void>(`/penalties/${id}`, {
    method: "DELETE",
  });
}
