
import { FooterSection } from "@/src/components/feature/Footer";
import { Navbar } from "@/src/components/feature/Navbar";
import { RequireAuth } from "@/src/components/auth";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
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
          <FooterSection />
        </div>
      </div>
    </RequireAuth>
  );
}
