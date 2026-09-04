"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaPlus, FaPenToSquare, FaTrash } from "react-icons/fa6";
import { useAdminCategories } from "@/src/hooks/admin/useAdminCategories";
import { CategoryFormModal } from "./CategoryFormModal";
import { ConfirmModal } from "../shop/ConfirmModal";
import type { Category } from "@/src/types/CategoryTypes";

export const CategoriesTab = () => {
  const {
    categories,
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
  } = useAdminCategories();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-widest text-white">
          CATEGORÍAS
        </h3>
        <button
          onClick={openCreate}
          className="flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#284827] to-[#1DD317] px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
        >
          <FaPlus /> Nueva categoría
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-300 italic">
          Cargando categorías...
        </p>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryAdminCard
              key={category.id_category}
              category={category}
              onEdit={() => openEdit(category)}
              onDelete={() => setDeleting(category)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-300 italic">
          No hay categorías. Crea la primera.
        </p>
      )}

      {formOpen && (
        <CategoryFormModal
          key={editing?.id_category ?? "new"}
          category={editing}
          saving={saving}
          onSave={(data) => handleSave(data)}
          onClose={() => setFormOpen(false)}
        />
      )}

      {deleting && (
        <ConfirmModal
          isOpen
          title="¿Eliminar categoría?"
          message={`La categoría "${deleting.category_name}" será eliminada. Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar categoría"
          danger
          onConfirm={() => handleDelete(deleting)}
          onClose={() => setDeleting(null)}
        />
      )}
    </section>
  );
};

const CategoryAdminCard = ({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
    >
      <div className="relative h-36 w-full overflow-hidden">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.category_name}
            fill
            loading="lazy"
            unoptimized={category.image_url.startsWith("http")}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/10 text-white/40">
            Sin imagen
          </div>
        )}
      </div>
      <div className="flex flex-1 items-center justify-between gap-2 p-4">
        <h4 className="text-sm font-bold text-white">
          {category.category_name}
        </h4>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={onEdit}
            aria-label={`Editar ${category.category_name}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <FaPenToSquare size={14} />
          </button>
          <button
            onClick={onDelete}
            aria-label={`Eliminar ${category.category_name}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/20 text-red-300 transition-colors hover:bg-red-500/40"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};