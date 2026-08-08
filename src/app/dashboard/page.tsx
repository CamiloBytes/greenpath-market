import BannerCarousel from "@/src/components/carousel/BanerCarouse";


export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 pt-24 pb-10">
      <div className="mx-auto max-w-7xl">
        <BannerCarousel />

        <section className="mt-8">
          <h1 className="text-3xl font-bold text-white">
            Bienvenido al Dashboard
          </h1>

          <p className="mt-2 text-white/80">
            Aquí encontrarás toda la información de tu aplicación.
          </p>
        </section>
      </div>
    </main>
  );
}