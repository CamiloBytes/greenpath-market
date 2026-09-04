import { useCallback, useEffect, useState } from "react";
import {
  createCategoryWithImage,
  deleteCategory,
  getCategories,
  updateCategoryWithImage,
} from "@/src/services/Category/CategoryServices";
import { useToastStore } from "@/src/stores/toastStore";
import type { Category } from "@/src/types/CategoryTypes";
import type { CategoryFormData } from "@/src/validation/category/CategoryValidation";

type CategorySaveData = CategoryFormData & { imageFile: File | null };

export const useAdminCategories = () => {
  const { showToast } = useToastStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      showToast("Error cargando las categorías", "error");
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

  const openEdit = useCallback((category: Category) => {
    setEditing(category);
    setFormOpen(true);
  }, []);

  const handleSave = useCallback(
    async (data: CategorySaveData): Promise<boolean> => {
      setSaving(true);
      try {
        if (editing) {
          await updateCategoryWithImage(
            editing.id_category,
            data.category_name,
            data.imageFile ?? undefined
          );
          showToast("Categoría actualizada exitosamente");
        } else {
          if (!data.imageFile) {
            showToast("Debes seleccionar una imagen", "error");
            return false;
          }
          await createCategoryWithImage(data.category_name, data.imageFile);
          showToast("Categoría creada exitosamente");
        }

        setFormOpen(false);
        setEditing(null);
        await load();
        return true;
      } catch {
        showToast("Error al guardar la categoría", "error");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [editing, load, showToast]
  );

  const handleDelete = useCallback(
    async (category: Category) => {
      try {
        await deleteCategory(category.id_category);
        showToast("Categoría eliminada");
        setDeleting(null);
        await load();
      } catch {
        showToast("Error al eliminar la categoría", "error");
        setDeleting(null);
      }
    },
    [load, showToast]
  );

  return {
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
  };
};
