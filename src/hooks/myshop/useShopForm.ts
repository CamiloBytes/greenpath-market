import { useState } from "react";
import type { Shop, ShopFormData } from "@/src/types/ShopTypes";

export const useShopForm = (shop: Shop | null) => {
  const [editing, setEditing] = useState(!shop);
  const [shopName, setShopName] = useState(shop?.shop_name ?? "");
  const [description, setDescription] = useState(shop?.description ?? "");
  const [address, setAddress] = useState(shop?.shop_address ?? "");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const resetForm = () => {
    setShopName(shop?.shop_name ?? "");
    setDescription(shop?.description ?? "");
    setAddress(shop?.shop_address ?? "");
    setLogoFile(null);
  };

  const handleSubmit = (e: React.FormEvent): ShopFormData | null => {
    e.preventDefault();
    if (shopName.trim().length < 2) return null;
    if (!description.trim()) return null;
    if (address.trim() && address.trim().length < 2) return null;
    if (!shop && !logoFile) return null;

    return {
      shop_name: shopName.trim(),
      description: description.trim(),
      shop_address: address.trim(),
      logoFile,
    };
  };

  return {
    editing,
    setEditing,
    shopName,
    setShopName,
    description,
    setDescription,
    address,
    setAddress,
    logoFile,
    setLogoFile,
    resetForm,
    handleSubmit,
  };
};