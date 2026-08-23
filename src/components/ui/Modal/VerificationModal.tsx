"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiCheckCircle, FiArrowLeft, FiShield } from "react-icons/fi";

interface VerificationModalProps {
  isOpen: boolean;
  email: string;
  onVerify: (code: string) => Promise<void>;
  verifying: boolean;
  verifyError: string | null;
  onClose?: () => void;
}

export const VerificationModal = ({
  isOpen,
  email,
  onVerify,
  verifying,
  verifyError,
  onClose,
}: VerificationModalProps) => {
  const [step, setStep] = useState<"sent" | "input">("sent");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "input" && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  useEffect(() => {
    if (!isOpen) {
      setStep("sent");
      setCode(["", "", "", "", "", ""]);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== "")) {
      onVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const newCode = pasted.split("").concat(Array(6 - pasted.length).fill(""));
      setCode(newCode);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
      if (pasted.length === 6) {
        onVerify(pasted);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-[#1a3a2a] to-[#0d1f15] p-8 shadow-2xl"
          >
            {step === "sent" ? (
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1DD317]/20">
                  <FiMail className="h-10 w-10 text-[#1DD317]" />
                </div>

                <h2 className="mb-2 text-2xl font-bold text-white">
                  ¡Código enviado!
                </h2>

                <p className="mb-6 text-sm text-gray-300">
                  Hemos enviado un código de verificación a tu correo electrónico.
                </p>

                <div className="mb-6 w-full rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-1 text-xs text-gray-400">
                    Código enviado a:
                  </p>
                  <p className="text-sm font-semibold text-[#1DD317]">{email}</p>
                </div>

                <div className="mb-6 flex items-start gap-3 rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 text-left">
                  <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-blue-300">
                      Revisa tu bandeja de entrada
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Si no encuentras el correo, revisa la carpeta de spam o
                      correo no deseado.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStep("input")}
                  className="w-full rounded-xl bg-[#1DD317] px-6 py-3 text-sm font-bold text-[#07110C] transition-colors hover:bg-[#16a813]"
                >
                  Ingresar código
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1DD317]/20">
                  <FiShield className="h-10 w-10 text-[#1DD317]" />
                </div>

                <h2 className="mb-2 text-2xl font-bold text-white">
                  Verificar código
                </h2>

                <p className="mb-2 text-sm text-gray-300">
                  Ingresa el código de 6 dígitos que enviamos a:
                </p>
                <p className="mb-6 text-sm font-semibold text-[#1DD317]">
                  {email}
                </p>

                <div className="mb-4 flex gap-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      disabled={verifying}
                      className="h-14 w-12 rounded-xl border border-white/20 bg-white/10 text-center text-xl font-bold text-white outline-none transition-colors focus:border-[#1DD317] disabled:opacity-50"
                    />
                  ))}
                </div>

                {verifyError && (
                  <p className="mb-4 text-sm text-red-400">{verifyError}</p>
                )}

                <button
                  onClick={() => {
                    const fullCode = code.join("");
                    if (fullCode.length === 6) onVerify(fullCode);
                  }}
                  disabled={verifying || code.some((d) => d === "")}
                  className="mb-4 w-full rounded-xl bg-[#1DD317] px-6 py-3 text-sm font-bold text-[#07110C] transition-colors hover:bg-[#16a813] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifying ? "Verificando..." : "Verificar código"}
                </button>

                <button
                  onClick={() => setStep("sent")}
                  disabled={verifying}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <FiArrowLeft />
                  Volver
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
