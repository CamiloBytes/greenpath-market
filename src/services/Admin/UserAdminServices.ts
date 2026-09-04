import { apiRequest } from "@/src/services/apiClient";
import type { User, UserFormData } from "@/src/types/UserTypes";

export interface GetUsersParams {
  skip?: number;
  limit?: number;
}

export async function getUsers({
  skip = 0,
  limit = 100,
}: GetUsersParams = {}): Promise<User[]> {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });

  const data = await apiRequest<unknown>(`/users/?${params.toString()}`);
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.detail)) return obj.detail as User[];
    if (Array.isArray(obj.items)) return obj.items as User[];
    if (Array.isArray(obj.data)) return obj.data as User[];
  }
  return [];
}

export async function getUserById(id: number): Promise<User> {
  return apiRequest<User>(`/users/${id}`);
}

export async function createUser(data: UserFormData): Promise<User> {
  return apiRequest<User>("/users/", {
    method: "POST",
    body: data,
  });
}

export async function deleteUser(id: number): Promise<void> {
  await apiRequest(`/users/${id}`, {
    method: "DELETE",
  });
}
