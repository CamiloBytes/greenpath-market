import { describe, expect, it } from "vitest";
import type { Shop } from "@/src/types/ShopTypes";
import type { Product } from "@/src/types/ProductTypes";
import {
  isShopPubliclyVisible,
  isShopReviewable,
  isShopHidden,
  isShopOperative,
  findShopForProduct,
  buildShopLookup,
  isProductAvailable,
  filterProductsFromVisibleShops,
  getUnavailableCartItemIds,
} from "./shopVisibility";

const activeShop: Shop = {
  id_shop: 1,
  id_user: 2,
  shop_name: "Verduras Doña Ana",
  description: "Lo mejor",
  shop_address: "Av. Principal",
  logo_url: null,
  shop_score: 80,
  state: "active",
};

const hiddenShop: Shop = {
  ...activeShop,
  id_shop: 2,
  shop_name: "Tienda Oculta",
  state: "desactivada_temporalmente",
};

const baseProduct: Product = {
  id_product: 10,
  name_product: "Tomate",
  product_description: "Fresco",
  price: 100,
  stock: 5,
  image_url: "",
  shop_name: "",
  id_category: 1,
};

describe("shopVisibility", () => {
  describe("estados de tienda", () => {
    it("es visible pública y revisable para active y pendiente", () => {
      expect(isShopPubliclyVisible("active")).toBe(true);
      expect(isShopPubliclyVisible("solicitud_de_desactivacion_pendiente")).toBe(
        true
      );
      expect(isShopReviewable("active")).toBe(true);
      expect(isShopReviewable("solicitud_de_desactivacion_pendiente")).toBe(
        true
      );
    });

    it("oculta desactivada_temporalmente y eliminada", () => {
      expect(isShopHidden("desactivada_temporalmente")).toBe(true);
      expect(isShopHidden("eliminada")).toBe(true);
      expect(isShopPubliclyVisible("desactivada_temporalmente")).toBe(false);
      expect(isShopPubliclyVisible("eliminada")).toBe(false);
      expect(isShopReviewable("desactivada_temporalmente")).toBe(false);
    });

    it("rechazada sigue visible pero no es revisable; sigue siendo operativa", () => {
      expect(isShopPubliclyVisible("rechazada")).toBe(true);
      expect(isShopReviewable("rechazada")).toBe(false);
      expect(isShopOperative("rechazada")).toBe(true);
    });

    it("sin estado se trata como activa (compatibilidad)", () => {
      expect(isShopPubliclyVisible(undefined)).toBe(true);
      expect(isShopReviewable(undefined)).toBe(true);
      expect(isShopHidden(undefined)).toBe(false);
      expect(isShopOperative(undefined)).toBe(true);
    });
  });

  describe("isProductAvailable", () => {
    it("usa shop_state del producto cuando viene (Opción A)", () => {
      const lookup = buildShopLookup([activeShop, hiddenShop]);
      expect(
        isProductAvailable({ ...baseProduct, id_shop: 2, shop_state: "active" }, lookup)
      ).toBe(true);
      expect(
        isProductAvailable(
          { ...baseProduct, id_shop: 1, shop_state: "eliminada" },
          lookup
        )
      ).toBe(false);
    });

    it("cruza por id_shop cuando el producto no trae shop_state", () => {
      const lookup = buildShopLookup([activeShop, hiddenShop]);
      expect(
        isProductAvailable({ ...baseProduct, id_shop: 1 }, lookup)
      ).toBe(true);
      expect(
        isProductAvailable({ ...baseProduct, id_shop: 2 }, lookup)
      ).toBe(false);
      expect(isProductAvailable({ ...baseProduct }, lookup)).toBe(false);
    });

    it("cruza por shop_name como fallback", () => {
      const lookup = buildShopLookup([activeShop, hiddenShop]);
      expect(
        isProductAvailable({ ...baseProduct, shop_name: " Tienda Oculta " }, lookup)
      ).toBe(false);
    });
  });

  describe("findShopForProduct", () => {
    it("prioriza id_shop sobre shop_name", () => {
      const lookup = buildShopLookup([activeShop, hiddenShop]);
      const found = findShopForProduct(
        { ...baseProduct, id_shop: 1, shop_name: "Tienda Oculta" },
        lookup
      );
      expect(found?.id_shop).toBe(1);
    });
  });

  describe("filterProductsFromVisibleShops", () => {
    it("filtra los productos de tiendas ocultas", () => {
      const products = [
        { ...baseProduct, id_shop: 1 },
        { ...baseProduct, id_shop: 2, id_product: 11 },
        { ...baseProduct, id_product: 12 },
      ];
      const visible = filterProductsFromVisibleShops(products, [
        activeShop,
        hiddenShop,
      ]);
      expect(visible.map((p) => p.id_product)).toEqual([10]);
    });
  });

  describe("getUnavailableCartItemIds", () => {
    it("marca los items de tiendas ocultas o sin tienda", () => {
      const cart = [
        { ...baseProduct, id_shop: 1 },
        { ...baseProduct, id_shop: 2, id_product: 11 },
        { ...baseProduct, id_product: 12 },
      ];
      const unavailable = getUnavailableCartItemIds(cart, [activeShop, hiddenShop]);
      expect(unavailable).toEqual(new Set([11, 12]));
    });
  });
});