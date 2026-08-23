import { apiRequest } from "@/src/services/apiClient";
import type { SellerRequest, AdminActionPayload } from "@/src/types/SellerRequestTypes";

export interface GetSellerRequestsParams {
  status?: string;
  skip?: number;
  limit?: number;
}

export async function getSellerRequests({
  status,
  skip = 0,
  limit = 20,
}: GetSellerRequestsParams = {}): Promise<SellerRequest[]> {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });
  if (status) params.set("status", status);

  const data = await apiRequest<unknown>(`/seller-requests/?${params.toString()}`);
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.detail)) return obj.detail as SellerRequest[];
    if (Array.isArray(obj.items)) return obj.items as SellerRequest[];
    if (Array.isArray(obj.data)) return obj.data as SellerRequest[];
  }
  return [];
}

export async function approveSellerRequest(
  id: number,
  data: AdminActionPayload
): Promise<SellerRequest> {
  return apiRequest<SellerRequest>(`/seller-requests/${id}/approve`, {
    method: "PUT",
    body: data,
  });
}

export async function denySellerRequest(
  id: number,
  data: AdminActionPayload
): Promise<SellerRequest> {
  return apiRequest<SellerRequest>(`/seller-requests/${id}/deny`, {
    method: "PUT",
    body: data,
  });
}
