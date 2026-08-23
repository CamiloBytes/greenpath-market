export interface Product {
  id_product: number;
  name_product: string;
  price: number;
  stock: number;
  image_url: string;
  shop_name: string;
  id_category?: number;
  product_description?: string;
}

export interface ProductFormData {
  name_product: string;
  stock: number;
  price: number;
  product_description: string;
  id_category: number;
  imageFile: File | null;
}
