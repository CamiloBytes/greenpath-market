"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiImage } from "react-icons/fi";
import { useSellerRequest } from "@/src/hooks/profile/useSellerRequest";
import { useAuthStore } from "@/src/stores/authStore";
import { useToastStore } from "@/src/stores/toastStore";
import { uploadSellerRequestLogo } from "@/src/services/Seller/SellerRequestServices";
import { DEFAULT_AVATAR_URL } from "@/src/constants/images";
import {
  sellerRequestSchema,
  type SellerRequestFormData,
} from "@/src/validation/seller/SellerRequestValidation";
import Link from "next/link";

const fieldClass =
  "w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-[#1DD317] transition-colors";
const labelClass = "mb-1 block text-sm font-medium text-white";
const errorClass = "mt-1 text-xs text-red-400";

export const SellerRequestView = () => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const { request, loading, submitting, submitRequest } = useSellerRequest();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SellerRequestFormData>({
    resolver: zodResolver(sellerRequestSchema),
    defaultValues: {
      shop_name: "",
      description: "",
      shop_address: "",
      why_seller: "",
    },
  });

  const onSubmit = async (data: SellerRequestFormData) => {
    setUploading(true);
    try {
      let logo_url: string = DEFAULT_AVATAR_URL;
      if (logoFile) {
        logo_url = await uploadSellerRequestLogo(logoFile);
      }

      await submitRequest({
        shop_name: data.shop_name,
        description: data.description,
        shop_address: data.shop_address ?? "",
        logo_url,
        why_seller: data.why_seller,
      });

      reset();
      setLogoFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Error al subir la imagen",
        "error"
      );
    } finally {
      setUploading(false);
    }
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
            Ya eres vendedor. Puedes gestionar tu tienda y productos desde la
            sección &quot;Mi Tienda&quot;.
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
            Eres administrador. Las solicitudes de vendedor se gestionan desde el
            panel de administración.
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
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${config.bg} ${config.text} border ${config.border}`}
            >
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
              <strong className="text-white">Tienda:</strong>{" "}
              {request.shop_name}
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Nombre de la tienda:</label>
          <input
            type="text"
            {...register("shop_name")}
            placeholder="Ej: Mi Tienda Orgánica"
            className={fieldClass}
          />
          {errors.shop_name && (
            <p className={errorClass}>{errors.shop_name.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Descripción:</label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Describe tu tienda y los productos que vendes..."
            className={`${fieldClass} resize-none`}
          />
          {errors.description && (
            <p className={errorClass}>{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Dirección:</label>
          <input
            type="text"
            {...register("shop_address")}
            placeholder="Ej: Calle 123 # 45-67"
            className={fieldClass}
          />
        </div>

        <div>
          <span className={labelClass}>Logo de la tienda (opcional)</span>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#1DD317]/40 bg-white/5 px-4 py-2.5 text-sm text-white/70 transition-colors hover:border-[#1DD317] hover:bg-white/10">
            <FiImage className="shrink-0 text-[#1DD317]" />
            <span className="truncate">
              {logoFile ? logoFile.name : "Selecciona una imagen"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setLogoFile(file);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(file ? URL.createObjectURL(file) : null);
              }}
            />
          </label>
          {previewUrl && (
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-white/5 p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={previewUrl}
                  alt="Vista previa del logo"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs text-gray-300">
                La imagen se subirá a Cloudinary cuando envíes la solicitud.
              </p>
            </div>
          )}
        </div>

        <div>
          <label className={labelClass}>
            ¿Por qué quieres ser vendedor?
          </label>
          <textarea
            {...register("why_seller")}
            rows={3}
            placeholder="Cuéntanos por qué te gustaría unirte como vendedor..."
            className={`${fieldClass} resize-none`}
          />
          {errors.why_seller && (
            <p className={errorClass}>{errors.why_seller.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || uploading}
          className="mt-2 w-full rounded-xl bg-[#1DD317] px-6 py-3 text-sm font-bold text-[#07110C] transition-colors hover:bg-[#16a813] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading
            ? "Subiendo imagen..."
            : submitting
              ? "Enviando solicitud..."
              : "Enviar Solicitud"}
        </button>
      </form>
    </div>
  );
};
