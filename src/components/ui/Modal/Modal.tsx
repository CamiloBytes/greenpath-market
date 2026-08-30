"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  danger?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  eyebrow,
  title,
  children,
  danger = false,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-end justify-center backdrop-blur-sm sm:items-center sm:p-4"
        >
          <div className="absolute inset-0 bg-black/70" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 80, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.97 }}
            transition={{ type: "spring", damping: 30, stiffness: 340 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-3xl border bg-gradient-to-b from-[#1a3a2a] to-[#0d1f15] shadow-2xl sm:max-h-[85dvh] sm:max-w-lg sm:rounded-3xl ${
              danger ? "border-red-400/30" : "border-white/10"
            }`}
          >
            <div
              aria-hidden
              className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-white/20 sm:hidden"
            />

            <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-4 sm:px-8 sm:pt-6">
              <div className="min-w-0">
                {eyebrow && (
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.3em] ${
                      danger ? "text-red-400" : "text-[#1DD317]"
                    }`}
                  >
                    {eyebrow}
                  </p>
                )}
                <h2 className="font-display text-2xl font-bold tracking-tight text-white">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#1DD317]"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
