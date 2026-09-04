import { z } from "zod";

export const userSchema = z.object({
  full_name: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(100, { message: "Máximo 100 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z
    .string()
    .min(2, { message: "Teléfono inválido" })
    .max(100, { message: "Máximo 100 caracteres" }),
  birthdate: z.string().min(1, { message: "Fecha de nacimiento requerida" }),
  id_document_type: z.number().min(1, { message: "Tipo de documento requerido" }),
  document_number: z.string().min(1, { message: "Número de documento requerido" }),
  user_password: z
    .string()
    .min(6, { message: "Mínimo 6 caracteres" }),
  id_rol: z.number().min(1, { message: "Rol requerido" }),
  user_address: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
