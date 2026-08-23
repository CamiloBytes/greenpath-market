export type SellerRequestStatus = "pending" | "approved" | "denied";

export interface SellerRequest {
  id_request: number;
  id_user: number;
  shop_name: string;
  description: string;
  shop_address: string;
  logo_url: string | null;
  why_seller: string;
  status: SellerRequestStatus;
  admin_note: string | null;
  created_at: string;
}

export interface SellerRequestPayload {
  shop_name: string;
  description: string;
  shop_address: string;
  logo_url: string;
  why_seller: string;
}

export interface Penalty {
  id_penalty: number;
  id_shop: number;
  id_admin: number;
  reason: string;
  points_deducted: number;
  created_at: string;
  shop_name?: string;
}

export interface PenaltyPayload {
  id_shop: number;
  reason: string;
  points_deducted: number;
}

export interface AdminActionPayload {
  status: "approved" | "denied";
  admin_note: string;
}
