
import BannerCarousel from "@/src/components/feature/carousel/BanerCarouse";
import { CategorySection } from "@/src/components/feature/CategorySection/CategorySection";



export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 pt-9 pb-10">
      <div className="mx-auto max-w-7xl">
        <BannerCarousel />

        <CategorySection />
      </div>
    </main>
  );
}