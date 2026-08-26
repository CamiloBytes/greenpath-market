"use client";

import { useState } from "react";
import { usePenalties } from "@/src/hooks/admin/usePenalties";

export const PenaltiesTab = () => {
  const {
    shops,
    selectedShopId,
    setSelectedShopId,
    penalties,
    loadingShops,
    loadingPenalties,
    submitting,
    handleApplyPenalty,
    handleDeletePenalty,
  } = usePenalties();

  const [reason, setReason] = useState("");
  const [points, setPoints] = useState(10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || points <= 0) return;
    await handleApplyPenalty(reason, points);
    setReason("");
    setPoints(10);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div>
        <h3 className="mb-4 text-xl font-bold text-white">
          Aplicar Penalización
        </h3>

        {loadingShops ? (
          <p className="text-gray-300 italic">Cargando tiendas...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-xl w-full rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
          >
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-white">
                Seleccionar Tienda:
              </label>
              <select
                value={selectedShopId ?? ""}
                onChange={(e) => setSelectedShopId(Number(e.target.value))}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[#1DD317] transition-colors"
              >
                {shops.map((shop) => (
                  <option key={shop.id_shop} value={shop.id_shop} className="bg-[#07110C]">
                    {shop.shop_name} (Score: {shop.shop_score})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-white">
                Razón:
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej: Producto no llegó al cliente"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-[#1DD317] transition-colors"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-white">
                Puntos a deducir:
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[#1DD317] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !reason || !selectedShopId}
              className="w-full rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Aplicando..." : "Aplicar Penalización"}
            </button>
          </form>
        )}
      </div>

      {selectedShopId && (
        <div>
          <h3 className="mb-4 text-xl font-bold text-white">
            Penalizaciones de la Tienda
          </h3>

          {loadingPenalties ? (
            <p className="text-gray-300 italic">
              Cargando penalizaciones...
            </p>
          ) : penalties.length === 0 ? (
            <p className="text-center text-gray-300 italic">
              Esta tienda no tiene penalizaciones.
            </p>
          ) : (
            <div className="flex flex-col gap-3 max-w-xl w-full">
              {penalties.map((penalty) => (
                <div
                  key={penalty.id_penalty}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {penalty.reason}
                    </p>
                    <p className="text-xs text-gray-400">
                      -{penalty.points_deducted} puntos ·{" "}
                      {new Date(penalty.created_at).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePenalty(penalty.id_penalty)}
                    className="ml-4 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/20 hover:text-white transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
