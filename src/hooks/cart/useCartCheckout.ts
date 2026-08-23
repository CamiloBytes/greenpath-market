import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import { useToast } from "@/src/context/ToastContext";
import type { PaymentMethod } from "@/src/types/CartTypes";

export const useCartCheckout = () => {
  const router = useRouter();
  const { cart, cartTotal, updateQuantity, removeFromCart, createOrder } =
    useCart();
  const { showToast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (!selectedMethod) {
      showToast("Por favor selecciona un método de pago", "error");
      return;
    }

    setCheckingOut(true);
    setTimeout(() => {
      createOrder(selectedMethod);
      setCheckingOut(false);
      showToast("¡Pago exitoso! Tu pedido ha sido procesado.");
      router.push("/profile");
    }, 1200);
  };

  return {
    cart,
    cartTotal,
    updateQuantity,
    removeFromCart,
    selectedMethod,
    setSelectedMethod,
    checkingOut,
    handleCheckout,
  };
};