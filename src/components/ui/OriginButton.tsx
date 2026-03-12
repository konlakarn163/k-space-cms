"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { ArrowRight } from "lucide-react";

interface OriginButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  bgColor?: string;
  baseColor?: string;
  darkColor?: string;
  hoverColor?: string;
  darkHoverColor?: string;
  iconColor?: string; 
  iconHoverColor?: string; 
  darkIconColor?: string;
  darkIconHoverColor?: string;
}

export default function OriginButton({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  bgColor,
  baseColor = "#0f172a",
  darkColor,
  hoverColor = "#ffffff",
  darkHoverColor = "#ffffff",
  iconColor,
  iconHoverColor,
  darkIconColor,
  darkIconHoverColor,
}: OriginButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const resolvedBaseColor = bgColor ?? baseColor;

  const currentIconColor = isHovered 
    ? (iconHoverColor || darkIconHoverColor || "currentColor")
    : (iconColor || darkIconColor || "currentColor");

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`cursor-pointer relative px-8 py-4 group overflow-hidden rounded-full font-bold transition-all isolation-isolate disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      data-dark-color={darkColor}
      data-dark-hover-color={darkHoverColor}
      style={{
        backgroundColor: resolvedBaseColor,
      }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          backgroundColor: hoverColor,
          zIndex: 0,
        }}
        variants={{
          rest: { scale: 0.96, opacity: 0 },
          hover: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.24, ease: [0.2, 0.8, 0.2, 1] },
          },
        }}
      />

      <div className="relative z-10 flex items-center justify-center pointer-events-none">
        <motion.span
          variants={{
            rest: { x: 0 },
            hover: { x: -8 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          className={`transition-colors duration-300 ${
            isHovered
              ? "text-slate-900 dark:text-black"
              : "text-white dark:text-slate-300"
          }`}
        >
          {children}
        </motion.span>

        <motion.span
          variants={{
            rest: { width: 0, x: -4, opacity: 0, scale: 0.8 },
            hover: { width: 20, x: 0, opacity: 1, scale: 1 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          style={{ color: currentIconColor }}
          className={`ml-2 inline-flex items-center justify-center overflow-hidden shrink-0 ${
            !iconColor && !iconHoverColor
              ? isHovered
                ? "text-slate-900"
                : "text-white"
              : ""
          }`}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.span>
      </div>
    </motion.button>
  );
}