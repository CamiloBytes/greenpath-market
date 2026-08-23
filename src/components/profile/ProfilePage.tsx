"use client";

import { useProfile } from "@/src/hooks/profile/useProfile";
import { ProfileSidebar } from "./ProfileSidebar";
import { SettingsSection } from "./SettingsSection";
import { OrdersView } from "./OrdersView";
import { HelpView } from "./HelpView";
import { PaymentMethodsView } from "./PaymentMethodsView";
import { SellerRequestView } from "./SellerRequestView";

export const ProfilePage = () => {
  const {
    profile,
    activeView,
    setActiveView,
    editingField,
    editingName,
    setEditingName,
    nameValue,
    setNameValue,
    fieldValues,
    handleStartEdit,
    handleCancelEdit,
    handleSaveField,
    handleEditName,
    handleSaveName,
    handleFieldChange,
    handleLogout,
    showSettings,
  } = useProfile();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-start">
      <ProfileSidebar
        profile={profile}
        activeView={activeView ?? "pedidos"}
        onSelectView={(view) => {
          if (view === "logout") {
            handleLogout();
            return;
          }
          setActiveView(view);
        }}
        editingName={editingName}
        nameValue={nameValue}
        onNameChange={setNameValue}
        onEditName={handleEditName}
        onSaveName={handleSaveName}
        onCancelName={() => setEditingName(false)}
        onLogout={handleLogout}
      />

      <section className="min-h-[400px] flex-1 rounded-2xl bg-[#37963d2d] p-6 backdrop-blur-md">
        {showSettings && (
          <>
            <h3 className="mb-4 text-2xl font-bold text-white">
              Configuración
            </h3>
            <SettingsSection
              profile={profile}
              editingField={editingField}
              fieldValues={fieldValues}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onSaveField={handleSaveField}
              onFieldChange={handleFieldChange}
            />
          </>
        )}

        <div className="mt-6">
          {activeView === "pedidos" && <OrdersView />}
          {activeView === "ayuda" && <HelpView />}
          {activeView === "metodo" && <PaymentMethodsView />}
          {activeView === "seller-request" && <SellerRequestView />}
        </div>
      </section>
    </div>
  );
};