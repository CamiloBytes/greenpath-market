import type { Product } from "@/src/types/ProductTypes";

export const MOCK_PRODUCTS: Product[] = [
  {
    id_product: 1,
    name_product: "Leche Entera Entera",
    price: 4200,
    stock: 25,
    image_url: "/leche.jpg",
    shop_name: "Lácteos El Campo",
    id_category: 3,
  },
  {
    id_product: 2,
    name_product: "Manzanas Frescas Orgánicas",
    price: 3500,
    stock: 40,
    image_url: "/frutas y verduras.jpg",
    shop_name: "Huerta Verde",
    id_category: 1,
  },
  {
    id_product: 3,
    name_product: "Arroz Integral Fino",
    price: 5800,
    stock: 15,
    image_url: "/granos y cereales.jpg",
    shop_name: "Granos del Valle",
    id_category: 2,
  },
  {
    id_product: 4,
    name_product: "Queso Campesino Artesanal",
    price: 12000,
    stock: 10,
    image_url: "/queso y huevos.jpg",
    shop_name: "Don Queso",
    id_category: 3,
  },
  {
    id_product: 5,
    name_product: "Pechuga de Pollo Fresca",
    price: 18500,
    stock: 8,
    image_url: "/res, pollo y pescado.jpg",
    shop_name: "Granja San José",
    id_category: 4,
  },
];

export async function getProducts(): Promise<Product[]> {
  return MOCK_PRODUCTS;
}
