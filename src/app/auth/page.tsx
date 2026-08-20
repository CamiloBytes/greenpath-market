"use client";

import { useState } from "react";
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
  "https://res.cloudinary.com/dd7vy0y6n/image/upload/f_auto,q_auto/v1755644602/back-login_vtle9y.jpg";

const REGISTER_IMG =
  "https://res.cloudinary.com/dd7vy0y6n/image/upload/f_auto,q_auto/v1755644601/back-register_uiimdr.jpg";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => setIsLogin((prev) => !prev);

  return (
    <main className="relative w-screen h-screen bg-[#07110C] overflow-hidden">
      <motion.div
        animate={{ x: isLogin ? "0%" : "100%" }}
        transition={FORM_TRANSITION}
        className="absolute top-0 left-0 w-1/2 h-full z-20 bg-[#07110C] text-white"
      >
        <div className="absolute inset-0 flex overflow-y-auto custom-scrollbar">
          <div className="m-auto flex items-center justify-center w-full px-6 py-12">
            {isLogin ? <LoginForm /> : <RegisterForm onSuccess={handleToggle} />}
          </div>
        </div>

        <button
          onClick={handleToggle}
          className={`
            group absolute top-0 z-10 -translate-x-1/2
            font-semibold text-base text-white cursor-pointer
            px-10 py-3.5 outline-none border-none overflow-hidden
            bg-gradient-to-r from-[#284827] to-[#1DD317]
            bg-[length:200%_auto] bg-left hover:bg-right
            transition-all duration-700 ease-in-out
            hover:shadow-[0_8px_20px_rgba(23,173,18,0.26)]
            ${isLogin ? "right-[-95px] rounded-bl-[30px]" : "left-[85px] rounded-br-[30px]"}
          `}
        >
          <span className="relative z-10">
            {isLogin ? "Go to Register" : "Go to Login"}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-br from-white/50 to-white/0 skew-x-[-25deg] transition-all duration-500 ease-in-out group-hover:left-[130%]"
          />
        </button>
      </motion.div>

      <motion.div
        animate={{ x: isLogin ? "100%" : "0%" }}
        transition={IMAGE_TRANSITION}
        className="absolute top-0 left-0 w-1/2 h-full z-10"
      >
        <BrandPanel image={isLogin ? LOGIN_IMG : REGISTER_IMG} />
      </motion.div>
    </main>
  );
};

export default AuthPage;