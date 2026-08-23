import { apiRequest } from "@/src/services/apiClient";
import type { SellerRequest, SellerRequestPayload } from "@/src/types/SellerRequestTypes";

export async function createSellerRequest(data: SellerRequestPayload): Promise<SellerRequest> {
  return apiRequest<SellerRequest>("/seller-requests/", {
    method: "POST",
    body: data,
  });
}

export async function getMySellerRequest(): Promise<SellerRequest | null> {
  try {
    return await apiRequest<SellerRequest>("/seller-requests/my");
  } catch {
    return null;
  }
}
