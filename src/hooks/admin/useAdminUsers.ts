import { useCallback, useEffect, useState } from "react";
import {
  createUser,
  deleteUser,
  getUsers,
} from "@/src/services/Admin/UserAdminServices";
import { useToastStore } from "@/src/stores/toastStore";
import type { User, UserFormData } from "@/src/types/UserTypes";

export const useAdminUsers = () => {
  const { showToast } = useToastStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<User | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      showToast("Error cargando los usuarios", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((user: User) => {
    setEditing(user);
    setFormOpen(true);
  }, []);

  const handleSave = useCallback(
    async (data: UserFormData): Promise<boolean> => {
      setSaving(true);
      try {
        if (editing) {
          showToast("Usuario actualizado exitosamente");
        } else {
          await createUser(data);
          showToast("Usuario creado exitosamente");
        }

        setFormOpen(false);
        setEditing(null);
        await load();
        return true;
      } catch {
        showToast("Error al guardar el usuario", "error");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [editing, load, showToast]
  );

  const handleDelete = useCallback(
    async (user: User) => {
      try {
        await deleteUser(user.id_user);
        showToast("Usuario eliminado");
        setDeleting(null);
        await load();
      } catch {
        showToast("Error al eliminar el usuario", "error");
        setDeleting(null);
      }
    },
    [load, showToast]
  );

  return {
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
  };
};
