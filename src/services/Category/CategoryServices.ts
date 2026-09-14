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

export async function getCategoryById(id: number): Promise<Category> {
  return apiRequest<Category>(`/categories/${id}`);
}

export async function createCategoryWithImage(
  categoryName: string,
  image: File
): Promise<Category> {
  const formData = new FormData();
  formData.append("category_name", categoryName);
  formData.append("image", image);

  return apiRequest<Category>("/categories/upload", {
    method: "POST",
    formData,
  });
}

export async function updateCategoryWithImage(
  categoryId: number,
  categoryName?: string,
  image?: File
): Promise<Category> {
  const formData = new FormData();
  if (categoryName) formData.append("category_name", categoryName);
  if (image) formData.append("image", image);

  return apiRequest<Category>(`/categories/upload/${categoryId}`, {
    method: "PUT",
    formData,
  });
}

export async function deleteCategory(categoryId: number): Promise<void> {
  return apiRequest<void>(`/categories/${categoryId}`, {
    method: "DELETE",
  });
}
