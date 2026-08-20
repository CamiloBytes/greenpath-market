"use client";

import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Select } from "../../ui/Select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterFormData,
  registerSchema,
} from "@/src/validation/auth/AuthValidation";
import { registerUser } from "@/src/services/Auth/AuthServices";
import type { SelectOption } from "../../ui/Select";

interface RegisterFormProps {
  onSuccess?: () => void;
}

const DOCUMENT_TYPES: SelectOption[] = [
  { value: "1", label: "Cédula de ciudadanía (CC)" },
  { value: "2", label: "Tarjeta de identidad (TI)" },
  { value: "3", label: "NIT" },
  { value: "4", label: "Cédula de extranjería (CE)" },
  { value: "5", label: "Pasaporte" },
];

const ROLES: SelectOption[] = [
  { value: "1", label: "Cliente" },
  { value: "2", label: "Vendedor" },
];

const DEFAULT_VALUES: RegisterFormData = {
  fullName: "",
  email: "",
  phone: "",
  idDocumentType: "",
  birthdate: "",
  documentNumber: "",
  roleId: "1",
  password: "",
  confirmPassword: "",
  address: "",
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);

      onSuccess?.();
    } catch (error) {
      setError("root", {
        type: "server",
        message:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al registrar usuario",
      });
    }
  };

  const fieldProps = (field: keyof RegisterFormData) => ({
    register: register(field),
    error: errors[field]?.message,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center md:w-8/12"
    >
      <div className="w-full flex flex-col gap-2 justify-start items-start text-white">
        <h1 className="text-5xl font-bold text-center ">Register</h1>
        <div className="w-full flex flex-col gap-4 flex-wrap justify-start items-center text-white">
          <Input
            type="text"
            placeholder="Full Name"
            label="Full Name"
            {...fieldProps("fullName")}
          />
          <Input
            type="email"
            placeholder="Email"
            label="Email"
            {...fieldProps("email")}
          />
          <Input
            type="text"
            placeholder="Phone"
            label="Phone"
            {...fieldProps("phone")}
          />
          <Select
            label="ID Type"
            options={DOCUMENT_TYPES}
            {...fieldProps("idDocumentType")}
          />
          <Input
            type="date"
            label="Date of Birth"
            placeholder="Date of Birth"
            {...fieldProps("birthdate")}
          />
          <Input
            type="text"
            placeholder="ID Number"
            label="ID Number"
            {...fieldProps("documentNumber")}
          />
          <Select label="Role" options={ROLES} {...fieldProps("roleId")} />
          <Input
            type="password"
            placeholder="Password"
            label="Password"
            {...fieldProps("password")}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            label="Confirm Password"
            {...fieldProps("confirmPassword")}
          />
          <Input
            type="address"
            placeholder="Address"
            label="Address"
            {...fieldProps("address")}
          />

          {errors.root && (
            <p role="alert" className="text-sm text-red-500">
              {errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-10 w-1/2 transform hover:scale-105 transition duration-300"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </Button>
        </div>
      </div>
    </form>
  );
};