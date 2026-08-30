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

const MOOD_COLORS: Record<MascotMood, string> = {
  proud: "from-violet-500 to-fuchsia-500",
  encouraging: "from-sky-400 to-emerald-400",
  worried: "from-amber-400 to-orange-500",
  surprised: "from-pink-400 to-violet-500",
  neutral: "from-indigo-400 to-purple-500",
};

const EYES: Record<MascotMood, string> = {
  proud: "^^",
  encouraging: "•‿•",
  worried: "•︵•",
  surprised: "◎▫◎",
  neutral: "• •",
};

export function Mascot({
  mood = "encouraging",
  message,
  context = "welcome",
  size = "md",
  className,
}: MascotProps) {
  const text = message ?? getMascotLine(context);
  const sizes = {
    sm: "size-14 text-lg",
    md: "size-20 text-2xl",
    lg: "size-28 text-3xl",
  };

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg",
          MOOD_COLORS[mood],
          sizes[size],
        )}
        aria-hidden
      >
        <span className="font-bold">{EYES[mood]}</span>
      </motion.div>
      <div className="relative max-w-[75%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm shadow-md ring-1 ring-violet-100">
        <p className="leading-relaxed text-foreground">{text}</p>
      </div>
    </div>
  );
}
