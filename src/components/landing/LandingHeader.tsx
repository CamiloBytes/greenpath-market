"use client";

import Image from "next/image";
import Link from "next/link";

const LOGO_URL =
  "https://res.cloudinary.com/dd7vy0y6n/image/upload/v1755732479/1000251390_brue4v.png";

export const LandingHeader = () => {
  return (
    <header className="relative z-10 flex items-center justify-between px-5 py-4 h-[10vh] sm:px-20">
      <div className="flex items-center justify-center">
        <Image src={LOGO_URL} alt="GreenPath" width={190} height={40} className="w-[180px] h-auto sm:w-[250px]" />
      </div>

      <nav className="hidden sm:block">
        <ul className="flex list-none gap-7">
          <li>
            <a
              href="#about"
              className="cursor-pointer rounded-[30px] border-none px-10 py-3.5 font-bold tracking-[4px] text-white outline-none no-underline bg-gradient-to-r from-[#284827] to-[#1DD317] bg-[length:200%_auto] bg-left hover:bg-right transition-[background-position] duration-[0.8s] ease-in-out"
            >
              ABOUT US
            </a>
          </li>
          <li>
            <a
              href="#contac"
              className="cursor-pointer rounded-[30px] border-none px-10 py-3.5 font-bold tracking-[4px] text-white outline-none no-underline bg-gradient-to-r from-[#284827] to-[#1DD317] bg-[length:200%_auto] bg-left hover:bg-right transition-[background-position] duration-[0.8s] ease-in-out"
            >
              CONTACT US
            </a>
          </li>
        </ul>
      </nav>

      <Link
        href="/auth"
        className="sm:hidden cursor-pointer rounded-[30px] border-none px-6 py-2.5 text-sm font-bold tracking-[2px] text-white outline-none no-underline bg-gradient-to-r from-[#284827] to-[#1DD317] bg-[length:200%_auto] bg-left hover:bg-right transition-[background-position] duration-[0.8s] ease-in-out"
      >
        START
      </Link>
    </header>
  );
};