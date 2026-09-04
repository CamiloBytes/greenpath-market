"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal/Modal";
import type { User, UserFormData } from "@/src/types/UserTypes";

const fieldClass =
  "w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-[#1DD317] focus:bg-white/15";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60";

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
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [birthdate, setBirthdate] = useState(user?.birthdate ?? "");
  const [documentNumber, setDocumentNumber] = useState(
    user?.document_number ?? ""
  );
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(user?.user_address ?? "");
  const [idRol, setIdRol] = useState(user?.id_rol ?? 1);
  const [idDocumentType, setIdDocumentType] = useState(
    user?.id_document_type ?? 1
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    onSave({
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      birthdate,
      document_number: documentNumber.trim(),
      user_password: password,
      id_rol: idRol,
      id_document_type: idDocumentType,
      user_address: address.trim() || undefined,
    });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      eyebrow="Panel admin"
      title={user ? "Editar usuario" : "Nuevo usuario"}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="user-name" className={labelClass}>
            Nombre completo
          </label>
          <input
            id="user-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Ej: Juan Pérez"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="user-email" className={labelClass}>
            Email
          </label>
          <input
            id="user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="juan@ejemplo.com"
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="user-phone" className={labelClass}>
              Teléfono
            </label>
            <input
              id="user-phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="3001234567"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="user-birthdate" className={labelClass}>
              Fecha nacimiento
            </label>
            <input
              id="user-birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
              className={fieldClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="user-doc-type" className={labelClass}>
              Tipo documento
            </label>
            <select
              id="user-doc-type"
              value={idDocumentType}
              onChange={(e) => setIdDocumentType(Number(e.target.value))}
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
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              required
              placeholder="1012345678"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="user-role" className={labelClass}>
            Rol
          </label>
          <select
            id="user-role"
            value={idRol}
            onChange={(e) => setIdRol(Number(e.target.value))}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!user}
              placeholder="Mínimo 6 caracteres"
              className={fieldClass}
            />
          </div>
        )}

        <div>
          <label htmlFor="user-address" className={labelClass}>
            Dirección (opcional)
          </label>
          <input
            id="user-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
