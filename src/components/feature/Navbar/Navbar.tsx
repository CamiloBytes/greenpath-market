"use client";

import { useState } from "react";
import { FiLogOut, FiShoppingCart } from "react-icons/fi";
import { IoMdPerson } from "react-icons/io";
import { FaShop, FaUserTie } from "react-icons/fa6";
import { GiGreenhouse } from "react-icons/gi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/stores/authStore";
import { useCartStore } from "@/src/stores/cartStore";
import { SearchInput } from "../../ui/Input";
import { motion, AnimatePresence } from "framer-motion";

const iconButton =
  "inline-flex h-11 w-11 items-center justify-center text-2xl text-white/90 hover:text-[#1DD317] transition-colors duration-200 cursor-pointer";

const NAV_LINKS = [
  { href: "/admin", label: "Admin", icon: <FaUserTie /> },
  { href: "/my-shop", label: "My Shop", icon: <FaShop /> },
];

export const Navbar = ({ onSearch }: { onSearch?: (value: string) => void }) => {
  const router = useRouter();
  const { user, loading, logout } = useAuthStore();
  const { cartCount } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
    router.refresh();
  };

  const handleSearch = (value: string) => {
    if (onSearch) {
      onSearch(value);
    } else {
      router.push(`/dashboard?q=${encodeURIComponent(value)}`);
    }
  };

  const filteredNavLinks = NAV_LINKS.filter((link) => {
    if (link.href === "/admin") return user?.role_id === 3;
    if (link.href === "/my-shop") return user?.role_id === 2;
    return true;
  });

  const mobileLinks = [
    ...filteredNavLinks,
    { href: "/cart", label: "Shopping Cart", icon: <FiShoppingCart /> },
    { href: "/profile", label: "Profile", icon: <IoMdPerson /> },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav className="bg-gradient-to-r from-[#07110C]/80 via-[#07110C]/65 to-[#0A1A12]/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-white">
            <GiGreenhouse className="text-3xl text-[#1DD317]" />
            <span className="text-xl font-bold tracking-tight">GreenPath</span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                className={iconButton}
              >
                {link.icon}
              </Link>
            ))}

            <Link href="/cart" aria-label="Carrito" className={`relative ${iconButton}`}>
              <FiShoppingCart />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1DD317] px-1 text-xs font-bold text-[#07110C]"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            <Link
              href="/profile"
              aria-label="Perfil"
              className={iconButton}
            >
              <IoMdPerson />
            </Link>

            <div className="flex items-center gap-2 text-white">
              <IoMdPerson className="text-xl" />
              {loading ? (
                <span className="text-sm text-white/70">Cargando...</span>
              ) : user?.email ? (
                <span className="text-sm font-medium">{user.full_name}</span>
              ) : (
                <Link
                  href="/auth"
                  className="text-sm hover:text-[#1DD317] transition-colors duration-200"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>

            <SearchInput
              className="!w-64"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onSearch={handleSearch}
            />

            {user && (
              <button
                type="button"
                aria-label="Salir"
                className={iconButton}
                onClick={handleLogout}
              >
                <FiLogOut />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <Link href="/cart" aria-label="Carrito" className={`relative ${iconButton}`}>
              <FiShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1DD317] px-1 text-xs font-bold text-[#07110C]">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label="Menú"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
            >
              <span
                className={`h-[2px] w-6 bg-white transition-all duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`h-[2px] w-6 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-[2px] w-6 bg-white transition-all duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#07110C]/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex flex-col p-4">
              <div className="mb-3">
                <SearchInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onSearch={handleSearch}
                />
              </div>

              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-[#1DD317] transition-colors"
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}

              {user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors text-left"
                >
                  <FiLogOut className="text-lg" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};