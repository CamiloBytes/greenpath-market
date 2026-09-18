import { apiRequest } from "@/src/services/apiClient";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  user_name: string;
  email: string;
  role_id: number;
  message: string;
}

export interface UserProfile {
  id_user: number;
  full_name: string;
  birthdate?: string;
  email: string;
  phone: string;
  id_document_type: number;
  document_number: string;
  id_rol: number;
  user_address?: string;
  avatar_url?: string | null;
  avatar_public_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AvatarUploadResponse {
  avatar_url?: string;
  avatar_public_id?: string;
  url?: string;
  secure_url?: string;
}

export async function uploadAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("avatar", file);

  const data = await apiRequest<unknown>("/users/me/avatar", {
    method: "POST",
    formData,
  });

  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.avatar_url === "string") return obj.avatar_url;
    if (typeof obj.url === "string") return obj.url;
    if (typeof obj.secure_url === "string") return obj.secure_url;
    if (obj.detail && typeof obj.detail === "object") {
      const detail = obj.detail as Record<string, unknown>;
      if (typeof detail.avatar_url === "string") return detail.avatar_url;
      if (typeof detail.url === "string") return detail.url;
    }
  }
  throw new Error("No se pudo subir la imagen");
}

export interface RegisterFormPayload {
  fullName: string;
  birthdate: string;
  email: string;
  phone: string;
  idDocumentType: string;
  documentNumber: string;
  password: string;
  address: string;
}

export interface RegisterApiPayload {
  full_name: string;
  birthdate: string;
  email: string;
  phone: string;
  id_document_type: number;
  document_number: string;
  user_password: string;
  user_address: string;
}

export function toRegisterApiPayload(data: RegisterFormPayload): RegisterApiPayload {
  return {
    full_name: data.fullName,
    birthdate: data.birthdate,
    email: data.email,
    phone: data.phone,
    id_document_type: Number(data.idDocumentType),
    document_number: data.documentNumber,
    user_password: data.password,
    user_address: data.address,
  };
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("login/", {
    method: "POST",
    auth: false,
    body: { email, password },
  });
}

export interface VerifyPayload {
  email: string;
  code: string;
}

export interface VerifyResponse {
  id_user: number;
  full_name: string;
  email: string;
  role_id?: number;
  access_token?: string;
  message: string;
}

export async function registerUser(data: RegisterFormPayload) {
  return apiRequest<{ message: string; email: string }>("/register/", {
    method: "POST",
    auth: false,
    body: toRegisterApiPayload(data),
  });
}

export async function verifyUser(data: VerifyPayload): Promise<VerifyResponse> {
  return apiRequest<VerifyResponse>("/register/verify", {
    method: "POST",
    auth: false,
    body: data,
  });
}

export async function getProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>("/users/me/profile");
}

export type UpdateUserPayload = Partial<
  Pick<UserProfile, "full_name" | "email" | "user_address">
>;

export async function updateUser(
  id: number,
  data: UpdateUserPayload
): Promise<UserProfile> {
  return apiRequest<UserProfile>(`/users/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return payload.exp * 1000 < Date.now();
}

export function getUserFromToken(token: string) {
  const payload = decodeToken(token);

  if (
    !payload ||
    typeof payload.exp !== "number" ||
    payload.exp * 1000 < Date.now()
  ) {
    return null;
  }

  return {
    id_user:
      typeof payload.sub !== "undefined" ? Number(payload.sub) : undefined,
    email: typeof payload.email === "string" ? payload.email : undefined,
    role_id:
      typeof payload.role_id !== "undefined" ? Number(payload.role_id) : undefined,
  };
}