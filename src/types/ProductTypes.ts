import type { ShopState } from "./ShopTypes";

export interface ProductImage {
  id: number;
  image_url: string;
  image_public_id: string;
  position: number;
  created_at?: string;
}

export interface Product {
  id_product: number;
  name_product: string;
  price: number;
  stock: number;
  image_url: string;
  image_public_id?: string | null;
  images?: ProductImage[];
  shop_name: string;
  id_shop?: number;
  shop_state?: ShopState;
  id_category?: number;
  product_description?: string;
}

export interface ProductFormData {
  name_product: string;
  stock: number;
  price: number;
  product_description: string;
  id_category: number;
  imageFiles: File[];
}
