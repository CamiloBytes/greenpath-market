import { FiLogOut } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { IoMdPerson } from "react-icons/io";
import { MdLocalOffer } from "react-icons/md";
import { FaShop } from "react-icons/fa6";
import { GiGreenhouse } from "react-icons/gi";
import Link from "next/link";
import { SearchInput } from "../../ui/Input";


const iconButton = "text-2xl text-white/90 hover:text-[#1DD317] transition-colors duration-200";

export const Navbar = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav className="bg-gradient-to-r from-[#07110C]/80 via-[#07110C]/65 to-[#0A1A12]/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between ">
          <Link href="/" className="flex items-center gap-2 text-white">
            <GiGreenhouse className="text-3xl text-[#1DD317]" />
            <span className="text-xl font-bold tracking-tight">GreenPath</span>
          </Link>

          <div className="flex items-center gap-5">
            <button type="button" aria-label="Personas" className={iconButton}>
              <IoMdPerson />
            </button>
            <button type="button" aria-label="Tienda" className={iconButton}>
              <FaShop />
            </button>
            <button type="button" aria-label="Carrito" className={iconButton}>
              <FiShoppingCart />
            </button>
            <button type="button" aria-label="Ofertas" className={iconButton}>
              <MdLocalOffer />
            </button>
            <button type="button" aria-label="Perfil" className={iconButton}>
              <IoMdPerson />
            </button>

            <SearchInput className="!w-64" />

            <button type="button" aria-label="Salir" className={iconButton}>
              <FiLogOut />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
