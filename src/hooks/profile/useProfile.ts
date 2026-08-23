import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { useToast } from "@/src/context/ToastContext";
import { getProfile, updateUser } from "@/src/services/Auth/AuthServices";
import type { UserProfile } from "@/src/services/Auth/AuthServices";
import type { ProfileView } from "@/src/types/ProfileTypes";

export const useProfile = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<ProfileView | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const loadProfile = useCallback(async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setNameValue(data.full_name ?? "");
    } catch {
      showToast("Error al cargar el perfil del usuario", "error");
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProfile();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadProfile]);

  const handleStartEdit = useCallback((field: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: prev[field] ?? "" }));
    setEditingField(field);
  }, []);

  const handleCancelEdit = useCallback(
    (field: string) => {
      if (editingField === field) setEditingField(null);
    },
    [editingField]
  );

  const handleSaveField = useCallback(
    async (field: string) => {
      const value = (fieldValues[field] ?? "").trim();
      if (!value) {
        showToast("El campo no puede estar vacío", "error");
        return;
      }

      try {
        if (field === "description") {
          showToast("La descripción no se puede actualizar desde aquí", "info");
          return;
        }

        if (!profile) return;

        const payload: Record<string, string> = {};
        if (field === "email") payload.email = value;
        if (field === "address") payload.user_address = value;

        await updateUser(profile.id_user, payload);
        setEditingField(null);
        await loadProfile();
        showToast("Cambios guardados exitosamente");
      } catch {
        showToast("Error al guardar los cambios", "error");
      }
    },
    [fieldValues, profile, loadProfile, showToast]
  );

  const handleEditName = useCallback(() => {
    setNameValue(profile?.full_name ?? "");
    setEditingName(true);
  }, [profile]);

  const handleSaveName = useCallback(async () => {
    const value = nameValue.trim();
    if (!value) {
      showToast("El campo no puede estar vacío", "error");
      return;
    }

    try {
      if (!profile) return;
      await updateUser(profile.id_user, { full_name: value });
      setEditingName(false);
      await loadProfile();
      showToast("Cambios guardados exitosamente");
    } catch {
      showToast("Error al guardar los cambios", "error");
    }
  }, [nameValue, profile, loadProfile, showToast]);

  const handleFieldChange = useCallback((field: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/auth");
    router.refresh();
  }, [logout, router]);

  const showSettings = activeView === null || activeView === "pedidos";

  return {
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
  };
};