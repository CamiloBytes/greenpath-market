"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { GiMonsteraLeaf } from "react-icons/gi";
import { useEffect, useState } from "react";
import { banners } from "@/src/data/banners";

const SLIDE_DURATION = 6000;

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const previousSlide = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#07110C] shadow-2xl shadow-black/40">
      <div className="relative h-72 w-full md:h-[28rem]">
        <AnimatePresence initial={false}>
          <motion.div
            key={banners[current].id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 will-change-transform"
          >
            <div className={`absolute inset-0 ${banners[current].bg}`} />

            {banners[current].orbs.map((orb, index) => (
              <motion.div
                key={index}
                className={`pointer-events-none absolute rounded-full blur-3xl ${orb.color} ${orb.className}`}
                animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.1, 1] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}

            {banners[current].floats.map(({ Icon, className, delay }, index) => (
              <motion.div
                key={index}
                className={`pointer-events-none absolute text-white/15 ${className}`}
                animate={{ y: [0, -14, 0], rotate: [0, 10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay,
                }}
              >
                <Icon />
              </motion.div>
            ))}

            <div className="relative z-10 flex h-full items-center px-8 md:px-16">
              <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2">
                <div className="text-white">
                  <motion.span
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#1DD317]/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#3BF533] backdrop-blur-sm"
                  >
                    <GiMonsteraLeaf className="text-sm" />
                    {banners[current].badge}
                  </motion.span>

                  <motion.h2
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.55, ease: "easeOut" }}
                    className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl"
                  >
                    {banners[current].title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.55, ease: "easeOut" }}
                    className="mt-3 max-w-md text-sm text-white/70 md:text-base"
                  >
                    {banners[current].description}
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                    type="button"
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1DD317] px-6 py-3 text-sm font-bold text-[#07110C] shadow-lg shadow-[#1DD317]/30 transition-colors hover:bg-[#3BF533]"
                  >
                    {banners[current].cta}
                    <span aria-hidden>→</span>
                  </motion.button>
                </div>

                {banners[current].image ? (
                  <div className="relative hidden h-56 w-full overflow-hidden rounded-2xl md:block md:h-72">
                    <Image
                      src={banners[current].image}
                      alt={banners[current].title}
                      fill
                      priority={current === 0}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      unoptimized={banners[current].image.startsWith("http")}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="hidden h-56 w-full items-center justify-center rounded-2xl border-2 border-dashed border-white/20 md:flex md:h-72">
                    <span className="text-sm font-semibold uppercase tracking-widest text-white/30">
                      Imagen
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        type="button"
        aria-label="Anterior"
        onClick={previousSlide}
        whileHover={{ scale: 1.1, x: -3 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-lg text-white backdrop-blur-md transition-colors hover:bg-[#1DD317] hover:text-[#07110C]"
      >
        ←
      </motion.button>

      <motion.button
        type="button"
        aria-label="Siguiente"
        onClick={nextSlide}
        whileHover={{ scale: 1.1, x: 3 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-lg text-white backdrop-blur-md transition-colors hover:bg-[#1DD317] hover:text-[#07110C]"
      >
        →
      </motion.button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`Ir a la diapositiva ${index + 1}`}
            onClick={() => setCurrent(index)}
            className="relative h-2.5 overflow-hidden rounded-full"
            style={{ width: index === current ? 32 : 10 }}
          >
            <span className="absolute inset-0 rounded-full bg-white/40 transition-colors" />
            {index === current && (
              <motion.span
                key={`progress-${current}`}
                className="absolute inset-y-0 left-0 rounded-full bg-[#1DD317]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: SLIDE_DURATION / 1000,
                  ease: "linear",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
