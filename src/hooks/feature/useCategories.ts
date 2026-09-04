import { useEffect, useState } from "react";
import {
  categories as staticCategories,
} from "@/src/data/categories";
import { getCategories } from "@/src/services/Category/CategoryServices";

export interface CategoryOption {
  id: number;
  title: string;
  image: string | null;
}

export const useCategories = (includeAll = false) => {
  const fallback: CategoryOption[] = includeAll
    ? staticCategories
    : staticCategories.filter((c) => c.id !== 0);

  const [options, setOptions] = useState<CategoryOption[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      getCategories()
        .then((list) => {
          if (!active || list.length === 0) return;
          const backend = list.map((c) => ({
            id: c.id_category,
            title: c.category_name,
            image: c.image_url,
          }));
          const next = includeAll
            ? [{ id: 0, title: "All Categories", image: "/todas.png" }, ...backend]
            : backend;
          setOptions(next);
        })
        .catch(() => {
          /* keep static fallback */
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [includeAll]);

  return { options, loading };
};