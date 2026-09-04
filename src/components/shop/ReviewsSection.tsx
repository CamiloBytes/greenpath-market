"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Stars, starsFromShopScore } from "@/src/components/ui/Stars";
import type { Review } from "@/src/types/ReviewTypes";

export const ReviewsSection = ({
  reviews,
  loading,
  error,
  reviewsCount,
  shopScore,
  showReviews,
  onToggleReviews,
}: {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  reviewsCount?: number;
  shopScore: number;
  showReviews: boolean;
  onToggleReviews: () => void;
}) => {
  const count = reviewsCount ?? reviews.length;
  const stars = starsFromShopScore(shopScore);

  return (
    <section
      id="resenas"
      className="rounded-2xl border border-white/10 bg-[#37963d2d] p-6 backdrop-blur-md"
    >
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
        <div>
          <h2 className="text-xl font-bold text-white">Reseñas de clientes</h2>
          <p className="mt-1 text-sm text-gray-300">
            {count === 0
              ? "Aún no hay reseñas"
              : `${count} reseña${count === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Stars value={stars} size={28} />
          <p className="text-sm font-semibold text-[#1DD317]">
            {Math.round(shopScore)}/100 · {stars.toFixed(1)}/5
          </p>
        </div>
      </div>

      <div className="mt-4 text-center sm:text-right">
        <button
          onClick={onToggleReviews}
          className="min-h-11 rounded-full bg-white/10 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/20"
        >
          {showReviews ? "Ocultar reseñas" : "Ver reseñas"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showReviews && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-5 border-t border-white/10 pt-5">
              {loading ? (
                <p className="py-6 text-center text-sm text-gray-300 italic">
                  Cargando reseñas…
                </p>
              ) : error ? (
                <p className="py-6 text-center text-sm text-red-400 italic">
                  {error}
                </p>
              ) : reviews.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-300 italic">
                  Aún no hay reseñas. ¡Sé el primero en opinar!
                </p>
              ) : (
                <ul className="custom-scrollbar flex max-h-[28rem] flex-col gap-4 overflow-y-auto pr-1">
                  {reviews.map((review, index) => (
                    <li
                      key={review.id_review ?? index}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1DD317]/20 text-sm font-bold text-[#1DD317]">
                            {(review.full_name ??
                              review.user?.full_name ??
                              "Cliente")
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-white">
                              {review.full_name ??
                                review.user?.full_name ??
                                "Cliente"}
                            </p>
                            {review.created_at && (
                              <p className="text-xs text-gray-400">
                                {new Date(review.created_at).toLocaleDateString(
                                  "es-CO",
                                  { year: "numeric", month: "short", day: "numeric" }
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                        <Stars value={review.rating} size={14} />
                      </div>
                      {review.comment && (
                        <p className="mt-3 text-sm leading-relaxed text-gray-200">
                          {review.comment}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};