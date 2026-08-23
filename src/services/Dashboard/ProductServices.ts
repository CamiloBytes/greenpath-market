import type { Product } from "@/src/types/ProductTypes";
import { apiRequest } from "@/src/services/apiClient";

export interface GetProductsParams {
  skip?: number;
  limit?: number;
}

export interface SearchProductsParams {
  keyword: string;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
}

export async function getProducts({
  skip = 0,
  limit = 20,
}: GetProductsParams = {}): Promise<Product[]> {
  const query = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });

  const data = await apiRequest<unknown>(`/products/?${query.toString()}`, {
    auth: false,
  });
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.detail)) return obj.detail as Product[];
    if (Array.isArray(obj.items)) return obj.items as Product[];
    if (Array.isArray(obj.data)) return obj.data as Product[];
  }
  return [];
}

export async function searchProducts({
  keyword,
  category,
  minPrice,
  maxPrice,
}: SearchProductsParams): Promise<Product[]> {
  const params = new URLSearchParams({ keyword });

  if (category !== undefined) params.set("category", String(category));
  if (minPrice !== undefined) params.set("min_price", String(minPrice));
  if (maxPrice !== undefined) params.set("max_price", String(maxPrice));

  const data = await apiRequest<unknown>(`/search/?${params.toString()}`, {
    auth: false,
  });
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.detail)) return obj.detail as Product[];
    if (Array.isArray(obj.items)) return obj.items as Product[];
    if (Array.isArray(obj.data)) return obj.data as Product[];
  }
  return [];
}

export interface CreateProductPayload {
  name_product: string;
  stock: number;
  price: number;
  product_description: string;
  id_shop: number;
  image_url?: string;
  product_star_rate: number;
  id_category: number;
}

export interface UpdateProductPayload {
  name_product: string;
  stock: number;
  price: number;
  product_description: string;
  id_shop: number;
  product_star_rate: number;
  id_category: number;
}

export async function getShopProducts(shopId: number): Promise<Product[]> {
  const data = await apiRequest<unknown>(`/products/shop/${shopId}`);
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.detail)) return obj.detail as Product[];
    if (Array.isArray(obj.items)) return obj.items as Product[];
    if (Array.isArray(obj.data)) return obj.data as Product[];
  }
  return [];
}

export async function getProductById(id: number): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`);
}

export async function createProduct(
  data: CreateProductPayload
): Promise<Product> {
  return apiRequest<Product>("/products", {
    method: "POST",
    body: data,
  });
}

export async function createProductWithImage(
  formData: FormData
): Promise<Product> {
  return apiRequest<Product>("/products/upload", {
    method: "POST",
    formData,
  });
}

export async function updateProduct(
  id: number,
  data: UpdateProductPayload
): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteProduct(id: number): Promise<void> {
  return apiRequest<void>(`/products/${id}`, {
    method: "DELETE",
  });
}