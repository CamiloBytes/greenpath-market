import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: "Full name must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(6, { message: "Invalid phone number" }),
    idDocumentType: z.string().min(1, { message: "Select an ID type" }),
    birthdate: z.string().min(1, { message: "Date of birth is required" }),
    documentNumber: z.string().min(1, { message: "ID number is required" }),
    roleId: z.string().min(1, { message: "Select a role" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    address: z.string().min(1, { message: "Address is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;