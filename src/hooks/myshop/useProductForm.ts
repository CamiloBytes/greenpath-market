import { useState } from "react";
import type { Product, ProductFormData } from "@/src/types/ProductTypes";

export const useProductForm = (product: Product | null) => {
  const [name, setName] = useState(product?.name_product ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [description, setDescription] = useState(
    product?.product_description ?? ""
  );
  const [category, setCategory] = useState(
    product?.id_category?.toString() ?? ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent): ProductFormData | null => {
    e.preventDefault();
    if (
      !name.trim() ||
      !stock ||
      Number(stock) < 0 ||
      !price ||
      Number(price) < 0 ||
      !category
    ) {
      return null;
    }

    return {
      name_product: name.trim(),
      stock: Number(stock),
      price: Number(price),
      product_description: description.trim(),
      id_category: Number(category),
      imageFile,
    };
  };

  return {
    name,
    setName,
    stock,
    setStock,
    price,
    setPrice,
    description,
    setDescription,
    category,
    setCategory,
    imageFile,
    setImageFile,
    handleSubmit,
  };
};