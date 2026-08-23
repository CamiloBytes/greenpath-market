import type { Product } from "./ProductTypes";

export interface CartItem extends Product {
  quantity: number;
  added_at: string;
}

export type PaymentMethod =
  | "Visa"
  | "MasterCard"
  | "PayPal"
  | "Amex"
  | "Nequi";

export interface Order {
  id_order: number;
  order_date: string;
  items: CartItem[];
  total: number;
  payment_method: string;
  status: string;
}