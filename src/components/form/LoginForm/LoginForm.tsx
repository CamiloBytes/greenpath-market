"use client";

import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import {
  LoginFormData,
  loginSchema,
} from "@/src/validation/auth/AuthValidation";
import { useAuthStore } from "@/src/stores/authStore";
import { loginUser } from "@/src/services/Auth/AuthServices";

export const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginUser(data.email, data.password);

      login(result.access_token, {
        id_user: result.user_id,
        full_name: result.user_name,
        email: result.email,
        role_id: result.role_id,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("root", {
        type: "server",
        message:
          error instanceof Error ? error.message : "Error al iniciar sesión",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center gap-6 md:gap-7 w-full max-w-md"
    >
      <div className="w-full flex flex-col items-center gap-2 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1DD317]">
          República de GreenPath
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
          Ingresa a tu cuenta
        </h1>
        <p className="text-sm text-white/55">
          Comercia directo, sin intermediarios.
        </p>
      </div>

      <Input
        type="email"
        label="Correo electrónico"
        autoComplete="email"
        register={register("email")}
        error={errors.email?.message}
      />

      <Input
        type="password"
        label="Contraseña"
        autoComplete="current-password"
        register={register("password")}
        error={errors.password?.message}
      />

      {errors.root && (
        <div
          role="alert"
          className="w-full rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          {errors.root.message}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? "Ingresando…" : "Iniciar sesión"}
      </Button>
    </form>
  );
};
