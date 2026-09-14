"use client";

import { Modal } from "../ui/Modal/Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  busy?: boolean;
  busyLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
  busy = false,
  busyLabel = "Procesando…",
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} danger={danger}>
      <div className="flex flex-col gap-5">
        <div className="text-sm leading-relaxed text-gray-200">{message}</div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`min-h-11 flex-1 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
              danger
                ? "bg-red-600 hover:bg-red-500"
                : "bg-gradient-to-r from-[#284827] to-[#1DD317] hover:opacity-90"
            }`}
          >
            {busy ? busyLabel : confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="min-h-11 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-gray-300 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-60"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};