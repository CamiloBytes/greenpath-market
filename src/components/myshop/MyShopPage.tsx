"use client";

import { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { useMyShop } from "@/src/hooks/myshop/useMyShop";
import { ShopManager } from "./ShopManager";
import { ProductFormModal } from "./ProductFormModal";
import { ShopFormModal } from "./ShopFormModal";
import { ProductItemCard } from "./ProductItemCard";

export const MyShopPage = () => {
  const {
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
  } = useMyShop();

  const [shopFormOpen, setShopFormOpen] = useState(false);

  const closeProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <ShopManager shop={shop} onEdit={() => setShopFormOpen(true)} />

      <ShopFormModal
        isOpen={shopFormOpen}
        shop={shop}
        onSave={handleSaveShop}
        onClose={() => setShopFormOpen(false)}
        saving={savingShop}
      />

      {shop && (
        <section className="mt-10">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductForm(true);
              }}
              className="flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
            >
              <FaCirclePlus /> Agregar producto
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {products.map((product) => (
              <ProductItemCard
                key={product.id_product}
                product={product}
                shopName={shop.shop_name}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>

          {products.length === 0 && (
            <p className="mt-8 text-center text-gray-300 italic">
              Aún no tienes productos. ¡Agrega el primero!
            </p>
          )}
        </section>
      )}

      <ProductFormModal
        isOpen={showProductForm}
        product={editingProduct}
        onSubmit={handleSaveProduct}
        onClose={closeProductForm}
        submitting={savingProduct}
      />
    </div>
  );
};
