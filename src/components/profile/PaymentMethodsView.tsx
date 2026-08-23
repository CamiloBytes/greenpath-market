"use client";

import Image from "next/image";

const PAYMENT_METHODS = [
  { name: "Visa", src: "/payment/visa-logo.png" },
  { name: "MasterCard", src: "/payment/mastercard.png" },
  {
    name: "PayPal",
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png",
  },
  { name: "American Express", src: "/payment/american-express.png" },
  { name: "Nequi", src: "/payment/nequi.png" },
];

export const PaymentMethodsView = () => {
  return (
    <div>
      <h4 className="mb-6 text-xl font-bold text-white">Método de Pago</h4>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.name}
            className="flex flex-col items-center gap-3 rounded-2xl bg-white/5 p-6 transition-transform duration-300 hover:rotate-2 hover:scale-105"
          >
            <div className="relative h-12 w-20">
              <Image
                src={method.src}
                alt={method.name}
                fill
                unoptimized={method.src.startsWith("http")}
                className="object-contain"
              />
            </div>
            <span className="text-center text-sm font-semibold text-white">
              {method.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};