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
import { useAuth } from "@/src/context/AuthContext";
import { loginUser } from "@/src/services/Auth/AuthServices";

export const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();

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
      className=" flex flex-col items-center justify-center gap-6 md:gap-8 w-8/12"
    >
      <div className="w-full flex flex-col gap-2 justify-start items-start text-white">
        <h1 className="text-5xl font-bold text-center ">Login</h1>
      </div>
      <Input
        type="email"
        placeholder="Email"
        label="Email"
        register={register("email")}
        error={errors.email?.message}
      />

      <Input
        type="password"
        placeholder="Password"
        label="Password"
        register={register("password")}
        error={errors.password?.message}
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
        {isSubmitting ? "Signing in..." : "sign in"}
      </Button>
    </form>
  );
};
