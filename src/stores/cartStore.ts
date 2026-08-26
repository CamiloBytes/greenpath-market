import { create } from "zustand";
import type { CartItem, Order, PaymentMethod } from "@/src/types/CartTypes";
import type { Product } from "@/src/types/ProductTypes";

const CART_KEY = "greenpath_cart";
const ORDERS_KEY = "greenpath_orders";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface CartState {
  cart: CartItem[];
  orders: Order[];
  hydrated: boolean;
  cartCount: number;
  cartTotal: number;
  hydrate: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  createOrder: (paymentMethod: PaymentMethod) => Order | null;
}

function calcCount(cart: CartItem[]) {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

function calcTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  orders: [],
  hydrated: false,
  cartCount: 0,
  cartTotal: 0,

  hydrate: () => {
    const cart = readStorage<CartItem[]>(CART_KEY, []);
    const orders = readStorage<Order[]>(ORDERS_KEY, []);
    set({
      cart,
      orders,
      hydrated: true,
      cartCount: calcCount(cart),
      cartTotal: calcTotal(cart),
    });
  },

  addToCart: (product) => {
    const { cart } = get();
    const existing = cart.find((item) => item.id_product === product.id_product);

    const newCart = existing
      ? cart.map((item) =>
          item.id_product === product.id_product
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, quantity: 1, added_at: new Date().toISOString() }];

    set({ cart: newCart, cartCount: calcCount(newCart), cartTotal: calcTotal(newCart) });
    window.localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  },

  removeFromCart: (productId) => {
    const newCart = get().cart.filter((item) => item.id_product !== productId);
    set({ cart: newCart, cartCount: calcCount(newCart), cartTotal: calcTotal(newCart) });
    window.localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  },

  updateQuantity: (productId, quantity) => {
    const { cart } = get();
    let newCart: CartItem[];

    if (quantity <= 0) {
      newCart = cart.filter((item) => item.id_product !== productId);
    } else {
      newCart = cart.map((item) =>
        item.id_product === productId ? { ...item, quantity } : item
      );
    }

    set({ cart: newCart, cartCount: calcCount(newCart), cartTotal: calcTotal(newCart) });
    window.localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  },

  clearCart: () => {
    set({ cart: [], cartCount: 0, cartTotal: 0 });
    window.localStorage.setItem(CART_KEY, JSON.stringify([]));
  },

  createOrder: (paymentMethod) => {
    const { cart, orders } = get();
    if (cart.length === 0) return null;

    const order: Order = {
      id_order: Date.now(),
      order_date: new Date().toISOString(),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      payment_method: paymentMethod,
      status: "Entregado",
    };

    const newOrders = [...orders, order];
    set({ cart: [], orders: newOrders, cartCount: 0, cartTotal: 0 });
    window.localStorage.setItem(CART_KEY, JSON.stringify([]));
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));

    return order;
  },
}));
