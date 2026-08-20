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

  return apiRequest<Product[]>(`/products/?${query.toString()}`, {
    auth: false,
  });
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

  return apiRequest<Product[]>(`/search/?${params.toString()}`, {
    auth: false,
  });
}