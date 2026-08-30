import React from 'react'

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button = ({ onClick, children, className = '', type = 'button', disabled = false }: ButtonProps) => {
  const base = `py-3 px-10 rounded-[30px] outline-none border-0 text-white font-semibold cursor-pointer bg-gradient-to-r from-[#284827] to-[#1DD317] bg-[length:200%_auto] bg-left hover:bg-right transition-all duration-700 ease-in-out motion-reduce:transition-none hover:shadow-[0_8px_20px_rgba(23,173,18,0.26)] focus-visible:ring-2 focus-visible:ring-[#1DD317] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07110C] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-left disabled:hover:shadow-none`

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${className}`}>
      {children}
    </button>
  )
}
