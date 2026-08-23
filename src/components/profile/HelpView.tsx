"use client";

import { FaWhatsapp, FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa6";

const HELP_LINKS = [
  {
    label: "Gmail",
    href: "mailto:recursos.humanos@greenpath.com",
    icon: <FaEnvelope />,
  },
  { label: "WhatsApp", href: "https://wa.me/573001112233", icon: <FaWhatsapp /> },
  {
    label: "Instagram",
    href: "https://instagram.com/tuusuario",
    icon: <FaInstagram />,
  },
  { label: "Telegram", href: "https://t.me/tuusuario", icon: <FaTelegramPlane /> },
];

export const HelpView = () => {
  return (
    <div>
      <h4 className="mb-2 text-xl font-bold text-white">Centro de Ayuda</h4>
      <p className="mb-6 text-sm text-gray-300">
        ¿Necesitas soporte? Contáctanos por cualquiera de nuestras redes
        sociales:
      </p>
      <div className="grid grid-cols-2 gap-4">
        {HELP_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 px-4 py-6 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 no-underline"
          >
            <span className="text-3xl text-[#1DD317]">{link.icon}</span>
            <span className="text-sm font-semibold">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};