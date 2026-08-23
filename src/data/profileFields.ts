import type { EditableField } from "@/src/types/ProfileTypes";
import type { UserProfile } from "@/src/services/Auth/AuthServices";

export const buildProfileFields = (profile: UserProfile | null): EditableField[] => {
  const year = profile?.created_at
    ? new Date(profile.created_at).getFullYear()
    : null;

  return [
    {
      key: "email",
      label: "Correo",
      display: profile?.email ?? "usuario@example.com",
      inputType: "email",
    },
    {
      key: "address",
      label: "Dirección",
      display: profile?.user_address ?? "Calle Falsa 123, Barranquilla",
    },
    {
      key: "description",
      label: "Descripción",
      display: year ? `Usuario registrado desde ${year}` : "Usuario registrado desde 2025",
      editable: false,
    },
  ];
};