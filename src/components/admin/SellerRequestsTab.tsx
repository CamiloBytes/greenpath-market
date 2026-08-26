"use client";

import { useState } from "react";
import { useSellerRequests } from "@/src/hooks/admin/useSellerRequests";
import { FaUser, FaShieldAlt } from "react-icons/fa";

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
    <div className="mx-auto max-w-3xl">
      <h3 className="mb-6 text-xl font-bold text-white">
        Solicitudes Pendientes
      </h3>

      {requests.length === 0 ? (
        <p className="text-center text-gray-300 italic">
          No hay solicitudes pendientes.
        </p>
      ) : (
        <div className="flex flex-col gap-5 p-4">
          {requests.map((req) => {
            const serial = `GP-${new Date(req.created_at).getFullYear()}-${String(req.id_request).padStart(4, "0")}`;
            return (
              <div
                key={req.id_request}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A1A12]/80 backdrop-blur-md"
              >
                {/* Watermark */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
                  <span className="rotate-[-12deg] text-[5rem] font-black uppercase tracking-widest text-white select-none">
                    GREENPATH
                  </span>
                </div>

                <div className="relative p-5">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1DD317]">
                        Solicitud de Comercio
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">
                        República de GreenPath
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="mb-1 text-[10px] font-semibold tracking-wider text-gray-400">
                        SN: <span className="text-white">{serial}</span>
                      </p>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yellow-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                        Pendiente
                      </span>
                    </div>
                  </div>

                  {/* Body: Avatar + Info */}
                  <div className="mb-4 flex gap-4">
                    {/* Avatar */}
                    <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      {req.logo_url ? (
                        <img
                          src={req.logo_url}
                          alt={req.shop_name}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        <FaUser className="text-2xl text-gray-500" />
                      )}
                    </div>

                    {/* Shop Info */}
                    <div className=" flex flex-col w-full justify-between ">
                      <h4 className="mb-2 text-xl font-bold uppercase tracking-wide text-white">
                        {req.shop_name}
                      </h4>

                      <div className="flex items-center justify-between ">
                        <div>
                          <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            Fecha
                          </p>
                          <p className="text-sm font-semibold text-white">
                            {new Date(req.created_at).toLocaleDateString("es-CO")}
                          </p>
                        </div>
                        <div className="text-right  ">
                          <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            Categoría / Propósito
                          </p>
                          <p className="text-sm font-semibold text-white">
                            {req.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Ubicación
                        </p>
                        <p className="text-sm font-semibold text-white">
                          {req.shop_address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security Question */}
                  <div className="mb-4 rounded-xl border border-l-4 border-l-[#1DD317] border-white/10 bg-white/5 px-4 py-3">
                    <div className="mb-1.5 flex items-center gap-2">
                      <FaShieldAlt className="text-xs text-[#1DD317]" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        ¿Por qué quiere ser vendedor?
                      </p>
                    </div>
                    <p className="text-sm italic text-gray-400">
                      &quot;{req.why_seller}&quot;
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => openActionModal(req.id_request, "approve")}
                      disabled={processing === req.id_request}
                      className="flex flex-1 items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => openActionModal(req.id_request, "deny")}
                      disabled={processing === req.id_request}
                      className="flex flex-1 items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      Denegar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
