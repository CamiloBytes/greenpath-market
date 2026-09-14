import { z } from "zod";

export const penaltySchema = z.object({
  id_shop: z.number().min(1, { message: "Selecciona una tienda" }),
  reason: z
    .string()
    .min(5, { message: "Mínimo 5 caracteres" }),
  points_deducted: z
    .number()
    .int()
    .min(1, { message: "Mínimo 1 punto" })
    .max(100, { message: "Máximo 100 puntos" }),
});

export type PenaltyFormData = z.infer<typeof penaltySchema>;
