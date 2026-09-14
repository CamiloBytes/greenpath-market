"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";
import { useShopDetail } from "@/src/hooks/shop/useShopDetail";
import { ReviewsSection } from "./ReviewsSection";
import { ReviewFormModal } from "./ReviewFormModal";
import { ShopStatusBadge } from "./ShopStatusBadge";
import { ProductCard } from "../ui/Cards";
import { getShopProducts } from "@/src/services/Dashboard/ProductServices";
import { useCartStore } from "@/src/stores/cartStore";
import { useToastStore } from "@/src/stores/toastStore";
import type { Product } from "@/src/types/ProductTypes";

export const ShopDetailPage = ({ shopId }: { shopId: number }) => {
  const { addToCart } = useCartStore();
  const { showToast } = useToastStore();
  const {
    shop,
    shopLoading,
    shopError,
    hidden,
    reviews,
    reviewsLoading,
    reviewsError,
    showReviews,
    setShowReviews,
    reviewFormOpen,
    setReviewFormOpen,
    submittingReview,
    isAuthenticated,
    reviewable,
    handleCreateReview,
  } = useShopDetail(shopId);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getShopProducts(shopId)
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [shopId]);

  const addToCartHandler = (product: Product) => {
    addToCart(product);
    showToast(`${product.name_product} agregado al carrito`);
  };

  if (shopLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        <p className="py-16 text-center text-gray-300 italic">
          Cargando tienda…
        </p>
      </div>
    );
  }

  if (hidden || !shop || shopError) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <span className="text-5xl">🚫</span>
          <h1 className="text-2xl font-bold text-white">
            Esta tienda no está disponible
          </h1>
          <p className="text-sm text-gray-300">
            La tienda fue desactivada o eliminada y sus productos ya no están
            disponibles.
          </p>
          <Link
            href="/dashboard"
            className="rounded-full bg-gradient-to-r from-[#284827] to-[#1DD317] px-8 py-3 font-bold text-white transition-opacity hover:opacity-90"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        href="/dashboard"
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
      >
        <FiArrowLeft /> Volver al mercado
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 flex flex-col items-center gap-6 rounded-2xl bg-[#37963d2d] p-6 backdrop-blur-md sm:flex-row sm:items-center sm:gap-8 sm:p-8"
      >
        <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#37963d5e] sm:h-[160px] sm:w-[160px]">
          {shop.logo_url ? (
            <Image
              src={shop.logo_url}
              alt={`Logo de ${shop.shop_name}`}
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
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {shop.shop_name}
            </h1>
            <ShopStatusBadge state={shop.state} />
          </div>
          <p className="text-sm text-gray-200">
            {shop.description || "Sin descripción"}
          </p>
          <p className="text-sm text-gray-200">{shop.shop_address || ""}</p>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          {isAuthenticated && reviewable ? (
            <button
              onClick={() => setReviewFormOpen(true)}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
            >
              <FiEdit3 /> Escribir reseña
            </button>
          ) : (
            <Link
              href="/auth"
              className="min-h-11 rounded-xl bg-white/10 px-6 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              Inicia sesión para reseñar
            </Link>
          )}
        </div>
      </motion.section>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReviewsSection
          reviews={reviews}
          loading={reviewsLoading}
          error={reviewsError}
          reviewsCount={shop.reviews_count}
          shopScore={shop.shop_score}
          showReviews={showReviews}
          onToggleReviews={() => setShowReviews((v) => !v)}
        />

        <section className="rounded-2xl border border-white/10 bg-[#37963d2d] p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white">Productos de la tienda</h2>
          {productsLoading ? (
            <p className="mt-6 text-center text-sm text-gray-300 italic">
              Cargando productos…
            </p>
          ) : products.length === 0 ? (
            <p className="mt-6 text-center text-sm text-gray-300 italic">
              Esta tienda aún no tiene productos disponibles.
            </p>
          ) : (
            <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {products.map((product) => (
                <ProductCard
                  key={product.id_product}
                  product={product}
                  onAddToCart={addToCartHandler}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <ReviewFormModal
        isOpen={reviewFormOpen}
        shopName={shop.shop_name}
        submitting={submittingReview}
        onSubmit={handleCreateReview}
        onClose={() => !submittingReview && setReviewFormOpen(false)}
      />
    </div>
  );
};