"use client";

import { motion } from "framer-motion";
import { useLandingBackground } from "@/src/hooks/landing/useLandingBackground";

export const LandingBackground = () => {
  const { BG_URL, backgroundColor, backdropFilter } = useLandingBackground();

  return (
    <>
      <div
        className="fixed inset-0 -z-20 h-full w-full bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${BG_URL})` }}
      />
      <motion.div
        className="fixed inset-0 -z-10 h-full w-full"
        style={{
          backgroundColor,
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
        }}
      />
    </>
  );
};