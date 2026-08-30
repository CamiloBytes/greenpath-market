"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";
import { useToastStore } from "@/src/stores/toastStore";

const inputClass =
  "w-[94%] rounded-[12px] border-none bg-white/10 p-4 text-[1rem] text-white outline-none transition-all duration-300 placeholder:text-[#aaa] focus:bg-white/15 focus:shadow-[0_0_0_2px_#1DD317]";

export const ContactSection = () => {
  const { showToast } = useToastStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast("Por favor completa todos los campos", "error");
      return;
    }
    showToast("¡Mensaje enviado con éxito!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <motion.section
      id="contac"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex min-h-dvh items-center justify-center px-4 py-20"
    >
      <div className="w-full max-w-[500px] overflow-hidden rounded-[1.5rem] bg-black/35 p-4 text-center text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-[12px]">
        <h2 className="mb-4 text-[1.4rem] font-bold sm:text-[2rem]">
          Contact Us
        </h2>
        <p className="mx-auto mb-8 text-[0.9rem] text-[#ccc] sm:text-[1rem]">
          &quot;Have questions or want to support us? Write to us here:&quot;
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <textarea
            placeholder="Type your message..."
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputClass} min-h-[150px] resize-none`}
          />
          <button
            type="submit"
            className="rounded-[30px] border-none bg-gradient-to-r from-[#284827] to-[#1DD317] px-8 py-4 text-[1rem] font-semibold text-white transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(23,173,18,0.25)] sm:text-[1.1rem]"
          >
            Send
          </button>
        </form>

        <div className="mt-8 overflow-hidden">
          <h4 className="mb-4 text-[1rem] font-medium text-[#ddd] sm:text-[1.1rem]">
            Follow Us:
          </h4>
          <div className="flex items-center justify-center gap-3 text-[1.4rem] text-[#1aa816] sm:text-[1.9rem]">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center p-2 transition-all duration-300 hover:-translate-y-[3px] hover:text-[#1DD317]"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-11 w-11 items-center justify-center p-2 transition-all duration-300 hover:-translate-y-[3px] hover:text-[#1DD317]"
            >
              <FaWhatsapp />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="flex h-11 w-11 items-center justify-center p-2 transition-all duration-300 hover:-translate-y-[3px] hover:text-[#1DD317]"
            >
              <FaTelegramPlane />
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
};