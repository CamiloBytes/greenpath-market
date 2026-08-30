"use client";

import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import type { UserProfile } from "@/src/services/Auth/AuthServices";
import type { ProfileView } from "@/src/types/ProfileTypes";
import { useAuthStore } from "@/src/stores/authStore";

export const ProfileSidebar = ({
  profile,
  activeView,
  onSelectView,
  editingName,
  nameValue,
  onNameChange,
  onEditName,
  onSaveName,
  onCancelName,
  onLogout,
}: {
  profile: UserProfile | null;
  activeView: ProfileView;
  onSelectView: (view: ProfileView) => void;
  editingName: boolean;
  nameValue: string;
  onNameChange: (value: string) => void;
  onEditName: () => void;
  onSaveName: () => void;
  onCancelName: () => void;
  onLogout: () => void;
}) => {
  const { user } = useAuthStore();
  const menuItems: { view: ProfileView; label: string }[] = [
    { view: "pedidos", label: "Pedidos" },
    { view: "ayuda", label: "Ayuda" },
    { view: "metodo", label: "Método de Pago" },
    ...(user?.role_id === 1 ? [{ view: "seller-request" as ProfileView, label: "Ser Vendedor" }] : []),
  ];

  return (
    <aside className="flex w-full flex-col items-center gap-4 rounded-2xl bg-[#37963d2d] p-6 backdrop-blur-md md:w-[250px] md:min-w-[250px]">
      <Image
        src="https://res.cloudinary.com/dd7vy0y6n/image/upload/v1756505801/photo-profile_1_oazfvi.jpg"
        alt="Foto de perfil"
        width={120}
        height={120}
        className="h-[120px] w-[120px] rounded-full border-4 border-[#1DD317] object-cover"
      />

      <div className="flex w-full items-center justify-center gap-2">
        {editingName ? (
          <>
            <input
              type="text"
              value={nameValue}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Nombre completo"
              className="w-full rounded-lg border border-[#1DD317]/40 bg-white/10 px-3 py-1.5 text-sm text-white outline-none focus:border-[#1DD317]"
            />
            <button
              onClick={onSaveName}
              className="min-h-11 rounded-lg bg-[#1DD317] px-3 py-2 text-xs font-bold text-[#07110C]"
            >
              Guardar
            </button>
            <button
              onClick={onCancelName}
              className="min-h-11 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-gray-300"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <h2 className="text-center text-lg font-bold text-white">
              {profile?.full_name ?? "Mi Perfil"}
            </h2>
            <button
              onClick={onEditName}
              aria-label="Editar nombre"
              className="flex h-11 w-11 items-center justify-center text-sm text-white/60 hover:text-[#1DD317] transition-colors"
            >
              <FiLogOut className="rotate-180" size={16} />
            </button>
          </>
        )}
      </div>

      <nav className="mt-2 flex w-full flex-col gap-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.view}
            onClick={() => onSelectView(item.view)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`min-h-11 w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-white transition-colors ${
              activeView === item.view
                ? "bg-gradient-to-r from-[#284827] to-[#329a2e]"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            {item.label}
          </motion.button>
        ))}

        <button
          onClick={onLogout}
          className="min-h-11 w-full rounded-xl bg-gray-500/30 px-4 py-2.5 text-left text-sm font-semibold text-gray-300 hover:bg-gray-500/50 transition-colors"
        >
          Cerrar Sesión
        </button>
      </nav>
    </aside>
  );
};