"use client";

import { useState } from "react";
import { useAdminShops } from "@/src/hooks/admin/useAdminShops";
import { ShopCard } from "./ShopCard";
import { ShopEditModal } from "./ShopEditModal";
import { SellerRequestsTab } from "./SellerRequestsTab";
import { PenaltiesTab } from "./PenaltiesTab";
import { CategoriesTab } from "./CategoriesTab";
import { UsersTab } from "./UsersTab";
import { ConfirmModal } from "../shop/ConfirmModal";

type AdminTab = "shops" | "requests" | "penalties" | "categories" | "users";

const ACTION_CONFIG = {
  approve: {
    title: "¿Aprobar desactivación?",
    message:
      "La tienda quedará oculta para los clientes y sus productos dejarán de ser visibles de forma temporal.",
    confirmLabel: "Aprobar y ocultar",
  },
  reject: {
    title: "¿Rechazar la solicitud?",
    message:
      "La tienda continuará operando con normalidad y seguirá siendo visible para los usuarios.",
    confirmLabel: "Rechazar solicitud",
  },
  reactivate: {
    title: "¿Reactivar la tienda?",
    message:
      "La tienda y sus productos volverán a ser visibles para todos los usuarios.",
    confirmLabel: "Reactivar tienda",
  },
} as const;

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("shops");
  const {
    shops,
    loading,
    editingShop,
    saving,
    pendingAction,
    acting,
    setEditingShop,
    setPendingAction,
    handleDelete,
    handleSave,
    runAction,
  } = useAdminShops();

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "shops", label: "Tiendas" },
    { key: "requests", label: "Solicitudes" },
    { key: "penalties", label: "Penalizaciones" },
    { key: "categories", label: "Categorías" },
    { key: "users", label: "Usuarios" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="mb-6 text-2xl font-bold tracking-widest text-white">
        ADMIN
      </h2>

      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-white/10 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`min-h-11 shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? "bg-[#1DD317] text-[#07110C]"
                : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "shops" && (
        <>
          {loading ? (
            <p className="text-center text-gray-300 italic">
              Cargando tiendas...
            </p>
          ) : shops.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {shops.map((shop) => (
                <ShopCard
                  key={shop.id_shop}
                  shop={shop}
                  onEdit={setEditingShop}
                  onDelete={handleDelete}
                  onAction={(shop, action) => setPendingAction({ type: action, shop })}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-300 italic">No hay tiendas.</p>
          )}

          {editingShop && (
            <ShopEditModal
              key={editingShop.id_shop}
              shop={editingShop}
              onClose={() => setEditingShop(null)}
              onSave={handleSave}
              saving={saving}
            />
          )}

          {pendingAction && (
            <ConfirmModal
              key={pendingAction.shop.id_shop}
              isOpen
              title={ACTION_CONFIG[pendingAction.type].title}
              message={ACTION_CONFIG[pendingAction.type].message}
              confirmLabel={ACTION_CONFIG[pendingAction.type].confirmLabel}
              danger={pendingAction.type === "reject"}
              busy={acting}
              busyLabel="Procesando…"
              onConfirm={runAction}
              onClose={() => !acting && setPendingAction(null)}
            />
          )}
        </>
      )}

      {activeTab === "requests" && <SellerRequestsTab />}
      {activeTab === "penalties" && <PenaltiesTab />}
      {activeTab === "categories" && <CategoriesTab />}
      {activeTab === "users" && <UsersTab />}
    </div>
  );
};