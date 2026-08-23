"use client";

import { CardCategory } from "../../ui/Cards";
import { categories } from "@/src/data/categories";

export const CategorySection = ({
  activeCategory,
  onSelectCategory,
}: {
  activeCategory: number;
  onSelectCategory: (id: number) => void;
}) => {
  return (
    <section className="flex flex-col">
      <div className="flex flex-col items-start justify-center pt-6 gap-4">
        <h1 className="text-3xl font-bold text-center tracking-wider text-white">
          Categories
        </h1>
      </div>
      <div className="mt-8 grid grid-cols-2 items-center justify-center gap-6 sm:grid-cols-3 md:grid-cols-5">
        {categories.map((category) => (
          <CardCategory
            key={category.id}
            imageUrl={category.image}
            title={category.title}
            active={activeCategory === category.id}
            onClick={() => onSelectCategory(category.id)}
          />
        ))}
      </div>
    </section>
  );
};