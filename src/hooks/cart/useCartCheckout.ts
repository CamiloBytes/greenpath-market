import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/src/stores/cartStore";
import { useToastStore } from "@/src/stores/toastStore";
import { useCartAvailability } from "./useCartAvailability";
import type { PaymentMethod } from "@/src/types/CartTypes";

export const useCartCheckout = () => {
  const router = useRouter();
  const { cart, cartTotal, updateQuantity, removeFromCart, createOrder } =
    useCartStore();
  const { showToast } = useToastStore();
  const { unavailableIds, hasUnavailable } = useCartAvailability();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (hasUnavailable) {
      showToast(
        "Hay productos no disponibles en tu carrito. Elimínalos para continuar.",
        "error"
      );
      return;
    }

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
    unavailableIds,
    hasUnavailable,
    selectedMethod,
    setSelectedMethod,
    checkingOut,
    handleCheckout,
  };
};