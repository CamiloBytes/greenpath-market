"use client";

import { FaPenToSquare } from "react-icons/fa6";
import type { UserProfile } from "@/src/services/Auth/AuthServices";
import type { EditableField } from "@/src/types/ProfileTypes";
import { buildProfileFields } from "@/src/data/profileFields";

export const SettingsSection = ({
  profile,
  editingField,
  fieldValues,
  onStartEdit,
  onCancelEdit,
  onSaveField,
  onFieldChange,
}: {
  profile: UserProfile | null;
  editingField: string | null;
  fieldValues: Record<string, string>;
  onStartEdit: (field: string) => void;
  onCancelEdit: (field: string) => void;
  onSaveField: (field: string) => void;
  onFieldChange: (field: string, value: string) => void;
}) => {
  const fields: EditableField[] = buildProfileFields(profile);

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => {
        const isEditing = editingField === field.key;
        const showActions = field.editable !== false;

        return (
          <div
            key={field.key}
            className="flex flex-wrap items-center gap-3 rounded-xl bg-white/5 px-4 py-3"
          >
            {isEditing ? (
              <input
                type={field.inputType ?? "text"}
                value={fieldValues[field.key] ?? ""}
                onChange={(e) => onFieldChange(field.key, e.target.value)}
                placeholder={field.label}
                className="min-w-0 flex-1 rounded-lg border border-[#1DD317]/40 bg-white/10 px-3 py-1.5 text-sm text-white outline-none focus:border-[#1DD317]"
              />
            ) : (
              <span className="flex-1 text-sm text-gray-200">
                <strong className="text-white">{field.label}:</strong>{" "}
                {field.display}
              </span>
            )}

            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => onSaveField(field.key)}
                  className="rounded-lg bg-[#1DD317] px-3 py-1.5 text-xs font-bold text-[#07110C] hover:bg-[#20B11B] transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={() => onCancelEdit(field.key)}
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-gray-300 hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              showActions && (
                <button
                  onClick={() => onStartEdit(field.key)}
                  aria-label={`Editar ${field.label}`}
                  className="text-sm text-white/60 hover:text-[#1DD317] transition-colors"
                >
                  <FaPenToSquare size={16} />
                </button>
              )
            )}
          </div>
        );
      })}
    </div>
  );
};