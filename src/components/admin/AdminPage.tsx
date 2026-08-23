"use client";

import { useState } from "react";
import { useAdminShops } from "@/src/hooks/admin/useAdminShops";
import { ShopCard } from "./ShopCard";
import { ShopEditModal } from "./ShopEditModal";
import { SellerRequestsTab } from "./SellerRequestsTab";
import { PenaltiesTab } from "./PenaltiesTab";

type AdminTab = "shops" | "requests" | "penalties";

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("shops");
  const {
    shops,
    loading,
    editingShop,
    saving,
    setEditingShop,
    handleDelete,
    handleSave,
  } = useAdminShops();

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "shops", label: "Tiendas" },
    { key: "requests", label: "Solicitudes" },
    { key: "penalties", label: "Penalizaciones" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="mb-6 text-2xl font-bold tracking-widest text-white">
        ADMIN
      </h2>

      <div className="mb-6 flex gap-2 border-b border-white/10 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
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
        </>
      )}

      {activeTab === "requests" && <SellerRequestsTab />}
      {activeTab === "penalties" && <PenaltiesTab />}
    </div>
  );
};
