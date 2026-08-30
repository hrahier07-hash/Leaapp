"use client";

import { motion } from "framer-motion";

import { getMascotLine, type MascotMood } from "@/lib/mascot/lines";
import { cn } from "@/lib/utils";

type MascotProps = {
  mood?: MascotMood;
  message?: string;
  context?: "welcome" | "empty";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Mascot({
  mood: _mood = "encouraging",
  message,
  context = "welcome",
  size = "md",
  className,
}: MascotProps) {
  const text = message ?? getMascotLine(context);
  const sizes = {
    sm: "size-12 text-base",
    md: "size-16 text-xl",
    lg: "size-20 text-2xl",
  };

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm",
          sizes[size],
        )}
        aria-hidden
      >
        <span>◕‿◕</span>
      </motion.div>
      <div className="surface-card max-w-[80%] px-3 py-2.5 text-sm leading-relaxed">
        {text}
      </div>
    </div>
  );
}
