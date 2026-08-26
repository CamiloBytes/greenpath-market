"use client";

import Link from "next/link";
import { useCartStore } from "@/src/stores/cartStore";
import { motion } from "framer-motion";

export const OrdersView = () => {
  const { orders } = useCartStore();

  if (orders.length === 0) {
    return (
      <div>
        <h4 className="mb-4 text-xl font-bold text-white">Tus Pedidos</h4>
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/5 p-8 text-center">
          <p className="text-gray-300">
            Aún no has realizado ningún pedido.
          </p>
          <Link
            href="/dashboard"
            className="rounded-full bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-2.5 text-sm font-bold text-white no-underline hover:opacity-90 transition-opacity"
          >
            Ir a comprar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4 text-xl font-bold text-white">Tus Pedidos</h4>
      <div className="custom-scrollbar flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-2">
        {orders.map((order) => {
          const orderDate = new Date(order.order_date).toLocaleDateString(
            "es-ES",
            { year: "numeric", month: "long", day: "numeric" }
          );

          return (
            <motion.div
              key={order.id_order}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/5 p-4"
            >
              <h5 className="mb-2 text-base font-bold text-[#1DD317]">
                Pedido #{order.id_order}
              </h5>
              <div className="space-y-0.5 text-sm text-gray-300">
                <p>
                  <strong className="text-white">Fecha:</strong> {orderDate}
                </p>
                <p>
                  <strong className="text-white">Método de pago:</strong>{" "}
                  {order.payment_method}
                </p>
                <p>
                  <strong className="text-white">Estado:</strong>{" "}
                  {order.status}
                </p>
                <p>
                  <strong className="text-white">Total:</strong> $
                  {order.total.toLocaleString("es-CO")}
                </p>
              </div>
              <div className="mt-3 border-t border-white/10 pt-3">
                <h6 className="mb-2 text-sm font-semibold text-white">
                  Productos:
                </h6>
                <ul className="list-inside list-disc space-y-1 text-xs text-gray-300">
                  {order.items.map((item) => (
                    <li key={item.id_product}>
                      {item.name_product} (x{item.quantity}) - $
                      {(item.price * item.quantity).toLocaleString("es-CO")}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};