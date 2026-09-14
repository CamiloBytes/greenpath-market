import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Poppins, Bricolage_Grotesque } from "next/font/google";
import { HydrationListener } from "@/src/components/ui/HydrationListener";
import { ToastContainer } from "@/src/components/ui/ToastContainer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GreenPath Market",
  description:
    "GreenPath Market is an innovative solution aimed at rural-area merchants. Its main goal is to strengthen the local economy by providing a digital space where producers can sell their goods directly, without intermediaries.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${poppins.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <HydrationListener />
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
