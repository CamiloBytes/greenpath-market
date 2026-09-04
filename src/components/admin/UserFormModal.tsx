"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../ui/Modal/Modal";
import type { User } from "@/src/types/UserTypes";
import {
  userSchema,
  type UserFormData,
} from "@/src/validation/user/UserValidation";

const fieldClass =
  "w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-[#1DD317] focus:bg-white/15";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60";
const errorClass = "mt-1 text-xs text-red-400";

export const UserFormModal = ({
  user,
  saving,
  onSave,
  onClose,
}: {
  user: User | null;
  saving: boolean;
  onSave: (data: UserFormData) => void;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: user?.full_name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      birthdate: user?.birthdate ?? "",
      id_document_type: user?.id_document_type ?? 1,
      document_number: user?.document_number ?? "",
      user_password: "",
      id_rol: user?.id_rol ?? 1,
      user_address: user?.user_address ?? "",
    },
  });

  const onSubmit = (data: UserFormData) => {
    onSave(data);
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      eyebrow="Panel admin"
      title={user ? "Editar usuario" : "Nuevo usuario"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="user-name" className={labelClass}>
            Nombre completo
          </label>
          <input
            id="user-name"
            type="text"
            {...register("full_name")}
            placeholder="Ej: Juan Pérez"
            className={fieldClass}
          />
          {errors.full_name && (
            <p className={errorClass}>{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="user-email" className={labelClass}>
            Email
          </label>
          <input
            id="user-email"
            type="email"
            {...register("email")}
            placeholder="juan@ejemplo.com"
            className={fieldClass}
          />
          {errors.email && (
            <p className={errorClass}>{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="user-phone" className={labelClass}>
              Teléfono
            </label>
            <input
              id="user-phone"
              type="text"
              {...register("phone")}
              placeholder="3001234567"
              className={fieldClass}
            />
            {errors.phone && (
              <p className={errorClass}>{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="user-birthdate" className={labelClass}>
              Fecha nacimiento
            </label>
            <input
              id="user-birthdate"
              type="date"
              {...register("birthdate")}
              className={fieldClass}
            />
            {errors.birthdate && (
              <p className={errorClass}>{errors.birthdate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="user-doc-type" className={labelClass}>
              Tipo documento
            </label>
            <select
              id="user-doc-type"
              {...register("id_document_type", { valueAsNumber: true })}
              className={fieldClass}
            >
              <option value={1}>CC</option>
              <option value={2}>CE</option>
              <option value={3}>TI</option>
              <option value={4}>PA</option>
              <option value={5}>NIT</option>
            </select>
          </div>
          <div>
            <label htmlFor="user-doc-number" className={labelClass}>
              Número documento
            </label>
            <input
              id="user-doc-number"
              type="text"
              {...register("document_number")}
              placeholder="1012345678"
              className={fieldClass}
            />
            {errors.document_number && (
              <p className={errorClass}>{errors.document_number.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="user-role" className={labelClass}>
            Rol
          </label>
          <select
            id="user-role"
            {...register("id_rol", { valueAsNumber: true })}
            className={fieldClass}
          >
            <option value={1}>Cliente</option>
            <option value={2}>Vendedor</option>
            <option value={3}>Admin</option>
          </select>
        </div>

        {!user && (
          <div>
            <label htmlFor="user-password" className={labelClass}>
              Contraseña
            </label>
            <input
              id="user-password"
              type="password"
              {...register("user_password")}
              placeholder="Mínimo 6 caracteres"
              className={fieldClass}
            />
            {errors.user_password && (
              <p className={errorClass}>{errors.user_password.message}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="user-address" className={labelClass}>
            Dirección (opcional)
          </label>
          <input
            id="user-address"
            type="text"
            {...register("user_address")}
            placeholder="Cra 10 # 12-34"
            className={fieldClass}
          />
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="min-h-11 flex-1 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Guardando…"
              : user
                ? "Guardar cambios"
                : "Crear usuario"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};
