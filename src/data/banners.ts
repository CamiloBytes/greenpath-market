import {
  GiAvocado,
  GiCarrot,
  GiGreenhouse,
  GiMonsteraLeaf,
  GiOrange,
  GiSeedling,
  GiShinyApple,
  GiSunflower,
  GiWheat,
} from "react-icons/gi";

type IconType = typeof GiMonsteraLeaf;

export interface FloatingIcon {
  Icon: IconType;
  className: string;
  delay: number;
}

export interface Banner {
  id: number;
  badge: string;
  title: string;
  description: string;
  cta: string;
  bg: string;
  image?: string;
  orbs: { color: string; className: string }[];
  floats: FloatingIcon[];
}

export const banners: Banner[] = [
  {
    id: 1,
    badge: "Nueva colección",
    image: "/slide-coffe.jpg",
    title: "Frescos de la huerta a tu mesa",
    description:
      "Descubre nuestra selección de orgánicos de temporada, cultivados con amor y sostenibilidad.",
    cta: "Explorar colección",
    bg: "bg-gradient-to-br from-[#06110C] via-[#0D2A1A] to-[#134E2C]",
    orbs: [
      { color: "bg-[#1DD317]/25", className: "-top-20 -right-16 h-80 w-80" },
      { color: "bg-emerald-400/15", className: "-bottom-24 left-10 h-72 w-72" },
    ],
    floats: [
      { Icon: GiMonsteraLeaf, className: "left-8 top-8 text-6xl", delay: 0 },
      { Icon: GiAvocado, className: "right-16 top-1/3 text-7xl", delay: 0.8 },
      { Icon: GiCarrot, className: "bottom-10 left-1/4 text-6xl", delay: 1.6 },
    ],
  },
  {
    id: 2,
    badge: "Ofertas especiales",
    title: "Hasta 50% de descuento esta semana",
    description:
      "Aprovecha las promociones del mercado y ahorra mientras comes más saludable.",
    cta: "Ver ofertas",
    bg: "bg-gradient-to-br from-[#0A1510] via-[#123B1F] to-[#B4651B]/40",
    orbs: [
      { color: "bg-amber-400/25", className: "-right-16 top-1/4 h-80 w-80" },
      { color: "bg-[#1DD317]/20", className: "-bottom-20 left-1/3 h-72 w-72" },
    ],
    floats: [
      { Icon: GiShinyApple, className: "right-1/4 top-10 text-7xl", delay: 0.2 },
      { Icon: GiOrange, className: "bottom-12 right-8 text-6xl", delay: 1 },
      { Icon: GiWheat, className: "left-10 top-1/3 text-6xl", delay: 1.8 },
    ],
  },
  {
    id: 3,
    badge: "Productos destacados",
    title: "Lo más pedido por la comunidad",
    description:
      "Calidad premium y origen sostenible en cada compra, respaldado por miles de reseñas.",
    cta: "Ver destacados",
    bg: "bg-gradient-to-br from-[#050A08] via-[#0C2418] to-[#1E3A8A]/30",
    orbs: [
      { color: "bg-[#1DD317]/20", className: "-top-24 left-1/4 h-80 w-80" },
      { color: "bg-sky-400/15", className: "-bottom-20 right-1/4 h-72 w-72" },
    ],
    floats: [
      { Icon: GiGreenhouse, className: "left-1/4 top-10 text-7xl", delay: 0.4 },
      { Icon: GiSunflower, className: "bottom-10 right-10 text-6xl", delay: 1.2 },
      { Icon: GiSeedling, className: "right-1/3 top-1/2 text-6xl", delay: 2 },
    ],
  },
];
