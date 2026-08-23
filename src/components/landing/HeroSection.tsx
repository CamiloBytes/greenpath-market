"use client";

import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex min-h-screen flex-col justify-center p-0"
    >
      <div className="relative z-10 max-w-[900px] pr-0 pl-10 mt-[-8rem] sm:pr-[15vw] sm:pl-20 sm:mt-[-13rem]">
        <div className="text-description">
          <h4 className="mb-[-1.3rem] mr-0 text-left text-[1.3rem] font-semibold leading-[1.2] tracking-[1px] sm:mr-[-8vw] sm:text-[3.8rem]">
            <span className="hidden text-[4rem] text-[#17AD12] sm:inline">&quot;</span>
            Join today and support local farmers. Fresh products, fair trade,
            and a direct connection.
          </h4>
        </div>

        <div className="text-eslogan">
          <h3 className="mt-4 mb-[-1.5rem] text-left text-[1.6rem] font-semibold leading-[1.1] tracking-[1.2px] sm:text-[4.3rem] bg-gradient-to-r from-[#17AD12] via-[#1DD317] to-[#38ad54] bg-clip-text text-transparent animate-color-flow">
            From the field to your table<span className="text-[4rem]">„</span>
          </h3>
        </div>

        <div className="relative z-10 mt-8 pl-10 pr-4">
          <a
            href="/auth"
            className="relative inline-block overflow-hidden rounded-[30px] border-none px-10 py-4 text-[1rem] font-semibold tracking-[4px] text-white no-underline bg-gradient-to-r from-[#284827] to-[#1DD317] bg-[length:200%_auto] bg-left hover:bg-right transition-all duration-[0.8s] ease-in-out hover:scale-[1.07] hover:shadow-[0_8px_20px_rgba(23,173,18,0.26)] sm:px-10 sm:text-[1.4rem]"
          >
            START NOW
          </a>
        </div>
      </div>
    </motion.section>
  );
};