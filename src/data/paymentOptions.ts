import type { PaymentMethod } from "@/src/types/CartTypes";

export const PAYMENT_OPTIONS: { method: PaymentMethod; img: string; label: string }[] =
  [
    { method: "Visa", img: "/payment/visa-logo.png", label: "Visa" },
    { method: "MasterCard", img: "/payment/mastercard.png", label: "MasterCard" },
    {
      method: "PayPal",
      img: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png",
      label: "PayPal",
    },
    {
      method: "Amex",
      img: "/payment/american-express.png",
      label: "American Express",
    },
    { method: "Nequi", img: "/payment/nequi.png", label: "Nequi" },
  ];