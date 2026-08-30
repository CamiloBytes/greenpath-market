"use client";

import { motion } from "framer-motion";

const CREATORS = [
  { name: "Juan Cardona", role: "Frontend Developer" },
  { name: "Forlán Ordoñez", role: "Frontend Designer" },
  { name: "Daniel Rojas", role: "Backend Developer" },
  { name: "Camilo Parra", role: "Backend Developer" },
  { name: "Wilson Castillo", role: "DataBase" },
];

export const AboutSection = () => {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex min-h-dvh flex-col items-center justify-center px-4 py-24 text-center text-white sm:px-8"
    >
      <h2 className="mb-4 text-[1.8rem] font-bold sm:text-[3rem]">About Us</h2>
      <p className="mx-auto mb-12 max-w-[1600px] text-[1rem] font-medium leading-[1.8] text-[#ddd] sm:text-[1.9rem]">
        At GreenPath Market, we believe in a fairer and more sustainable path
        for agriculture. We are a digital platform that connects farmers and
        rural producers directly with consumers and businesses, eliminating
        middlemen and ensuring fair prices for those who work the land.
        <br />
        Our mission is to encourage responsible consumption and promote fresh,
        natural, and sustainable products, while supporting rural communities
        and strengthening the local economy.
      </p>

      <div className="mt-2 grid w-full max-w-5xl grid-cols-2 justify-items-center gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
        {CREATORS.map((creator, index) => (
          <motion.div
            key={creator.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="group relative flex h-auto min-h-[80px] w-[130px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-white/10 p-4 backdrop-blur-[10px] transition-shadow duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] sm:h-[10vh] sm:w-[20vh]"
          >
            <h3 className="mb-[-0.1rem] text-center text-sm font-bold text-white sm:text-[1.2rem]">
              {creator.name}
            </h3>
            <p className="mb-0 block px-4 pt-1 text-center text-xs font-black text-[#19af14] opacity-0 translate-y-[10px] transition-all duration-[0.4s] group-hover:opacity-100 group-hover:translate-y-0 sm:text-[1rem]">
              {creator.role}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};