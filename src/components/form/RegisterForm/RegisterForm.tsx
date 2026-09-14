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
import { useRegister } from "@/src/hooks/auth/useRegister";
import { VerificationModal } from "../../ui/Modal/VerificationModal";
import type { SelectOption } from "../../ui/Select";

const DOCUMENT_TYPES: SelectOption[] = [
  { value: "1", label: "Cédula de ciudadanía (CC)" },
  { value: "2", label: "Tarjeta de identidad (TI)" },
  { value: "3", label: "NIT" },
  { value: "4", label: "Cédula de extranjería (CE)" },
  { value: "5", label: "Pasaporte" },
];

const DEFAULT_VALUES: RegisterFormData = {
  fullName: "",
  email: "",
  phone: "",
  idDocumentType: "",
  birthdate: "",
  documentNumber: "",
  password: "",
  confirmPassword: "",
  address: "",
};

const FieldGroup = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div
    role="group"
    aria-label={title}
    className="w-full border-t border-white/10 pt-3 flex flex-col gap-2.5 sm:gap-3"
  >
    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1DD317]">
      {title}
    </p>
    {children}
  </div>
);

export const RegisterForm = () => {
  const {
    step,
    registeredEmail,
    verifying,
    verifyError,
    loading,
    error,
    register: doRegister,
    verify,
  } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = (data: RegisterFormData) => {
    doRegister(data);
  };

  const fieldProps = (field: keyof RegisterFormData) => ({
    register: register(field),
    error: errors[field]?.message,
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-4 w-full max-w-md"
      >
        <div className="w-full flex flex-col items-center gap-1.5 pb-1 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1DD317]">
            República de GreenPath
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
            Crea tu cuenta
          </h1>
          <p className="text-sm text-white/55">
            Únete al mercado de los productores locales.
          </p>
        </div>

        <FieldGroup title="Tus datos">
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              type="text"
              label="Nombre completo"
              autoComplete="name"
              {...fieldProps("fullName")}
            />
            <Input
              type="date"
              label="Fecha de nacimiento"
              {...fieldProps("birthdate")}
            />
          </div>
        </FieldGroup>

        <FieldGroup title="Tu documento">
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Select
              label="Tipo de documento"
              options={DOCUMENT_TYPES}
              {...fieldProps("idDocumentType")}
            />
            <Input
              type="text"
              label="Número de documento"
              inputMode="numeric"
              {...fieldProps("documentNumber")}
            />
          </div>
        </FieldGroup>

        <FieldGroup title="Tu contacto">
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              type="email"
              label="Correo electrónico"
              autoComplete="email"
              {...fieldProps("email")}
            />
            <Input
              type="tel"
              label="Teléfono"
              autoComplete="tel"
              {...fieldProps("phone")}
            />
          </div>
          <Input
            type="text"
            label="Dirección"
            autoComplete="street-address"
            {...fieldProps("address")}
          />
        </FieldGroup>

        <FieldGroup title="Tu acceso">
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              type="password"
              label="Contraseña"
              autoComplete="new-password"
              {...fieldProps("password")}
            />
            <Input
              type="password"
              label="Confirmar contraseña"
              autoComplete="new-password"
              {...fieldProps("confirmPassword")}
            />
          </div>

          {(errors.root || error) && (
            <div
              role="alert"
              className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {errors.root?.message ?? error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="mt-1 w-full">
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </Button>
        </FieldGroup>
      </form>

      <VerificationModal
        isOpen={step === "verification"}
        email={registeredEmail}
        onVerify={verify}
        verifying={verifying}
        verifyError={verifyError}
      />
    </>
  );
};
