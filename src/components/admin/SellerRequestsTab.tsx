"use client";

import { useState } from "react";
import { useSellerRequests } from "@/src/hooks/admin/useSellerRequests";

export const SellerRequestsTab = () => {
  const { requests, loading, processing, handleApprove, handleDeny } =
    useSellerRequests();
  const [actionNote, setActionNote] = useState("");
  const [activeRequestId, setActiveRequestId] = useState<number | null>(null);
  const [activeAction, setActiveAction] = useState<"approve" | "deny" | null>(
    null
  );

  const openActionModal = (id: number, action: "approve" | "deny") => {
    setActiveRequestId(id);
    setActiveAction(action);
    setActionNote("");
  };

  const confirmAction = async () => {
    if (!activeRequestId || !activeAction) return;
    if (activeAction === "approve") {
      await handleApprove(activeRequestId, actionNote);
    } else {
      await handleDeny(activeRequestId, actionNote);
    }
    setActiveRequestId(null);
    setActiveAction(null);
    setActionNote("");
  };

  if (loading) {
    return (
      <p className="text-center text-gray-300 italic">
        Cargando solicitudes pendientes...
      </p>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-xl font-bold text-white">
        Solicitudes Pendientes
      </h3>

      {requests.length === 0 ? (
        <p className="text-center text-gray-300 italic">
          No hay solicitudes pendientes.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((req) => (
            <div
              key={req.id_request}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {req.shop_name}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {req.description}
                  </p>
                </div>
                <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-300 border border-yellow-500/40">
                  Pendiente
                </span>
              </div>

              <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Dirección:</strong>{" "}
                  {req.shop_address}
                </p>
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Fecha:</strong>{" "}
                  {new Date(req.created_at).toLocaleDateString("es-CO")}
                </p>
              </div>

              <div className="mb-4 rounded-xl bg-white/5 p-3">
                <p className="text-sm text-gray-300">
                  <strong className="text-white">
                    ¿Por qué quiere ser vendedor?
                  </strong>
                </p>
                <p className="mt-1 text-sm text-gray-400">{req.why_seller}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openActionModal(req.id_request, "approve")}
                  disabled={processing === req.id_request}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => openActionModal(req.id_request, "deny")}
                  disabled={processing === req.id_request}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Denegar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeRequestId && activeAction && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4">
          <div
            className="w-full max-w-md rounded-2xl bg-[#1a2e1a] p-6 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-bold text-white">
              {activeAction === "approve"
                ? "Aprobar Solicitud"
                : "Denegar Solicitud"}
            </h3>
            <p className="mb-3 text-sm text-gray-300">
              {activeAction === "approve"
                ? "Ingresa una nota para el vendedor (opcional):"
                : "Indica la razón por la cual se deniega la solicitud:"}
            </p>
            <textarea
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              rows={3}
              placeholder={
                activeAction === "approve"
                  ? "Solicitud aprobada, tienda verificada"
                  : "Falta documentación"
              }
              className="mb-4 w-full resize-none rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-[#1DD317] transition-colors"
            />
            <div className="flex gap-3">
              <button
                onClick={confirmAction}
                disabled={processing === activeRequestId}
                className={`flex-1 rounded-lg px-4 py-2.5 font-semibold text-white transition-colors disabled:opacity-50 ${
                  activeAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {processing === activeRequestId
                  ? "Procesando..."
                  : "Confirmar"}
              </button>
              <button
                onClick={() => {
                  setActiveRequestId(null);
                  setActiveAction(null);
                }}
                className="flex-1 rounded-lg bg-gray-600 px-4 py-2.5 font-semibold text-white hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
