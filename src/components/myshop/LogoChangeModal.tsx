"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal/Modal";
import { ImageUploader } from "../ui/ImageUploader";
import type { Shop } from "@/src/types/ShopTypes";

export const LogoChangeModal = ({
  isOpen,
  shop,
  onLogoChange,
  onClose,
}: {
  isOpen: boolean;
  shop: Shop;
  onLogoChange: (file: File) => Promise<string>;
  onClose: () => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      const timer = setTimeout(() => {
        setDone(false);
        setFiles([]);
        onClose();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [done, onClose]);

  const upload = async (file: File) => {
    await onLogoChange(file);
    setDone(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Mi tienda"
      title="Cambiar logo"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
            {shop.logo_url ? (
              <Image
                src={shop.logo_url}
                alt={`Logo de ${shop.shop_name}`}
                fill
                unoptimized={shop.logo_url.startsWith("http")}
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs text-white/50">
                —
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {shop.shop_name}
            </p>
            <p className="text-xs text-white/50">
              Logo actual de la tienda.
            </p>
          </div>
        </div>

        <ImageUploader
          label="Nuevo logo"
          files={files}
          onFilesChange={setFiles}
          onUpload={upload}
        />
      </div>
    </Modal>
  );
};