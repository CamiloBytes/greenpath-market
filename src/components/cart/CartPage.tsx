"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartCheckout } from "@/src/hooks/cart/useCartCheckout";
import { PAYMENT_OPTIONS } from "@/src/data/paymentOptions";

export const CartPage = () => {
  const {
    cart,
    cartTotal,
    updateQuantity,
    removeFromCart,
    selectedMethod,
    setSelectedMethod,
    checkingOut,
    handleCheckout,
  } = useCartCheckout();

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/5 p-10 text-center">
          <h3 className="text-2xl font-bold text-white">
            Your GreenPath Cart is Empty
          </h3>
          <p className="text-gray-300">
            ¡Descubre productos frescos y saludables para tu hogar!
          </p>
          <Link
            href="/dashboard"
            className="rounded-full bg-gradient-to-r from-[#284827] to-[#1DD317] px-8 py-3 font-bold text-white no-underline hover:opacity-90 transition-opacity"
          >
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 rounded-2xl bg-[#2e7d32] px-6 py-5 text-center">
        <h3 className="text-xl font-bold text-white">
          ¡Tu carrito de compras está listo!
        </h3>
        <p className="text-sm text-green-100">
          Revisa tus productos y procede al pago seguro
        </p>
      </div>

      <div className="custom-scrollbar flex max-h-[55vh] flex-col gap-4 overflow-y-auto pr-2">
        <AnimatePresence>
          {cart.map((item) => {
            const itemTotal = item.price * item.quantity;
            return (
              <motion.div
                key={item.id_product}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex items-center gap-4 rounded-2xl bg-white/5 p-4"
              >
                <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={item.image_url}
                    alt={item.name_product}
                    fill
                    unoptimized={item.image_url.startsWith("http")}
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-white">
                    {item.name_product}
                  </h4>
                  <p className="text-xs text-gray-300">
                    Precio: ${item.price.toLocaleString("es-CO")}
                  </p>

                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id_product, item.quantity - 1)
                        }
                        aria-label="Disminuir cantidad"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id_product, item.quantity + 1)
                        }
                        aria-label="Aumentar cantidad"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="mt-1 text-xs font-semibold text-[#1DD317]">
                    Total: ${itemTotal.toLocaleString("es-CO")}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id_product)}
                  aria-label="Eliminar"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/80 text-xl text-white hover:bg-red-500 transition-colors"
                >
                  ×
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-6 rounded-2xl bg-white/5 px-6 py-4 text-center">
        <h3 className="text-xl font-bold text-white">
          Total: ${cartTotal.toLocaleString("es-CO")}
        </h3>
      </div>

      <div className="mt-6 rounded-2xl bg-white/5 p-6">
        <h3 className="mb-4 text-center text-lg font-bold text-white">
          Selecciona método de pago
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {PAYMENT_OPTIONS.map((option) => (
            <motion.button
              key={option.method}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedMethod(option.method)}
              className={`flex flex-col items-center gap-2 rounded-2xl bg-white/5 p-4 transition-colors ${
                selectedMethod === option.method
                  ? "border-2 border-[#4caf50] bg-[#f1f8e9]"
                  : "border-2 border-transparent hover:bg-white/10"
              }`}
            >
              <div className="relative h-8 w-14">
                <Image
                  src={option.img}
                  alt={option.label}
                  fill
                  unoptimized={option.img.startsWith("http")}
                  className="object-contain"
                />
              </div>
              <span
                className={`text-xs font-semibold ${
                  selectedMethod === option.method
                    ? "text-[#284827]"
                    : "text-white"
                }`}
              >
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleCheckout}
            disabled={!selectedMethod || checkingOut}
            className="rounded-full bg-gradient-to-r from-[#284827] to-[#1DD317] px-10 py-3.5 font-bold text-white transition-all duration-300 hover:shadow-[0_8px_20px_rgba(23,173,18,0.26)] disabled:cursor-not-allowed disabled:bg-gray-500 disabled:shadow-none"
          >
            {checkingOut ? "Procesando pago..." : "Proceder al pago"}
          </button>
        </div>
      </div>
    </div>
  );
};