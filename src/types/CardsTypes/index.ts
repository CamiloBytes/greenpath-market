import type { Product } from "../ProductTypes";

export interface CardCategoryProps {
  imageUrl: string;
  title: string;
  onClick?: () => void;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}
