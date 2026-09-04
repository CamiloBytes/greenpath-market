export interface Category {
  id_category: number;
  category_name: string;
  image_url: string;
  image_public_id?: string | null;
}

export interface CategoryFormData {
  category_name: string;
  imageFile: File | null;
}