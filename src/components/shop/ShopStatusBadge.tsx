"use client";

import type { ShopState } from "@/src/types/ShopTypes";

const BADGE_STYLES: Record<ShopState, { label: string; className: string }> = {
  active: {
    label: "Activa",
    className: "bg-[#1DD317]/15 text-[#4ade80] border-[#1DD317]/40",
  },
  solicitud_de_desactivacion_pendiente: {
    label: "Desactivación pendiente",
    className: "bg-yellow-400/15 text-yellow-300 border-yellow-400/40",
  },
  desactivada_temporalmente: {
    label: "Desactivada temporalmente",
    className: "bg-red-500/15 text-red-300 border-red-400/40",
  },
  eliminada: {
    label: "Eliminada",
    className: "bg-red-500/20 text-red-300 border-red-500/40",
  },
  rechazada: {
    label: "Solicitud rechazada",
    className: "bg-orange-400/15 text-orange-300 border-orange-400/40",
  },
};

export const ShopStatusBadge = ({
  state,
}: {
  state?: ShopState;
}) => {
  const style = state ? BADGE_STYLES[state] : BADGE_STYLES.active;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${style.className}`}
    >
      {style.label}
    </span>
  );
};