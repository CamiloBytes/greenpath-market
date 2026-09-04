import type { Shop, ShopState } from "@/src/types/ShopTypes";
import type { Product } from "@/src/types/ProductTypes";

export const SHOP_STATES = {
  VISIBLE: [
    "active",
    "solicitud_de_desactivacion_pendiente",
    "rechazada",
  ] as const,
  REVIEWABLE: ["active", "solicitud_de_desactivacion_pendiente"] as const,
  HIDDEN: ["desactivada_temporalmente", "eliminada"] as const,
} as const;

/** Sin estado → se trata como activa (compatibilidad con respuestas previas). */
export function isShopPubliclyVisible(state?: ShopState): boolean {
  if (!state) return true;
  return (SHOP_STATES.VISIBLE as readonly string[]).includes(state);
}

/** Solo así se pueden publicar recibir reseñas. */
export function isShopReviewable(state?: ShopState): boolean {
  if (!state) return true;
  return (SHOP_STATES.REVIEWABLE as readonly string[]).includes(state);
}

/** Tiendas que jamás deben mostrarse públicamente. */
export function isShopHidden(state?: ShopState): boolean {
  if (!state) return false;
  return (SHOP_STATES.HIDDEN as readonly string[]).includes(state);
}

/** Se comporta visualmente como activa (active | rechazada | sin estado). */
export function isShopOperative(state?: ShopState): boolean {
  if (!state) return true;
  return state === "active" || state === "rechazada";
}

export interface ShopLookup {
  byId: Map<number, Shop>;
  byName: Map<string, Shop>;
}

export function normalizeShopName(name: string): string {
  return name.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

export function buildShopLookup(shops: Shop[]): ShopLookup {
  const byId = new Map<number, Shop>();
  const byName = new Map<string, Shop>();
  for (const shop of shops) {
    byId.set(shop.id_shop, shop);
    byName.set(normalizeShopName(shop.shop_name), shop);
  }
  return { byId, byName };
}

export function findShopForProduct(
  product: Product,
  lookup: ShopLookup
): Shop | undefined {
  if (product.id_shop != null && product.id_shop > 0) {
    return lookup.byId.get(product.id_shop);
  }
  if (product.shop_name) {
    return lookup.byName.get(normalizeShopName(product.shop_name));
  }
  return undefined;
}

/**
 * Regla de visibilidad: productos de tiendas `desactivada_temporalmente` o
 * `eliminada` nunca se muestran. Si el producto trae `shop_state` (Opción A)
 * se usa ese dato; si no, se cruza con la lista de tiendas. Productos sin
 * tienda identificable se consideran no disponibles.
 */
export function isProductAvailable(
  product: Product,
  lookup: ShopLookup
): boolean {
  if (product.shop_state) {
    return isShopPubliclyVisible(product.shop_state);
  }
  const shop = findShopForProduct(product, lookup);
  if (shop) return isShopPubliclyVisible(shop.state);
  return false;
}

export function filterProductsFromVisibleShops(
  products: Product[],
  shops: Shop[]
): Product[] {
  const lookup = buildShopLookup(shops);
  return products.filter((product) => isProductAvailable(product, lookup));
}

/** Ids de items del carrito cuya tienda está oculta o ya no existe. */
export function getUnavailableCartItemIds(
  cart: Product[],
  shops: Shop[]
): Set<number> {
  const lookup = buildShopLookup(shops);
  const unavailable = new Set<number>();
  for (const item of cart) {
    if (!isProductAvailable(item, lookup)) unavailable.add(item.id_product);
  }
  return unavailable;
}