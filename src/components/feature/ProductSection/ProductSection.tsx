"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../../ui/Cards";
import { getProducts } from "@/src/services/Dashboard/ProductServices";
import type { Product } from "@/src/types/ProductTypes";

export const ProductSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Error al cargar productos"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="flex flex-col mt-12">
      <div className="flex flex-col items-start justify-center pt-6 gap-4">
        <h2 className="text-3xl font-bold tracking-wider text-white ">
          Products
        </h2>
      </div>

      {loading ? (
        <p className="mt-8 text-center text-gray-300 italic">
          Cargando productos...
        </p>
      ) : error ? (
        <p className="mt-8 text-center text-red-400 italic">{error}</p>
      ) : products.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id_product} product={product} />
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