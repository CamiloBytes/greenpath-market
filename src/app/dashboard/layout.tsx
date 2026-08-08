import { Navbar } from "@/src/components/ui/Navbar";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0">
        <Image
          src="/bg.jpg"
          alt=""
          fill
          priority
          className="scale-105 object-cover blur-lg"
        />

        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 min-h-screen">
        <Navbar />

        <main className="py-20">{children}</main>
      </div>
    </div>
  );
}
