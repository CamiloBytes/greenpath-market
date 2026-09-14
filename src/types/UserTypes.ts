export interface User {
  id_user: number;
  full_name: string;
  birthdate: string;
  email: string;
  phone: string;
  id_document_type: number;
  document_number: string;
  id_rol: number;
  user_address?: string;
  avatar_url?: string | null;
  avatar_public_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserFormData {
  full_name: string;
  birthdate: string;
  email: string;
  phone: string;
  id_document_type: number;
  document_number: string;
  user_password: string;
  id_rol: number;
  user_address?: string;
}
