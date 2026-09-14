"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiChevronDown } from "react-icons/fi";
import { usePenalties } from "@/src/hooks/admin/usePenalties";
import {
  penaltySchema,
  type PenaltyFormData,
} from "@/src/validation/penalty/PenaltyValidation";

const fieldClass =
  "w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-red-400 focus:bg-white/15 [color-scheme:dark]";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60";
const errorClass = "mt-1 text-xs text-red-400";

export const PenaltiesTab = () => {
  const {
    shops,
    selectedShopId,
    setSelectedShopId,
    loadingShops,
    submitting,
    handleApplyPenalty,
  } = usePenalties();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<PenaltyFormData>({
    resolver: zodResolver(penaltySchema),
    defaultValues: {
      id_shop: selectedShopId ?? 0,
      reason: "",
      points_deducted: 10,
    },
  });

  const watchIdShop = useWatch({ control, name: "id_shop" });

  useEffect(() => {
    if (selectedShopId) {
      reset((prev) => ({ ...prev, id_shop: selectedShopId }));
    }
  }, [selectedShopId, reset]);

  useEffect(() => {
    if (watchIdShop) {
      setSelectedShopId(watchIdShop);
    }
  }, [watchIdShop, setSelectedShopId]);

  const onSubmit = async (data: PenaltyFormData) => {
    await handleApplyPenalty(data.reason, data.points_deducted);
    reset({ id_shop: data.id_shop, reason: "", points_deducted: 10 });
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
            onSubmit={handleSubmit(onSubmit)}
            className="w-full rounded-2xl border border-red-400/20 bg-white/5 p-5 backdrop-blur-md sm:p-6"
          >
            <div className="mb-4">
              <label htmlFor="penalty-shop" className={labelClass}>
                Tienda
              </label>
              <div className="relative">
                <select
                  id="penalty-shop"
                  {...register("id_shop", { valueAsNumber: true })}
                  className={`${fieldClass} appearance-none pr-10 [&>option]:bg-[#07110C]`}
                >
                  <option value={0}>Seleccionar tienda</option>
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
              {errors.id_shop && (
                <p className={errorClass}>{errors.id_shop.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="penalty-reason" className={labelClass}>
                Razón
              </label>
              <textarea
                id="penalty-reason"
                {...register("reason")}
                rows={2}
                placeholder="Ej: El producto no llegó al cliente"
                className={`${fieldClass} resize-none`}
              />
              {errors.reason && (
                <p className={errorClass}>{errors.reason.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="w-full sm:w-40">
                <label htmlFor="penalty-points" className={labelClass}>
                  Puntos a deducir
                </label>
                <input
                  id="penalty-points"
                  type="number"
                  {...register("points_deducted", { valueAsNumber: true })}
                  min={1}
                  max={100}
                  inputMode="numeric"
                  className={fieldClass}
                />
                {errors.points_deducted && (
                  <p className={errorClass}>{errors.points_deducted.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="min-h-11 flex-1 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
