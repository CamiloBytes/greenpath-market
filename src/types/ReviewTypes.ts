import type { ShopState } from "./ShopTypes";

export interface ReviewUser {
  full_name?: string;
  email?: string;
  id_user?: number;
}

export interface Review {
  id_review?: number;
  id_shop?: number;
  id_user?: number;
  rating: number;
  comment?: string | null;
  created_at?: string;
  full_name?: string;
  user?: ReviewUser | null;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

export interface ShopProductState {
  shop_state?: ShopState;
}