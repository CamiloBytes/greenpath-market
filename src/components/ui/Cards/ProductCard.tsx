"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductCardProps } from "@/src/types/CardsTypes";

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative flex h-[300px] min-h-[22rem] w-full flex-col justify-end overflow-hidden rounded-[25px] p-[5px] text-white shadow-xl shadow-black/30"
    >
      <Image
        src={product.image_url}
        alt={product.name_product}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
        unoptimized={product.image_url.startsWith("http")}
        className="absolute inset-0 z-0 object-cover"
      />

      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/50 to-transparent" />

      <div className="relative z-[2] -mb-5 p-1 text-center">
        <h2 className="mb-2 text-lg font-bold drop-shadow-md">
          {product.name_product}
        </h2>

        <div className="mb-1 flex items-center justify-center gap-2 px-2">
          <h3 className="rounded-[10px] bg-white/10 px-2.5 py-0.5 text-sm font-bold text-gray-200 backdrop-blur-sm">
            {product.stock} L
          </h3>
          <h3 className="rounded-[10px] bg-white/10 px-2.5 py-0.5 text-sm font-bold text-gray-200 backdrop-blur-sm">
            ${product.price.toLocaleString()}
          </h3>
        </div>

        <p className="text-xs text-gray-300">
          Sold by: <strong className="text-white">{product.shop_name}</strong>
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="relative  my-4 mx-2 flex items-center justify-between rounded-full bg-white/10 px-5 py-3 backdrop-blur-md transition-all duration-300 hover:bg-white/20 active:scale-95 cursor-pointer"
          >
            <span className="text-sm font-semibold text-white">
              Add to Cart
            </span>
            <div className="flex gap-1">
              <span className="text-lg leading-none text-white animate-swipe">
                ›
              </span>
              <span className="text-lg leading-none text-white animate-swipe [animation-delay:0.2s]">
                ›
              </span>
            </div>
          </button>
        </div>
      </div>
    </motion.article>
  );
};
