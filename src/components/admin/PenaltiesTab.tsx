"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { usePenalties } from "@/src/hooks/admin/usePenalties";

const fieldClass =
  "w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-red-400 focus:bg-white/15 [color-scheme:dark]";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60";

export const PenaltiesTab = () => {
  const {
    shops,
    selectedShopId,
    setSelectedShopId,
    loadingShops,
    submitting,
    handleApplyPenalty,
  } = usePenalties();

  const [reason, setReason] = useState("");
  const [points, setPoints] = useState(10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || points <= 0 || !selectedShopId) return;
    await handleApplyPenalty(reason.trim(), points);
    setReason("");
    setPoints(10);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-full max-w-xl">
        <h3 className="mb-1 text-xl font-bold text-white">
          Aplicar penalización
        </h3>
        <p className="mb-4 text-sm text-white/55">
          Se descontarán los puntos indicados del score de la tienda.
        </p>

        {loadingShops ? (
          <p className="text-gray-300 italic">Cargando tiendas…</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full rounded-2xl border border-red-400/20 bg-white/5 p-5 backdrop-blur-md sm:p-6"
          >
            <div className="mb-4">
              <label
                htmlFor="penalty-shop"
                className={labelClass}
              >
                Tienda
              </label>
              <div className="relative">
                <select
                  id="penalty-shop"
                  value={selectedShopId ?? ""}
                  onChange={(e) => setSelectedShopId(Number(e.target.value))}
                  required
                  className={`${fieldClass} appearance-none pr-10 [&>option]:bg-[#07110C]`}
                >
                  {shops.map((shop) => (
                    <option key={shop.id_shop} value={shop.id_shop}>
                      {shop.shop_name} (Score: {shop.shop_score})
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  aria-hidden
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-red-400"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="penalty-reason" className={labelClass}>
                Razón
              </label>
              <textarea
                id="penalty-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={2}
                placeholder="Ej: El producto no llegó al cliente"
                className={`${fieldClass} resize-none`}
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="w-full sm:w-40">
                <label htmlFor="penalty-points" className={labelClass}>
                  Puntos a deducir
                </label>
                <input
                  id="penalty-points"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  min={1}
                  max={100}
                  required
                  inputMode="numeric"
                  className={fieldClass}
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !reason.trim() || !selectedShopId}
                className="min-h-11 flex-1 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Aplicando…" : "Aplicar penalización"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
