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
            className="fixed inset-0 z-40 bg-black/30"
            aria-label="Fermer"
            onClick={clearSelection}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-2xl bg-card px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-lg ring-1 ring-border"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">
                Case {row + 1}, {col + 1}
              </p>
              <button
                type="button"
                onClick={clearSelection}
                className="flex size-9 items-center justify-center rounded-full bg-muted active:scale-95"
                aria-label="Fermer"
              >
                <X className="size-4" />
              </button>
            </div>
            <InputPanel variant="sheet" onDone={clearSelection} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
