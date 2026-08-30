"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper } from "lucide-react";

import { InputPanel } from "@/components/game/InputPanel";
import { SudokuBoard } from "@/components/game/SudokuBoard";
import { MobileShell } from "@/components/layout/MobileShell";
import { useGameStore } from "@/store/useGameStore";

export function GameScreen() {
  const mistakes = useGameStore((s) => s.mistakes);
  const isComplete = useGameStore((s) => s.isComplete);
  const selectedCell = useGameStore((s) => s.selectedCell);

  return (
    <MobileShell title="Grille en cours">
      <div className="flex flex-col gap-5 py-2">
        <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3 text-sm">
          <span>
            Erreurs : <strong>{mistakes}</strong>
          </span>
          {selectedCell ? (
            <span className="text-muted-foreground">
              Case {selectedCell.row + 1},{selectedCell.col + 1}
            </span>
          ) : (
            <span className="text-muted-foreground">Aucune sélection</span>
          )}
        </div>

        <SudokuBoard />

        <InputPanel />

        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-4 text-sm"
            >
              <PartyPopper className="size-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold">Grille terminée !</p>
                <p className="text-muted-foreground">
                  {mistakes === 0
                    ? "Parfait, aucune erreur."
                    : `${mistakes} erreur(s) au total.`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileShell>
  );
}
