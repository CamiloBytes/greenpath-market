import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/stores/authStore";
import { useToastStore } from "@/src/stores/toastStore";
import {
  getShops,
  createShopWithImage,
  updateShop,
  updateShopWithImage,
  replaceShopLogo,
  requestShopDeactivation,
} from "@/src/services/Shop/ShopServices";
import { useShopStore } from "@/src/stores/shopStore";
import {
  createProductWithImages,
  deleteProduct,
  getShopProducts,
  updateProduct,
} from "@/src/services/Dashboard/ProductServices";
import type { Shop, ShopFormData } from "@/src/types/ShopTypes";
import type {
  Product,
  ProductFormData,
  ProductImage,
} from "@/src/types/ProductTypes";

export const useMyShop = () => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [savingShop, setSavingShop] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deactivationOpen, setDeactivationOpen] = useState(false);
  const [requestingDeactivation, setRequestingDeactivation] = useState(false);
  const [registerNewShop, setRegisterNewShop] = useState(false);
  const [changeLogoOpen, setChangeLogoOpen] = useState(false);

  const userId = user?.id_user;

  const loadShop = useCallback(async () => {
    if (!userId) return null;
    try {
      const shops = await getShops({ skip: 0, limit: 100 });
      const found = shops.find((s) => s.id_user === userId) ?? null;
      setShop(found);
      if (found) useShopStore.getState().upsertShop(found);
      return found;
    } catch {
      showToast("Error cargando la tienda", "error");
      return null;
    }
  }, [userId, showToast]);

  const loadProducts = useCallback(
    async (shopId: number) => {
      try {
        const data = await getShopProducts(shopId);
        setProducts(data);
      } catch {
        showToast("Error cargando los productos", "error");
      }
    },
    [showToast]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadShop().then((found) => {
        if (found) loadProducts(found.id_shop);
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [loadShop, loadProducts]);

  const handleSaveShop = useCallback(
    async (data: ShopFormData): Promise<boolean> => {
      if (!userId) return false;
      setSavingShop(true);

      try {
        const { shop_name, description, shop_address, logoFile } = data;

        if (shop && !registerNewShop) {
          if (logoFile) {
            const formData = new FormData();
            formData.append("id_user", String(userId));
            formData.append("shop_name", shop_name);
            formData.append("description", description);
            formData.append("shop_address", shop_address);
            formData.append("is_active", "true");
            formData.append("logo", logoFile);
            await updateShopWithImage(shop.id_shop, formData);
          } else {
            await updateShop(shop.id_shop, {
              id_user: userId,
              shop_name,
              description,
              shop_address,
              is_active: true,
              state: shop.state ?? "active",
              logo_url: shop.logo_url,
            });
          }
        } else {
          if (!logoFile) {
            showToast(
              "Por favor selecciona un archivo de imagen para el logo.",
              "error"
            );
            return false;
          }
          const formData = new FormData();
          formData.append("id_user", String(userId));
          formData.append("shop_name", shop_name);
          formData.append("description", description);
          formData.append("shop_address", shop_address);
          formData.append("is_active", "true");
          formData.append("logo", logoFile);
          await createShopWithImage(formData);
        }

        showToast("Tienda guardada exitosamente");
        const updated = await loadShop();
        if (updated) loadProducts(updated.id_shop);
        setRegisterNewShop(false);
        return true;
      } catch {
        showToast("Error al guardar la tienda", "error");
        return false;
      } finally {
        setSavingShop(false);
      }
    },
    [userId, shop, registerNewShop, loadShop, loadProducts, showToast]
  );

  const handleRequestDeactivation = useCallback(async () => {
    if (!shop) return;
    setRequestingDeactivation(true);
    try {
      const state = await requestShopDeactivation(shop.id_shop);
      setShop((prev) => (prev ? { ...prev, state } : prev));
      useShopStore.getState().updateShopState(shop.id_shop, state);
      setDeactivationOpen(false);
      showToast(
        "Tu solicitud fue enviada y la tienda seguirá visible hasta que sea revisada."
      );
    } catch {
      showToast("Error al enviar la solicitud de desactivación", "error");
    } finally {
      setRequestingDeactivation(false);
    }
  }, [shop, showToast]);

  const handleChangeLogo = useCallback(
    async (file: File): Promise<string> => {
      if (!shop) throw new Error("No tienes una tienda activa");
      try {
        const logo_url = await replaceShopLogo(shop.id_shop, file);
        setShop((prev) => (prev ? { ...prev, logo_url } : prev));
        useShopStore.getState().upsertShop({ ...shop, logo_url });
        showToast("Logo actualizado exitosamente");
        return logo_url;
      } catch (err) {
        throw err;
      }
    },
    [shop, showToast]
  );

  const openNewShopForm = useCallback(() => {
    setRegisterNewShop(true);
    setShowProductForm(false);
    setEditingProduct(null);
  }, []);

  const handleSaveProduct = useCallback(
    async (data: ProductFormData) => {
      if (!shop) return;
      setSavingProduct(true);

      try {
        if (editingProduct) {
          await updateProduct(editingProduct.id_product, {
            name_product: data.name_product,
            stock: data.stock,
            price: data.price,
            product_description: data.product_description,
            id_shop: shop.id_shop,
            product_star_rate: 0,
            id_category: data.id_category,
          });
          showToast("Producto actualizado exitosamente");
        } else {
          if (data.imageFiles.length === 0) {
            showToast(
              "Debes seleccionar al menos una imagen para el producto",
              "error"
            );
            return false;
          }

          const formData = new FormData();
          formData.append("id_shop", String(shop.id_shop));
          formData.append("name_product", data.name_product);
          formData.append("product_description", data.product_description);
          formData.append("price", String(data.price));
          formData.append("stock", String(data.stock));
          formData.append("product_star_rate", "0");
          formData.append("id_category", String(data.id_category));
          for (const file of data.imageFiles) {
            formData.append("images", file);
          }
          await createProductWithImages(formData);
          showToast("Producto creado exitosamente");
        }

        setShowProductForm(false);
        setEditingProduct(null);
        loadProducts(shop.id_shop);
        return true;
      } catch {
        showToast("Error al guardar el producto", "error");
        return false;
      } finally {
        setSavingProduct(false);
      }
    },
    [shop, editingProduct, loadProducts, showToast]
  );

  const handleProductImagesChange = useCallback(
    (productId: number, images: ProductImage[]) => {
      const mainUrl = images[0]?.image_url;
      setProducts((prev) =>
        prev.map((p) =>
          p.id_product === productId
            ? {
                ...p,
                images,
                image_url: mainUrl ?? p.image_url,
              }
            : p
        )
      );
    },
    []
  );

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  }, []);

  const handleDeleteProduct = useCallback(
    async (product: Product) => {
      if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
      try {
        await deleteProduct(product.id_product);
        showToast("Producto eliminado");
        if (shop) loadProducts(shop.id_shop);
      } catch {
        showToast("Error al eliminar el producto", "error");
      }
    },
    [shop, loadProducts, showToast]
  );

  return {
    shop,
    products,
    savingShop,
    showProductForm,
    editingProduct,
    savingProduct,
    deactivationOpen,
    requestingDeactivation,
    registerNewShop,
    changeLogoOpen,
    setChangeLogoOpen,
    setShowProductForm,
    setEditingProduct,
    setDeactivationOpen,
    openNewShopForm,
    handleSaveShop,
    handleRequestDeactivation,
    handleChangeLogo,
    handleSaveProduct,
    handleProductImagesChange,
    handleEditProduct,
    handleDeleteProduct,
  };
};