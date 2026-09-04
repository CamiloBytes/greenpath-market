import { apiRequest } from "@/src/services/apiClient";

export function extractImageUrl(data: unknown): string | null {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.image_url === "string") return obj.image_url;
    if (typeof obj.url === "string") return obj.url;
    if (typeof obj.secure_url === "string") return obj.secure_url;
    if (obj.detail && typeof obj.detail === "object") {
      const detail = obj.detail as Record<string, unknown>;
      if (typeof detail.image_url === "string") return detail.image_url;
      if (typeof detail.url === "string") return detail.url;
      if (typeof detail.secure_url === "string") return detail.secure_url;
    }
  }
  return null;
}

/** Sube una imagen al endpoint genérico del backend (Cloudinary) y devuelve su URL.
 *  Usar únicamente cuando no exista un endpoint específico para la entidad. */
export async function uploadImage(
  file: File,
  field: string = "image"
): Promise<string> {
  const formData = new FormData();
  formData.append(field, file);

  const data = await apiRequest<unknown>("/uploads/image", {
    method: "POST",
    formData,
  });

  const url = extractImageUrl(data);
  if (!url) throw new Error("No se pudo subir la imagen");
  return url;
}