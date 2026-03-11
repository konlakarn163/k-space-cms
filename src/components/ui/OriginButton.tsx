"use client";

import { motion } from "framer-motion";
import { ReactNode, useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface OriginButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  baseColor?: string;
  darkColor?: string;
  hoverColor?: string;
  darkHoverColor?: string;
  iconColor?: string; 
  iconHoverColor?: string; 
}

export default function OriginButton({
  children,
  onClick,
  className = "",
  baseColor = "#0f172a",
  darkColor,
  hoverColor = "#ffffff",
  darkHoverColor = "#ffffff",
  iconColor,
  iconHoverColor,
}: OriginButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentIconColor = isHovered 
    ? (iconHoverColor || "currentColor") 
    : (iconColor || "currentColor");

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer relative px-8 py-4 group overflow-hidden rounded-full font-bold transition-all isolation-isolate ${className}`}
      style={{
        backgroundColor: baseColor,
      }}
    >
      {/* --- Hover Effect: ขยายจากจุดศูนย์กลาง (Fixed Center) --- */}
      <motion.div
        className="absolute pointer-events-none rounded-full aspect-square"
        style={{
          width: "300%",
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          backgroundColor: hoverColor,
          zIndex: 0,
        }}
        variants={{
          rest: { scale: 0, opacity: 0 },
          hover: {
            scale: 1,
            opacity: 1,
            transition: { duration: 1, ease: [0.5, 1, 0.5, 2] },
          },
        }}
      />

      <div className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">
        <span
          className={`transition-colors duration-300 ${
            isHovered
              ? "text-slate-900 dark:text-black"
              : "text-white dark:text-slate-300"
          }`}
        >
          {children}
        </span>

        <motion.span
          variants={{
            rest: { x: -5, opacity: 0, scale: 0.8 },
            hover: { x: 0, opacity: 1, scale: 1 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          style={{ color: currentIconColor }}
          className={!iconColor && !iconHoverColor ? (isHovered ? "text-slate-900" : "text-white") : ""}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.span>
      </div>
    </motion.button>
  );
}