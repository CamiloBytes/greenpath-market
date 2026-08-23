export type ProfileView = "pedidos" | "ayuda" | "metodo" | "seller-request" | "logout";

export interface EditableField {
  key: string;
  label: string;
  display: string;
  inputType?: "text" | "email";
  editable?: boolean;
}