import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/src/stores/toastStore";
import { useAuthStore } from "@/src/stores/authStore";
import { registerUser, verifyUser } from "@/src/services/Auth/AuthServices";
import type { RegisterFormPayload } from "@/src/services/Auth/AuthServices";

export const useRegister = () => {
  const router = useRouter();
  const { showToast } = useToastStore();
  const { login } = useAuthStore();
  const [step, setStep] = useState<"form" | "verification">("form");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (data: RegisterFormPayload) => {
      setLoading(true);
      setError(null);
      try {
        const result = await registerUser(data);
        setRegisteredEmail(result.email);
        setStep("verification");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Ocurrió un error al registrar usuario";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const verify = useCallback(
    async (code: string) => {
      setVerifying(true);
      setVerifyError(null);
      try {
        const result = await verifyUser({ email: registeredEmail, code });
        setStep("form");
        setRegisteredEmail("");
        showToast("Cuenta verificada exitosamente.", "success");

        if (result.access_token) {
          login(result.access_token, {
            id_user: result.id_user,
            full_name: result.full_name,
            email: result.email,
            role_id: result.role_id,
          });
        }

        router.push("/auth");
      } catch (err) {
        setVerifyError(
          err instanceof Error ? err.message : "Código inválido. Inténtalo de nuevo."
        );
      } finally {
        setVerifying(false);
      }
    },
    [registeredEmail, router, showToast, login]
  );

  const reset = useCallback(() => {
    setStep("form");
    setRegisteredEmail("");
    setVerifyError(null);
    setError(null);
  }, []);

  return {
    step,
    registeredEmail,
    verifying,
    verifyError,
    loading,
    error,
    register,
    verify,
    reset,
  };
};
