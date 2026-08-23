export interface Shop {
  id_shop: number;
  id_user: number;
  shop_name: string;
  description: string;
  shop_address: string;
  logo_url: string | null;
  is_active: boolean;
  shop_score: number;
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
  logo_url?: string | null;
}

export interface ShopFormData {
  shop_name: string;
  description: string;
  shop_address: string;
  logoFile: File | null;
}