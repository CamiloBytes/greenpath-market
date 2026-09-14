import { z } from "zod";

export const sellerRequestSchema = z.object({
  shop_name: z
    .string()
    .min(2, { message: "Mínimo 2 caracteres" })
    .max(100, { message: "Máximo 100 caracteres" }),
  description: z
    .string()
    .min(10, { message: "Mínimo 10 caracteres" }),
  shop_address: z.string().max(255, { message: "Máximo 255 caracteres" }).optional(),
  why_seller: z
    .string()
    .min(10, { message: "Mínimo 10 caracteres" }),
});

export type SellerRequestFormData = z.infer<typeof sellerRequestSchema>;
