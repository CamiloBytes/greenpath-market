export interface Category {
  id_category: number;
  name_category: string;
  category_name: string;
  image_url: string | null;
  image_public_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryFormData {
  category_name: string;
  imageFile: File | null;
}
