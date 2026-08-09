

import BannerCarousel from "@/src/components/feature/BannerCarousel";
import { CategorySection } from "@/src/components/feature/CategorySection";
import { ProductSection } from "@/src/components/feature/ProductSection";



export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 pt-9 pb-10">
      <div className="mx-auto max-w-7xl">
        <BannerCarousel />

        <CategorySection />

        <ProductSection />
      </div>
    </main>
  );
}