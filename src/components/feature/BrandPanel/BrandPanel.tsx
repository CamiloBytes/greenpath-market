import React from "react";
import Image from "next/image";

interface BrandPanelProps {
  image: string;
}

export const BrandPanel = ({ image }: BrandPanelProps) => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#07110C]">
      <Image
        src={image}
        alt="cover"
        fill
        sizes="50vw"
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black to-transparent" />
      <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-2xl md:text-4xl font-bold text-[#D9D9D9] [text-shadow:2px_2px_6px_rgba(0,0,0,0.7)]">
        From the field to your table
      </p>
    </div>
  );
};
