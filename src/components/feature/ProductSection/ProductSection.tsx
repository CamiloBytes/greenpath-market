"use client";

import { ProductCard } from "../../ui/Cards";
import type { Product } from "@/src/types/ProductTypes";
import { useProducts } from "@/src/hooks/feature/useProducts";
import { motion } from "framer-motion";

export const ProductSection = ({
  category,
  searchQuery,
}: {
  category?: number;
  searchQuery?: string;
}) => {
  const { products, loading, error, handleAddToCart } = useProducts(searchQuery);

  const filtered = searchQuery
    ? products
    : category && category > 0
      ? products.filter((p) => p.id_category === category)
      : products;

  return (
    <section className="flex flex-col mt-12">
      <div className="flex flex-col items-start justify-center pt-6 gap-4">
        <h2 className="text-3xl font-bold tracking-wider text-white">
          {searchQuery ? `Results for "${searchQuery}"` : "Products"}
        </h2>
      </div>

      {loading ? (
        <p className="mt-8 text-center text-gray-300 italic">
          Cargando productos...
        </p>
      ) : error ? (
        <p className="mt-8 text-center text-red-400 italic">{error}</p>
      ) : filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {filtered.map((product: Product) => (
            <motion.div
              key={product.id_product}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-center text-gray-300 italic">
          No hay productos disponibles.
        </p>
      )}
    </section>
  );
};