"use client";

import { Eraser } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function NumberPad() {
  const selectedCell = useGameStore((s) => s.selectedCell);
  const setCellValue = useGameStore((s) => s.setCellValue);
  const clearCell = useGameStore((s) => s.clearCell);
  const setLastRecognition = useGameStore((s) => s.setLastRecognition);

  const notesMode = useGameStore((s) => s.notesMode);
  const toggleNote = useGameStore((s) => s.toggleNote);

  const handleDigit = (digit: (typeof DIGITS)[number]) => {
    if (!selectedCell) return;

    if (notesMode) {
      toggleNote(selectedCell.row, selectedCell.col, digit);
      return;
    }

    const isValid = setCellValue(selectedCell.row, selectedCell.col, digit);
    setLastRecognition(digit, isValid ? 100 : 100);
  };

  const handleClear = () => {
    if (!selectedCell) return;
    clearCell(selectedCell.row, selectedCell.col);
    setLastRecognition(null, 0);
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">Mode clavier</p>
        <p className="text-xs text-muted-foreground">
          {selectedCell
            ? "Tape un chiffre pour remplir la case sélectionnée"
            : "Sélectionne d'abord une case vide"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {DIGITS.map((digit) => (
          <motion.button
            key={digit}
            type="button"
            disabled={!selectedCell}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleDigit(digit)}
            className={cn(
              "flex h-14 items-center justify-center rounded-2xl text-2xl font-bold",
              "bg-muted active:bg-primary active:text-primary-foreground",
              "disabled:opacity-40 disabled:active:bg-muted disabled:active:text-foreground",
            )}
          >
            {digit}
          </motion.button>
        ))}
      </div>

      <button
        type="button"
        disabled={!selectedCell}
        onClick={handleClear}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-muted text-sm font-medium disabled:opacity-40 active:scale-[0.98]"
      >
        <Eraser className="size-4" />
        Effacer la case
      </button>
    </div>
  );
}
