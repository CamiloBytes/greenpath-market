"use client";

import { useState } from "react";
import { useSellerRequest } from "@/src/hooks/profile/useSellerRequest";
import { useAuthStore } from "@/src/stores/authStore";
import Link from "next/link";

export const SellerRequestView = () => {
  const { user } = useAuthStore();
  const { request, loading, submitting, submitRequest } = useSellerRequest();
  const [form, setForm] = useState({
    shopName: "",
    description: "",
    address: "",
    logoUrl: "",
    reason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shopName || !form.description || !form.address || !form.reason) return;

    await submitRequest({
      shop_name: form.shopName,
      description: form.description,
      shop_address: form.address,
      logo_url: form.logoUrl || "https://res.cloudinary.com/dd7vy0y6n/image/upload/v1756505801/photo-profile_1_oazfvi.jpg",
      why_seller: form.reason,
    });

    setForm({ shopName: "", description: "", address: "", logoUrl: "", reason: "" });
  };

  if (loading) {
    return (
      <div>
        <h3 className="mb-4 text-2xl font-bold text-white">
          Solicitar ser Vendedor
        </h3>
        <p className="text-gray-300 italic">Cargando estado de solicitud...</p>
      </div>
    );
  }

  if (user?.role_id === 2) {
    return (
      <div>
        <h3 className="mb-4 text-2xl font-bold text-white">
          Solicitar ser Vendedor
        </h3>
        <div className="rounded-2xl border border-[#1DD317]/40 bg-[#1DD317]/10 p-6">
          <p className="mb-3 text-sm text-[#1DD317]">
            Ya eres vendedor. Puedes gestionar tu tienda y productos desde la sección &quot;Mi Tienda&quot;.
          </p>
          <Link
            href="/my-shop"
            className="inline-block rounded-xl bg-[#1DD317] px-6 py-2.5 text-sm font-bold text-[#07110C] transition-colors hover:bg-[#16a813]"
          >
            Ir a Mi Tienda
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role_id === 3) {
    return (
      <div>
        <h3 className="mb-4 text-2xl font-bold text-white">
          Solicitar ser Vendedor
        </h3>
        <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-6">
          <p className="text-sm text-blue-300">
            Eres administrador. Las solicitudes de vendedor se gestionan desde el panel de administración.
          </p>
        </div>
      </div>
    );
  }

  if (request) {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-500/20",
        border: "border-yellow-500/40",
        text: "text-yellow-300",
        label: "Pendiente",
        message:
          "Tu solicitud está pendiente de revisión por parte del administrador. Te notificaremos cuando sea procesada.",
      },
      approved: {
        bg: "bg-green-500/20",
        border: "border-green-500/40",
        text: "text-green-300",
        label: "Aprobada",
        message:
          "¡Felicidades! Tu solicitud ha sido aprobada. Tu tienda ya está activa.",
      },
      denied: {
        bg: "bg-red-500/20",
        border: "border-red-500/40",
        text: "text-red-300",
        label: "Denegada",
        message:
          "Tu solicitud fue denegada por el administrador. Puedes revisar los detalles y enviar una nueva solicitud.",
      },
    };

    const config = statusConfig[request.status];

    return (
      <div>
        <h3 className="mb-4 text-2xl font-bold text-white">
          Solicitar ser Vendedor
        </h3>
        <div
          className={`rounded-2xl border ${config.bg} ${config.border} p-6`}
        >
          <div className="mb-3 flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${config.bg} ${config.text} border ${config.border}`}>
              {config.label}
            </span>
            <span className="text-sm text-gray-400">
              {new Date(request.created_at).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <p className={`mb-4 text-sm ${config.text}`}>{config.message}</p>

          <div className="mb-4 rounded-xl bg-white/5 p-4">
            <p className="text-sm text-gray-300">
              <strong className="text-white">Tienda:</strong> {request.shop_name}
            </p>
            <p className="text-sm text-gray-300">
              <strong className="text-white">Dirección:</strong>{" "}
              {request.shop_address}
            </p>
          </div>

          {request.admin_note && (
            <div className="rounded-xl bg-white/5 p-4">
              <p className="text-sm font-medium text-gray-300">
                <strong className="text-white">Nota del admin:</strong>{" "}
                {request.admin_note}
              </p>
            </div>
          )}

          {request.status === "approved" && (
            <Link
              href="/my-shop"
              className="mt-4 inline-block rounded-xl bg-[#1DD317] px-6 py-2.5 text-sm font-bold text-[#07110C] transition-colors hover:bg-[#16a813]"
            >
              Ir a Mi Tienda
            </Link>
          )}

          {request.status === "denied" && (
            <p className="mt-4 text-sm text-gray-400">
              Puedes enviar una nueva solicitud cuando desees.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-2xl font-bold text-white">
        Solicitar ser Vendedor
      </h3>
      <p className="mb-6 text-sm text-gray-300">
        Completa el siguiente formulario para enviar tu solicitud. Un
        administrador revisará tu caso y te notificaremos por correo electrónico.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            Nombre de la tienda:
          </label>
          <input
            type="text"
            name="shopName"
            value={form.shopName}
            onChange={handleChange}
            placeholder="Ej: Mi Tienda Orgánica"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-[#1DD317] transition-colors"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            Descripción:
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe tu tienda y los productos que vendes..."
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-[#1DD317] transition-colors resize-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            Dirección:
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Ej: Calle 123 # 45-67"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-[#1DD317] transition-colors"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            Logo de la tienda (URL):
          </label>
          <input
            type="url"
            name="logoUrl"
            value={form.logoUrl}
            onChange={handleChange}
            placeholder="https://ejemplo.com/logo.png (opcional)"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-[#1DD317] transition-colors"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white">
            ¿Por qué quieres ser vendedor?
          </label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={3}
            placeholder="Cuéntanos por qué te gustaría unirte como vendedor..."
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-[#1DD317] transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-xl bg-[#1DD317] px-6 py-3 text-sm font-bold text-[#07110C] transition-colors hover:bg-[#16a813] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Enviando solicitud..." : "Enviar Solicitud"}
        </button>
      </form>
    </div>
  );
};
