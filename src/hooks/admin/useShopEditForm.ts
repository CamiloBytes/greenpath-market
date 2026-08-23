import { useState } from "react";
import type { Shop, ShopFormData } from "@/src/types/ShopTypes";

export const useShopEditForm = (shop: Shop) => {
  const [shopName, setShopName] = useState(shop.shop_name);
  const [description, setDescription] = useState(shop.description);
  const [address, setAddress] = useState(shop.shop_address);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent): ShopFormData | null => {
    e.preventDefault();
    return { shop_name: shopName, description, shop_address: address, logoFile };
  };

  return {
    shopName,
    setShopName,
    description,
    setDescription,
    address,
    setAddress,
    logoFile,
    setLogoFile,
    handleSubmit,
  };
};