import React from 'react'

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ onClick, children, className = '' }: ButtonProps) => {
  const base = `mt-10 py-3 px-10 rounded-[30px] outline-none border-0 text-white font-semibold cursor-pointer bg-gradient-to-r from-[#284827] to-[#1DD317] bg-[length:200%_auto] bg-left hover:bg-right transition-all duration-800 ease-in-out`

  return (
    <button onClick={onClick} className={`${base} ${className}`}>
      {children}
    </button>
  )
}
    