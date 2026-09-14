"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { GiMonsteraLeaf } from "react-icons/gi";
import { useCallback, useEffect, useRef, useState } from "react";
import { banners } from "@/src/data/banners";

const SLIDE_DURATION = 6000;

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef<number | null>(null);
  const touchDelta = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, []);

  const previousSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    touchDelta.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    touchDelta.current = e.touches[0].clientX - touchStart.current;
  };

  const handleTouchEnd = () => {
    if (touchStart.current === null) return;
    const threshold = 50;
    if (touchDelta.current > threshold) {
      previousSlide();
    } else if (touchDelta.current < -threshold) {
      nextSlide();
    }
    touchStart.current = null;
    touchDelta.current = 0;
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-[#07110C] shadow-2xl shadow-black/40"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-64 w-full sm:h-72 md:h-[28rem]">
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

            <div className="relative z-10 flex h-full items-center px-4 sm:px-8 md:px-16">
              <div className="grid w-full grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8">
                <div className="text-white">
                  <motion.span
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1DD317]/40 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#3BF533] backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"
                  >
                    <GiMonsteraLeaf className="text-xs sm:text-sm" />
                    {banners[current].badge}
                  </motion.span>

                  <motion.h2
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.55, ease: "easeOut" }}
                    className="mt-3 text-2xl font-extrabold leading-tight sm:mt-4 sm:text-3xl md:text-5xl"
                  >
                    {banners[current].title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.55, ease: "easeOut" }}
                    className="mt-2 max-w-md text-xs text-white/70 sm:mt-3 sm:text-sm md:text-base"
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
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1DD317] px-5 py-2.5 text-xs font-bold text-[#07110C] shadow-lg shadow-[#1DD317]/30 transition-colors hover:bg-[#3BF533] sm:mt-7 sm:px-6 sm:py-3 sm:text-sm"
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
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white backdrop-blur-md transition-colors hover:bg-[#1DD317] hover:text-[#07110C] md:flex md:h-11 md:w-11"
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
        className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white backdrop-blur-md transition-colors hover:bg-[#1DD317] hover:text-[#07110C] md:flex md:h-11 md:w-11"
      >
        →
      </motion.button>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-4">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`Ir a la diapositiva ${index + 1}`}
            onClick={() => setCurrent(index)}
            className="relative h-2 overflow-hidden rounded-full transition-all duration-300"
            style={{ width: index === current ? 28 : 8 }}
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
