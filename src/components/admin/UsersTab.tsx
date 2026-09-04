"use client";

import { motion } from "framer-motion";
import { FaPlus, FaPenToSquare, FaTrash } from "react-icons/fa6";
import { useAdminUsers } from "@/src/hooks/admin/useAdminUsers";
import { UserFormModal } from "./UserFormModal";
import { ConfirmModal } from "../shop/ConfirmModal";
import type { User } from "@/src/types/UserTypes";

const ROLE_LABELS: Record<number, string> = {
  1: "Cliente",
  2: "Vendedor",
  3: "Admin",
};

export const UsersTab = () => {
  const {
    users,
    loading,
    saving,
    editing,
    formOpen,
    deleting,
    openCreate,
    openEdit,
    handleSave,
    handleDelete,
    setDeleting,
    setFormOpen,
  } = useAdminUsers();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-widest text-white">
          USUARIOS
        </h3>
        <button
          onClick={openCreate}
          className="flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
        >
          <FaPlus /> Nuevo usuario
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-300 italic">
          Cargando usuarios...
        </p>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users.map((user) => (
            <UserAdminCard
              key={user.id_user}
              user={user}
              onEdit={() => openEdit(user)}
              onDelete={() => setDeleting(user)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-300 italic">
          No hay usuarios registrados.
        </p>
      )}

      {formOpen && (
        <UserFormModal
          key={editing?.id_user ?? "new"}
          user={editing}
          saving={saving}
          onSave={(data) => handleSave(data)}
          onClose={() => setFormOpen(false)}
        />
      )}

      {deleting && (
        <ConfirmModal
          isOpen
          title="¿Eliminar usuario?"
          message={`El usuario "${deleting.full_name}" será eliminado permanentemente. Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar usuario"
          danger
          onConfirm={() => handleDelete(deleting)}
          onClose={() => setDeleting(null)}
        />
      )}
    </section>
  );
};

const UserAdminCard = ({
  user,
  onEdit,
  onDelete,
}: {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white truncate">
            {user.full_name}
          </h4>
          <p className="mt-1 text-xs text-white/50 truncate">{user.email}</p>
        </div>
        <span
          className={`ml-2 shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
            user.id_rol === 3
              ? "bg-red-500/20 text-red-300"
              : user.id_rol === 2
                ? "bg-blue-500/20 text-blue-300"
                : "bg-green-500/20 text-green-300"
          }`}
        >
          {ROLE_LABELS[user.id_rol] ?? "Desconocido"}
        </span>
      </div>

      <div className="mt-3 space-y-1 text-xs text-white/40">
        <p>Tel: {user.phone}</p>
        <p>Doc: {user.document_number}</p>
        {user.user_address && <p>Dir: {user.user_address}</p>}
      </div>

      <div className="mt-4 flex shrink-0 gap-2">
        <button
          onClick={onEdit}
          aria-label={`Editar ${user.full_name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          <FaPenToSquare size={14} />
        </button>
        <button
          onClick={onDelete}
          aria-label={`Eliminar ${user.full_name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/20 text-red-300 transition-colors hover:bg-red-500/40"
        >
          <FaTrash size={14} />
        </button>
      </div>
    </motion.div>
  );
};
