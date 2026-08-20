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
  created_at?: string;
  updated_at?: string;
}

export interface RegisterFormPayload {
  fullName: string;
  birthdate: string;
  email: string;
  phone: string;
  idDocumentType: string;
  documentNumber: string;
  password: string;
  roleId: string;
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
  id_rol: number;
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
    id_rol: Number(data.roleId || "1"),
    user_address: data.address,
  };
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/login/", {
    method: "POST",
    auth: false,
    body: { email, password },
  });
}

export async function registerUser(data: RegisterFormPayload) {
  return apiRequest("/register/", {
    method: "POST",
    auth: false,
    body: toRegisterApiPayload(data),
  });
}

export async function getProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>("/users/me/profile");
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
  };
}