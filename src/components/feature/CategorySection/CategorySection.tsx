"use client";

import { CardCategory } from "../../ui/Cards";

const categories = [
  {
    id: 1,
    title: "All Categories",
    image: "/todas.png",
  },
  {
    id: 2,
    title: "Vegetables",
    image: "/frutas y verduras.jpg",
  },
  {
    id: 3,
    title: "Fruits",
    image: "/granos y cereales.jpg",
  },
  {
    id: 4,
    title: "Meat",
    image: "/queso y huevos.jpg",
  },
  {
    id: 5,
    title: "Dairy",
    image: "/res, pollo y pescado.jpg",
  },
];

export const CategorySection = () => {
  return (
    <section className="flex flex-col ">
      <div className="flex flex-col items-start justify-start gap-4 ">
        <h1 className="text-3xl font-bold text-center text-white">
          Categories
        </h1>
      </div>
      <div className="mt-8 flex flex-row  items-center justify-center gap-10">
        {categories.map((category) => (
          <CardCategory
            key={category.id}
            imageUrl={category.image}
            title={category.title}
            onClick={() => console.log(category.title)}
          />
        ))}
      </div>
    </section>
  );
};
