"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "../ui/Modal/Modal";
import { StarRatingInput } from "./StarRatingInput";
import type { CreateReviewPayload } from "@/src/types/ReviewTypes";

const reviewSchema = z.object({
  rating: z
    .number()
    .int("La calificación debe ser un número entero")
    .min(1, "Debes seleccionar entre 1 y 5 estrellas")
    .max(5, "Debes seleccionar entre 1 y 5 estrellas"),
  comment: z
    .string()
    .trim()
    .max(500, "El comentario no puede superar los 500 caracteres")
    .optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;
const DEFAULT_VALUES: ReviewFormValues = { rating: 0, comment: "" };

const fieldClass =
  "w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-[#1DD317] focus:bg-white/15";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60";

export const ReviewFormModal = ({
  isOpen,
  shopName,
  submitting,
  onSubmit,
  onClose,
}: {
  isOpen: boolean;
  shopName: string;
  submitting: boolean;
  onSubmit: (payload: CreateReviewPayload) => Promise<boolean>;
  onClose: () => void;
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const submit = handleSubmit(async (values) => {
    const ok = await onSubmit({
      rating: values.rating,
      comment: values.comment ? values.comment.trim() : undefined,
    });
    if (ok) reset(DEFAULT_VALUES);
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Reseñas"
      title={`Reseña para ${shopName}`}
    >
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <div>
          <span className={labelClass}>Calificación (obligatoria)</span>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <StarRatingInput
                value={field.value}
                onChange={field.onChange}
                disabled={submitting}
              />
            )}
          />
          {errors.rating && (
            <p role="alert" className="mt-2 text-center text-sm text-red-400">
              {errors.rating.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="review-comment" className={labelClass}>
            Comentario (opcional)
          </label>
          <textarea
            id="review-comment"
            rows={4}
            maxLength={500}
            placeholder="Cuéntanos tu experiencia con esta tienda"
            {...register("comment")}
            aria-invalid={errors.comment ? "true" : "false"}
            className={`${fieldClass} resize-none`}
          />
          {errors.comment && (
            <p role="alert" className="mt-1.5 text-sm text-red-400">
              {errors.comment.message}
            </p>
          )}
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="min-h-11 flex-1 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Publicando…" : "Publicar reseña"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="min-h-11 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-gray-300 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};