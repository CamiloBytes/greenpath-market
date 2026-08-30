"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { LoginForm } from "@/src/components/form/LoginForm";
import { RegisterForm } from "@/src/components/form/RegisterForm";
import { BrandPanel } from "@/src/components/feature/BrandPanel";

const FORM_TRANSITION: Transition = {
  duration: 0.8,
  ease: [0.25, 0.1, 0.25, 1],
};

const IMAGE_TRANSITION: Transition = {
  duration: 1,
  ease: [0.25, 0.1, 0.25, 1],
};

const LOGIN_IMG =
  "/fondologin.jpg";

const REGISTER_IMG =
  "/fondoregister.jpg";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const handleToggle = () => setIsLogin((prev) => !prev);

  return (
    <main className="relative min-h-dvh w-full bg-[#07110C] text-white lg:block lg:h-dvh lg:overflow-hidden">
      <motion.div
        animate={isDesktop ? { x: isLogin ? "0%" : "100%" } : { x: 0 }}
        transition={FORM_TRANSITION}
        className="relative z-20 flex min-h-dvh w-full flex-col bg-[#07110C] lg:absolute lg:top-0 lg:left-0 lg:h-full lg:w-1/2"
      >
        <div className="custom-scrollbar flex flex-1 overflow-y-auto lg:absolute lg:inset-0">
          <div className="m-auto flex w-full flex-col items-center justify-center px-6 py-12">
            {isLogin ? <LoginForm /> : <RegisterForm />}

            <button
              onClick={handleToggle}
              className="mt-6 text-sm text-white/60 transition-colors hover:text-white lg:hidden"
            >
              {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
              <span className="font-bold text-[#1DD317]">
                {isLogin ? "Crear cuenta" : "Inicia sesión"}
              </span>
            </button>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className={`
            group absolute top-0 z-10 hidden
            font-semibold text-base text-white cursor-pointer
            px-10 py-3.5 outline-none border-none overflow-hidden
            bg-gradient-to-r from-[#284827] to-[#1DD317]
            bg-[length:200%_auto] bg-left hover:bg-right
            transition-all duration-700 ease-in-out
            hover:shadow-[0_8px_20px_rgba(23,173,18,0.26)]
            lg:block
            ${isLogin ? "right-[-95px] -translate-x-1/2 rounded-bl-[30px]" : "left-0 rounded-br-[30px]"}
          `}
        >
          <span className="relative z-10">
            {isLogin ? "Crear cuenta" : "Ya tengo cuenta"}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-br from-white/50 to-white/0 skew-x-[-25deg] transition-all duration-500 ease-in-out group-hover:left-[130%]"
          />
        </button>
      </motion.div>

      <motion.div
        animate={isDesktop ? { x: isLogin ? "100%" : "0%" } : { x: 0 }}
        transition={IMAGE_TRANSITION}
        className="absolute top-0 left-0 hidden h-full w-1/2 lg:block"
      >
        <BrandPanel image={isLogin ? LOGIN_IMG : REGISTER_IMG} />
      </motion.div>
    </main>
  );
};

export default AuthPage;
