import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useToast } from "@/src/context/ToastContext";
import { getShops, createShopWithImage, updateShop, updateShopWithImage } from "@/src/services/Shop/ShopServices";
import {
  createProduct,
  createProductWithImage,
  deleteProduct,
  getShopProducts,
  updateProduct,
} from "@/src/services/Dashboard/ProductServices";
import type { Shop, ShopFormData } from "@/src/types/ShopTypes";
import type { Product, ProductFormData } from "@/src/types/ProductTypes";

export const useMyShop = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [savingShop, setSavingShop] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  const userId = user?.id_user;

  const loadShop = useCallback(async () => {
    if (!userId) return null;
    try {
      const shops = await getShops({ skip: 0, limit: 100 });
      const found = shops.find((s) => s.id_user === userId) ?? null;
      setShop(found);
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
    async (data: ShopFormData) => {
      if (!userId) return;
      setSavingShop(true);

      try {
        const { shop_name, description, shop_address, logoFile } = data;

        if (shop) {
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
              logo_url: shop.logo_url,
            });
          }
        } else {
          if (!logoFile) {
            showToast(
              "Por favor selecciona un archivo de imagen para el logo.",
              "error"
            );
            return;
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
      } catch {
        showToast("Error al guardar la tienda", "error");
      } finally {
        setSavingShop(false);
      }
    },
    [userId, shop, loadShop, loadProducts, showToast]
  );

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
          if (data.imageFile) {
            const formData = new FormData();
            formData.append("id_shop", String(shop.id_shop));
            formData.append("name_product", data.name_product);
            formData.append("product_description", data.product_description);
            formData.append("price", String(data.price));
            formData.append("stock", String(data.stock));
            formData.append("product_star_rate", "0");
            formData.append("id_category", String(data.id_category));
            formData.append("image", data.imageFile);
            await createProductWithImage(formData);
          } else {
            await createProduct({
              name_product: data.name_product,
              stock: data.stock,
              price: data.price,
              product_description: data.product_description,
              id_shop: shop.id_shop,
              image_url: "",
              product_star_rate: 0,
              id_category: data.id_category,
            });
          }
          showToast("Producto creado exitosamente");
        }

        setShowProductForm(false);
        setEditingProduct(null);
        loadProducts(shop.id_shop);
      } catch {
        showToast("Error al guardar el producto", "error");
      } finally {
        setSavingProduct(false);
      }
    },
    [shop, editingProduct, loadProducts, showToast]
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
    setShowProductForm,
    setEditingProduct,
    handleSaveShop,
    handleSaveProduct,
    handleEditProduct,
    handleDeleteProduct,
  };
};