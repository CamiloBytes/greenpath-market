"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import BannerCarousel from "@/src/components/feature/BannerCarousel";
import { CategorySection } from "@/src/components/feature/CategorySection";
import { ProductSection } from "@/src/components/feature/ProductSection";

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const router = useRouter();
  const { q } = use(searchParams);
  const [category, setCategory] = useState(0);

  return (
    <main className="min-h-dvh px-4 pt-9 pb-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {q ? (
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">
                Mostrando resultados para: <strong>{q}</strong>
              </span>
              <button
                onClick={() => router.push("/dashboard")}
                className="min-h-11 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                Limpiar búsqueda
              </button>
            </div>
            <ProductSection searchQuery={q} />
          </div>
        ) : (
          <>
            <div className="-mx-4 rounded-2xl bg-[#07110C] sm:mx-0 sm:bg-transparent">
              <BannerCarousel />
            </div>
            <CategorySection
              activeCategory={category}
              onSelectCategory={setCategory}
            />
            <ProductSection category={category} />
          </>
        )}
      </div>
    </main>
  );
}