import { z } from "zod";

export const categorySchema = z.object({
  category_name: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(40, { message: "Máximo 40 caracteres" }),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
