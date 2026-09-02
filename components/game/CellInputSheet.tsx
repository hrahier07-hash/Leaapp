"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { InputPanel } from "@/components/game/InputPanel";
import { useGameStore } from "@/store/useGameStore";

export function CellInputSheet() {
  const selectedCell = useGameStore((s) => s.selectedCell);
  const clearSelection = useGameStore((s) => s.clearSelection);
  const row = selectedCell?.row ?? 0;
  const col = selectedCell?.col ?? 0;

  return (
    <AnimatePresence>
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/5"
            aria-label="Fermer"
            onClick={clearSelection}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
            className="relative z-10 w-full max-w-[min(100%,22rem)] rounded-2xl border-2 border-primary bg-background/20 px-4 py-3 shadow-lg backdrop-blur-[2px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground/90">
                Case {row + 1}, {col + 1}
              </p>
              <button
                type="button"
                onClick={clearSelection}
                className="flex size-8 items-center justify-center rounded-full bg-background/30 active:scale-95"
                aria-label="Fermer"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <InputPanel variant="sheet" onDone={clearSelection} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
