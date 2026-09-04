import { create } from "zustand";
import { getShops } from "@/src/services/Shop/ShopServices";
import type { Shop, ShopState } from "@/src/types/ShopTypes";

const CACHE_TTL_MS = 60_000;

interface ShopStore {
  shops: Shop[];
  loading: boolean;
  lastFetched: number | null;
  refresh: (force?: boolean) => Promise<Shop[]>;
  updateShopState: (shopId: number, state: ShopState) => void;
  upsertShop: (shop: Shop) => void;
  getShopById: (shopId: number) => Shop | undefined;
}

export const useShopStore = create<ShopStore>((set, get) => ({
  shops: [],
  loading: false,
  lastFetched: null,

  refresh: async (force = false) => {
    const { shops, lastFetched } = get();
    if (!force && lastFetched && Date.now() - lastFetched < CACHE_TTL_MS) {
      return shops;
    }
    set({ loading: true });
    try {
      const data = await getShops({ skip: 0, limit: 200 });
      set({ shops: data, lastFetched: Date.now() });
      return data;
    } finally {
      set({ loading: false });
    }
  },

  updateShopState: (shopId, state) => {
    set((s) => ({
      shops: s.shops.map((shop) =>
        shop.id_shop === shopId ? { ...shop, state } : shop
      ),
    }));
  },

  upsertShop: (shop) => {
    set((s) => {
      const exists = s.shops.some((sh) => sh.id_shop === shop.id_shop);
      return {
        shops: exists
          ? s.shops.map((sh) => (sh.id_shop === shop.id_shop ? shop : sh))
          : [...s.shops, shop],
      };
    });
  },

  getShopById: (shopId) => get().shops.find((shop) => shop.id_shop === shopId),
}));