"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import { useToastStore, type ToastType } from "@/src/stores/toastStore";

const TOAST_STYLES: Record<
  ToastType,
  { icon: React.ReactNode; className: string }
> = {
  success: {
    icon: <FaCheckCircle className="text-[#1DD317]" />,
    className: "border-[#1DD317]/30",
  },
  error: {
    icon: <FaTimesCircle className="text-red-400" />,
    className: "border-red-400/30",
  },
  info: {
    icon: <FaInfoCircle className="text-sky-400" />,
    className: "border-sky-400/30",
  },
};

export const ToastContainer = () => {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ x: 110, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 110, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`pointer-events-auto flex items-center gap-3 rounded-2xl border bg-[#0A1A12]/95 px-4 py-3 shadow-xl shadow-black/40 backdrop-blur-md ${style.className}`}
            >
              <span className="text-lg">{style.icon}</span>
              <p className="text-sm font-medium text-white">{toast.message}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
