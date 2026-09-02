"use client";

import { useState } from "react";
import { Keyboard, Pencil } from "lucide-react";
import { motion } from "framer-motion";

import { DrawPad } from "@/components/game/DrawPad";
import { NumberPad } from "@/components/game/NumberPad";
import { cn } from "@/lib/utils";

type InputMode = "draw" | "keyboard";

type InputPanelProps = {
  variant?: "inline" | "sheet";
  onDone?: () => void;
};

export function InputPanel({ variant = "inline", onDone }: InputPanelProps) {
  const [mode, setMode] = useState<InputMode>("draw");
  const isSheet = variant === "sheet";

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "grid grid-cols-2 gap-2 rounded-2xl p-1",
          isSheet ? "bg-background/20" : "bg-muted/60",
        )}
      >
        <button
          type="button"
          onClick={() => setMode("draw")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors active:scale-[0.98]",
            mode === "draw"
              ? isSheet
                ? "bg-background/20 text-foreground shadow-sm"
                : "bg-background text-foreground shadow-sm"
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
              ? isSheet
                ? "bg-background/20 text-foreground shadow-sm"
                : "bg-background text-foreground shadow-sm"
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
        {mode === "draw" ? (
          <DrawPad variant={isSheet ? "sheet" : "inline"} onDone={onDone} />
        ) : (
          <NumberPad variant={isSheet ? "sheet" : "inline"} onDone={onDone} />
        )}
      </motion.div>
    </div>
  );
}
