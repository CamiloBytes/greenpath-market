export const IMAGE_ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const IMAGE_MAX_SIZE_MB = 5;

export const IMAGE_ERRORS = {
  invalidType: "Solo puedes subir imágenes JPG, JPEG, PNG o WEBP",
  tooLarge: "La imagen supera el tamaño máximo permitido",
  forbidden: "No tienes permiso para modificar las imágenes de este recurso",
  network: "No fue posible subir la imagen. Inténtalo nuevamente",
} as const;

export function validateImageFile(
  file: File,
  maxSizeMB: number = IMAGE_MAX_SIZE_MB
): string | null {
  if (!IMAGE_ALLOWED_TYPES.includes(file.type)) {
    return IMAGE_ERRORS.invalidType;
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return IMAGE_ERRORS.tooLarge;
  }
  return null;
}

const FORBIDDEN_PATTERN = /permiso|permission|forbidden|autoriz|403/gi;

export function mapUploadError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message === IMAGE_ERRORS.invalidType || message === IMAGE_ERRORS.tooLarge) {
    return message;
  }
  if (FORBIDDEN_PATTERN.test(message)) {
    return IMAGE_ERRORS.forbidden;
  }
  return IMAGE_ERRORS.network;
}

export const IMAGE_ACCEPT_ATTR = "image/jpeg,image/png,image/webp";