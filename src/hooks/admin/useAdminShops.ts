import { useCallback, useEffect, useState } from "react";
import {
  deleteShop,
  getShops,
  updateShop,
  updateShopWithImage,
} from "@/src/services/Shop/ShopServices";
import type { Shop, ShopFormData } from "@/src/types/ShopTypes";
import { useToastStore } from "@/src/stores/toastStore";

export const useAdminShops = () => {
  const { showToast } = useToastStore();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [saving, setSaving] = useState(false);

  const loadShops = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getShops();
      setShops(data);
    } catch {
      showToast("Error cargando las tiendas", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadShops();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadShops]);

  const handleDelete = useCallback(
    async (shop: Shop) => {
      if (!window.confirm("¿Está seguro que desea borrar esta tienda?")) return;

      try {
        await deleteShop(shop.id_shop);
        showToast("Tienda borrada exitosamente");
        loadShops();
      } catch {
        showToast("Error borrando la tienda", "error");
      }
    },
    [loadShops, showToast]
  );

  const handleSave = useCallback(
    async (data: ShopFormData) => {
      if (!editingShop) return;
      setSaving(true);

      try {
        const { shop_name, description, shop_address, logoFile } = data;

        if (logoFile) {
          const formData = new FormData();
          formData.append("id_user", String(editingShop.id_user));
          formData.append("shop_name", shop_name);
          formData.append("description", description);
          formData.append("shop_address", shop_address);
          formData.append("is_active", String(editingShop.is_active));
          formData.append("logo", logoFile);
          await updateShopWithImage(editingShop.id_shop, formData);
          showToast("Tienda actualizada exitosamente con imagen");
        } else {
          await updateShop(editingShop.id_shop, {
            shop_name,
            description,
            shop_address,
            logo_url: editingShop.logo_url,
          });
          showToast("Tienda actualizada exitosamente");
        }

        setEditingShop(null);
        loadShops();
      } catch {
        showToast("Error actualizando la tienda", "error");
      } finally {
        setSaving(false);
      }
    },
    [editingShop, loadShops, showToast]
  );

  return {
    shops,
    loading,
    editingShop,
    saving,
    setEditingShop,
    handleDelete,
    handleSave,
  };
};