import { z } from "zod";

export const shopFormSchema = z.object({
  shop_name: z
    .string()
    .min(2, { message: "Mínimo 2 caracteres" })
    .max(100, { message: "Máximo 100 caracteres" }),
  description: z.string().min(1, { message: "La descripción es requerida" }),
  shop_address: z.string(),
});

export type ShopFormData = z.infer<typeof shopFormSchema>;
