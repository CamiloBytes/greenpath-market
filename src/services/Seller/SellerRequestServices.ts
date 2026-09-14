import { apiRequest } from "@/src/services/apiClient";
import { uploadImage } from "@/src/services/uploads/UploadService";
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

/** Sube el logo de la tienda mediante el endpoint genérico de imágenes. */
export async function uploadSellerRequestLogo(file: File): Promise<string> {
  return uploadImage(file, "logo");
}
