"use client";

import { useState } from "react";
import { Keyboard, Pencil } from "lucide-react";
import { motion } from "framer-motion";

import { DrawPad } from "@/components/game/DrawPad";
import { NumberPad } from "@/components/game/NumberPad";
import { cn } from "@/lib/utils";

type InputMode = "draw" | "keyboard";

export function InputPanel() {
  const [mode, setMode] = useState<InputMode>("draw");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted/60 p-1">
        <button
          type="button"
          onClick={() => setMode("draw")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors active:scale-[0.98]",
            mode === "draw"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground",
          )}
        >
          <Pencil className="size-4" />
          Dessin
        </button>
        <button
          type="button"
          onClick={() => setMode("keyboard")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors active:scale-[0.98]",
            mode === "keyboard"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground",
          )}
        >
          <Keyboard className="size-4" />
          Clavier
        </button>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {mode === "draw" ? <DrawPad /> : <NumberPad />}
      </motion.div>
    </div>
  );
}
