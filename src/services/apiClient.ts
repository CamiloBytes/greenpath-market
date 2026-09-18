export const TOKEN_KEY = "access_token";
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

export class UnauthorizedError extends Error {
  constructor(message = "Tu sesión ha expirado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  formData?: FormData;
  auth?: boolean;
}

export async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();

    if (typeof body.detail === "string") return body.detail;
    if (typeof body.message === "string") return body.message;
    if (Array.isArray(body.detail)) {
      return body.detail
        .map((item: { msg?: string }) => item.msg ?? JSON.stringify(item))
        .join(", ");
    }
    if (body.detail) return JSON.stringify(body.detail);
  } catch {
    // no body to parse
  }

  return "Error inesperado";
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, formData, auth = true }: RequestOptions = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {};
  if (!formData) {
    headers["Content-Type"] = "application/json";
  }
  if (auth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const response = await fetch(url, {
    method,
    headers,
    body: formData ?? (body ? JSON.stringify(body) : undefined),
  });

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearToken();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
      throw new UnauthorizedError(await parseErrorMessage(response));
    }
    throw new Error(await parseErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}