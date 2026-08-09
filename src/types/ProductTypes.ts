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
