"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaInstagram,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";
import { useToastStore } from "@/src/stores/toastStore";
import {
  contactSchema,
  type ContactFormData,
} from "@/src/validation/contact/ContactValidation";

const inputClass =
  "w-[94%] rounded-[12px] border-none bg-white/10 p-4 text-[1rem] text-white outline-none transition-all duration-300 placeholder:text-[#aaa] focus:bg-white/15 focus:shadow-[0_0_0_2px_#1DD317]";
const errorClass = "mt-1 text-xs text-red-400 w-[94%] ml-auto";

export const ContactSection = () => {
  const { showToast } = useToastStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (_data: ContactFormData) => {
    showToast("¡Mensaje enviado con éxito!");
    reset();
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <input
              type="text"
              placeholder="Your name"
              {...register("name")}
              className={inputClass}
            />
            {errors.name && (
              <p className={errorClass}>{errors.name.message}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              {...register("email")}
              className={inputClass}
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>
          <div>
            <textarea
              placeholder="Type your message..."
              {...register("message")}
              className={`${inputClass} min-h-[150px] resize-none`}
            />
            {errors.message && (
              <p className={errorClass}>{errors.message.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-[30px] border-none bg-gradient-to-r from-[#284827] to-[#1DD317] px-8 py-4 text-[1rem] font-semibold text-white transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(23,173,18,0.25)] disabled:cursor-not-allowed disabled:opacity-60 sm:text-[1.1rem]"
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
