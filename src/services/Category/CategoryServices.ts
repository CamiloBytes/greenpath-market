import { apiRequest } from "@/src/services/apiClient";
import type { Category } from "@/src/types/CategoryTypes";

function extractList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.categories)) return obj.categories as T[];
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.detail)) return obj.detail as T[];
  }
  return [];
}

export async function getCategories(): Promise<Category[]> {
  const data = await apiRequest<unknown>("/categories/");
  return extractList<Category>(data);
}

export interface CategoryPayload {
  category_name: string;
}

export async function createCategory(data: CategoryPayload): Promise<Category> {
  return apiRequest<Category>("/categories", {
    method: "POST",
    body: data,
  });
}

export async function createCategoryWithImage(
  formData: FormData
): Promise<Category> {
  return apiRequest<Category>("/categories/upload", {
    method: "POST",
    formData,
  });
}

export async function updateCategory(
  id: number,
  data: CategoryPayload
): Promise<Category> {
  return apiRequest<Category>(`/categories/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function updateCategoryWithImage(
  id: number,
  formData: FormData
): Promise<Category> {
  return apiRequest<Category>(`/categories/upload/${id}`, {
    method: "PUT",
    formData,
  });
}

export async function deleteCategory(id: number): Promise<void> {
  return apiRequest<void>(`/categories/${id}`, {
    method: "DELETE",
  });
}