"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({ variant = "primary", size = "md", fullWidth = false, children, className = "", ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#1C3668] text-white hover:bg-[#152A52] focus:ring-[#1C3668]/40 shadow-sm",
    secondary: "bg-white text-[#1C3668] border border-[#1C3668]/30 hover:bg-[#F4F6F9] focus:ring-[#1C3668]/20",
    ghost: "text-[#1C3668] hover:bg-[#F4F6F9] focus:ring-[#1C3668]/20",
    danger: "bg-[#E31837] text-white hover:bg-[#B8122A] focus:ring-[#E31837]/40 shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-[15px]",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`} {...rest}>
      {children}
    </button>
  );
}
