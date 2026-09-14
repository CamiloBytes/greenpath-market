"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiEdit2 } from "react-icons/fi";
import type { Shop } from "@/src/types/ShopTypes";
import { ShopStatusBadge } from "../shop/ShopStatusBadge";
import { isShopOperative } from "@/src/utils/shopVisibility";

const noticeClass =
  "rounded-xl border px-4 py-3 text-sm leading-relaxed backdrop-blur-md";

export const ShopManager = ({
  shop,
  onEdit,
  onChangeLogo,
  onRequestDeactivation,
  onRegisterNew,
}: {
  shop: Shop | null;
  onEdit: () => void;
  onChangeLogo: () => void;
  onRequestDeactivation: () => void;
  onRegisterNew: () => void;
}) => {
  if (!shop) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full flex-col items-center gap-4 rounded-2xl border border-dashed border-[#1DD317]/40 bg-[#37963d2d] p-8 text-center backdrop-blur-md"
      >
        <p className="text-sm text-white/70">
          Aún no tienes una tienda. La gestión de tu tienda se habilitará
          cuando un administrador apruebe tu inscripción como vendedor. Puedes
          solicitar la inscripción desde la sección{" "}
          <strong className="text-white">&quot;Ser Vendedor&quot;</strong> de tu
          perfil.
        </p>
      </motion.div>
    );
  }

  const state = shop.state ?? "active";
  const operative = isShopOperative(state);
  const isPending = state === "solicitud_de_desactivacion_pendiente";
  const isDeactivated = state === "desactivada_temporalmente";
  const isEliminated = state === "eliminada";
  const isRejected = state === "rechazada";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full flex-col items-center gap-3 rounded-2xl bg-[#37963d2d] p-6 backdrop-blur-md sm:items-center sm:gap-6 sm:p-8"
    >
      <div className="flex w-full flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
        <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#37963d5e] sm:h-[160px] sm:w-[160px]">
          {shop.logo_url ? (
            <Image
              src={shop.logo_url}
              alt="Logo de la tienda"
              width={160}
              height={160}
              unoptimized={shop.logo_url.startsWith("http")}
              className="object-cover"
            />
          ) : (
            <span className="text-sm text-white/60">No disponible</span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center sm:items-start sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <h2 className="text-2xl font-bold text-white">{shop.shop_name}</h2>
            <ShopStatusBadge state={state} />
          </div>
          <p className="text-sm text-gray-200">
            {shop.description || "Sin descripción"}
          </p>
          <p className="text-sm text-gray-200">{shop.shop_address || ""}</p>

          {operative && (
            <>
              <p className="text-sm text-gray-200">
                Reputación:{" "}
                <span
                  className={`font-bold ${
                    shop.shop_score >= 70
                      ? "text-[#1DD317]"
                      : shop.shop_score >= 40
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  {shop.shop_score}
                </span>
                /100
              </p>
              <p className="text-sm text-gray-300">
                {shop.reviews_count ?? 0} reseña
                {(shop.reviews_count ?? 0) === 1 ? "" : "s"}
              </p>
            </>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            {!isEliminated && (
              <button
                onClick={onEdit}
                className="flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                <FiEdit2 /> Editar tienda
              </button>
            )}

            {!isEliminated && (
              <button
                onClick={onChangeLogo}
                className="min-h-11 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                Cambiar logo
              </button>
            )}

            {isEliminated ? (
              <button
                onClick={onRegisterNew}
                className="min-h-11 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
              >
                Registrar nueva tienda
              </button>
            ) : operative && !isPending ? (
              <button
                onClick={onRequestDeactivation}
                className="min-h-11 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-red-300 transition-colors hover:bg-white/20 hover:text-red-200"
              >
                Solicitar desactivación temporal
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {isPending && (
        <div
          className={`${noticeClass} w-full border-yellow-400/40 bg-yellow-400/10 text-yellow-200`}
        >
          Tu solicitud de desactivación está <strong>pendiente de revisión</strong>.
          La tienda y tus productos continuarán visibles mientras se toma una
          decisión.
        </div>
      )}

      {isDeactivated && (
        <div
          className={`${noticeClass} w-full border-red-400/40 bg-red-500/10 text-red-200`}
        >
          <strong>Tu tienda está desactivada temporalmente.</strong> Tus
          productos no son visibles para otros usuarios.
        </div>
      )}

      {isEliminated && (
        <div
          className={`${noticeClass} w-full border-red-500/40 bg-red-500/15 text-red-200`}
        >
          <strong>Esta tienda fue eliminada.</strong> Debes registrar una nueva
          tienda para volver a vender.
        </div>
      )}

      {isRejected && shop.rejection_reason && (
        <div
          className={`${noticeClass} w-full border-orange-400/40 bg-orange-400/10 text-orange-200`}
        >
          <strong>Solicitud rechazada:</strong> {shop.rejection_reason}. Tu
          tienda continúa operando con normalidad.
        </div>
      )}
    </motion.div>
  );
};