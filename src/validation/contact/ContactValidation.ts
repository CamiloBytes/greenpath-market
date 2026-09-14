import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "Email inválido" }),
  message: z.string().min(1, { message: "El mensaje es requerido" }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
