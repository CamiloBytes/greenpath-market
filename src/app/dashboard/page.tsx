

import BannerCarousel from "@/src/components/feature/BanerCarouse";
import { CategorySection } from "@/src/components/feature/CategorySection/CategorySection";
import { FooterSection } from "@/src/components/feature/Footer/FooterSection";
import { ProductSection } from "@/src/components/feature/ProductSection/ProductSection";



export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 pt-9 pb-10">
      <div className="mx-auto max-w-7xl">
        <BannerCarousel />

        <CategorySection />

        <ProductSection />
        <FooterSection />
      </div>
    </main>
  );
}