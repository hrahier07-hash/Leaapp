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
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/10"
            aria-label="Fermer"
            onClick={clearSelection}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-1/2 z-50 flex max-h-[38vh] w-full max-w-[430px] -translate-x-1/2 flex-col rounded-t-2xl border-t border-border/40 bg-background/55 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-lg backdrop-blur-md"
          >
            <div className="mb-2 flex shrink-0 items-center justify-between">
              <p className="text-xs font-medium text-foreground/80">
                Case ligne {row + 1}, colonne {col + 1}
              </p>
              <button
                type="button"
                onClick={clearSelection}
                className="flex size-8 items-center justify-center rounded-full bg-background/60 active:scale-95"
                aria-label="Fermer"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="min-h-0 overflow-y-auto">
              <InputPanel variant="sheet" onDone={clearSelection} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
