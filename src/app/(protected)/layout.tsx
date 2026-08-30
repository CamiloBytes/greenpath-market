
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
      <div className="relative min-h-dvh w-full overflow-x-clip bg-[#07110C]">
        {/* Fondo */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#07110C]">
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
        <div className="relative z-10 flex min-h-dvh flex-col">
          <Navbar />
          <main className="flex-1 pt-20">{children}</main>
          <FooterSection />
        </div>
      </div>
    </RequireAuth>
  );
}
