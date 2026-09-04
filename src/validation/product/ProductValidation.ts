import { z } from "zod";

export const productFormSchema = z.object({
  name_product: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(100, { message: "Máximo 100 caracteres" }),
  price: z.coerce.number().positive({ message: "Precio debe ser mayor a 0" }),
  stock: z.coerce.number().int().min(0, { message: "Stock mínimo 0" }),
  product_description: z.string().optional(),
  id_category: z.coerce.number().min(1, { message: "Selecciona una categoría" }),
  product_star_rate: z.coerce.number().min(0).max(5).default(0),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
