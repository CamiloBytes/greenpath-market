"use client";

import { FaCirclePlus } from "react-icons/fa6";
import { useMyShop } from "@/src/hooks/myshop/useMyShop";
import { ShopManager } from "./ShopManager";
import { ProductForm } from "./ProductForm";
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

  return (
    <div className="mx-auto max-w-7xl">
      <ShopManager key={shop?.id_shop ?? "new"} shop={shop} onSave={handleSaveShop} saving={savingShop} />

      {shop && (
        <section className="mt-10 ">
          <div className="flex justify-end">
            {!showProductForm && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
              >
                <FaCirclePlus /> Add product
              </button>
            )}
          </div>

          <div className="mt-4">{showProductForm && (
            <ProductForm
              key={editingProduct?.id_product ?? "new"}
              product={editingProduct}
              onSubmit={handleSaveProduct}
              onCancel={() => {
                setShowProductForm(false);
                setEditingProduct(null);
              }}
              submitting={savingProduct}
            />
          )}</div>

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

          {!showProductForm && products.length === 0 && (
            <p className="mt-8 text-center text-gray-300 italic">
              Aún no tienes productos. ¡Agrega el primero!
            </p>
          )}
        </section>
      )}
    </div>
  );
};