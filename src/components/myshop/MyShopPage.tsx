"use client";

import { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { useMyShop } from "@/src/hooks/myshop/useMyShop";
import { ShopManager } from "./ShopManager";
import { ProductFormModal } from "./ProductFormModal";
import { ShopFormModal } from "./ShopFormModal";
import { LogoChangeModal } from "./LogoChangeModal";
import { ProductItemCard } from "./ProductItemCard";
import { ConfirmModal } from "../shop/ConfirmModal";
import { isShopHidden } from "@/src/utils/shopVisibility";

export const MyShopPage = () => {
  const {
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
  } = useMyShop();

  const [shopFormOpen, setShopFormOpen] = useState(false);

  const closeProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const closeShopForm = () => {
    setShopFormOpen(false);
  };

  const shopHidden = shop ? isShopHidden(shop.state) : false;

  return (
    <div className="mx-auto max-w-7xl">
      <ShopManager
        shop={shop}
        onEdit={() => setShopFormOpen(true)}
        onChangeLogo={() => setChangeLogoOpen(true)}
        onRequestDeactivation={() => setDeactivationOpen(true)}
        onRegisterNew={() => {
          openNewShopForm();
          setShopFormOpen(true);
        }}
      />

      {shop && changeLogoOpen && (
        <LogoChangeModal
          isOpen={changeLogoOpen}
          shop={shop}
          onLogoChange={handleChangeLogo}
          onClose={() => setChangeLogoOpen(false)}
        />
      )}

      <ShopFormModal
        isOpen={shopFormOpen}
        shop={registerNewShop ? null : shop}
        onSave={handleSaveShop}
        onClose={closeShopForm}
        saving={savingShop}
      />

      <ConfirmModal
        isOpen={deactivationOpen}
        title="¿Desactivar tu tienda temporalmente?"
        message={
          <>
            Tu solicitud será revisada por un administrador. Mientras tanto, tu
            tienda y tus productos <strong>seguirán visibles</strong> para otros
            usuarios. Puedes seguir operando con normalidad hasta que se tome
            una decisión.
          </>
        }
        confirmLabel="Solicitar desactivación"
        busy={requestingDeactivation}
        busyLabel="Enviando solicitud…"
        danger
        onConfirm={handleRequestDeactivation}
        onClose={() => !requestingDeactivation && setDeactivationOpen(false)}
      />

      {shop && !shopHidden && (
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
        onImagesChange={handleProductImagesChange}
        onClose={closeProductForm}
        submitting={savingProduct}
      />
    </div>
  );
};