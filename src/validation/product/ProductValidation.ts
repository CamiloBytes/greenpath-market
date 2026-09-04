import { z } from "zod";

export const productFormSchema = z.object({
  name_product: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(100, { message: "Máximo 100 caracteres" }),
  price: z.number().positive({ message: "Precio debe ser mayor a 0" }),
  stock: z.number().int().min(0, { message: "Stock mínimo 0" }),
  product_description: z.string(),
  id_category: z.number().min(1, { message: "Selecciona una categoría" }),
  product_star_rate: z.number().min(0).max(5),
  imageFiles: z.array(z.instanceof(File)),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
