export interface CategoryItem {
  id: number;
  title: string;
  image: string;
}

export const categories: CategoryItem[] = [
  {
    id: 0,
    title: "All Categories",
    image: "/todas.png",
  },
  {
    id: 1,
    title: "Fruit & Veggies",
    image: "/frutas y verduras.jpg",
  },
  {
    id: 2,
    title: "Grains & Cereals",
    image: "/granos y cereales.jpg",
  },
  {
    id: 3,
    title: "Dairy & Derivatives",
    image: "/queso y huevos.jpg",
  },
  {
    id: 4,
    title: "Beef, Chicken & Fish",
    image: "/res, pollo y pescado.jpg",
  },
];