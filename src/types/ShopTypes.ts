export type ShopState =
  | "active"
  | "solicitud_de_desactivacion_pendiente"
  | "desactivada_temporalmente"
  | "eliminada"
  | "rechazada";

export interface Shop {
  id_shop: number;
  id_user: number;
  shop_name: string;
  description: string;
  shop_address: string;
  logo_url: string | null;
  logo_public_id?: string | null;
  is_active?: boolean;
  state?: ShopState;
  shop_score: number;
  reviews_count?: number;
  rejection_reason?: string | null;
}

export interface CreateShopPayload {
  id_user: number;
  shop_name: string;
  description: string;
  shop_address: string;
  is_active: boolean;
}

export interface UpdateShopPayload {
  id_user?: number;
  shop_name?: string;
  description?: string;
  shop_address?: string;
  is_active?: boolean;
  state?: ShopState;
  logo_url?: string | null;
}

export interface ShopFormData {
  shop_name: string;
  description: string;
  shop_address: string;
  logoFile: File | null;
}