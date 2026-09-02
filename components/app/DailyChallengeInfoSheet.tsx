"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type DailyChallengeInfoSheetProps = {
  open: boolean;
  onClose: () => void;
};

const SECTIONS = [
  {
    title: "C'est quoi ?",
    body: "Chaque jour, une grille de sudoku spéciale te attend. Elle est plus difficile qu'une grille libre, mais faisable avec un peu de patience.",
  },
  {
    title: "La forme du jour",
    body: "Les cases colorées sur la miniature montrent où sont placés les chiffres de départ. Ce n'est pas une règle en plus : c'est juste la « signature » visuelle du défi.",
  },
  {
    title: "Ton objectif",
    body: "Remplis toute la grille comme un sudoku classique : les chiffres 1 à 9 doivent apparaître une seule fois par ligne, par colonne et par bloc 3×3.",
  },
  {
    title: "Même défi pour tous",
    body: "Tout le monde joue la même grille aujourd'hui. Demain, une nouvelle forme et une nouvelle grille arriveront à minuit (heure de Paris).",
  },
  {
    title: "Indices et vies",
    body: "Tu peux utiliser tes indices restants. Chaque erreur fait perdre une vie, comme dans le reste du jeu.",
  },
] as const;

export function DailyChallengeInfoSheet({
  open,
  onClose,
}: DailyChallengeInfoSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20"
            aria-label="Fermer"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
            className="relative z-10 max-h-[min(85dvh,32rem)] w-full max-w-[min(100%,22rem)] overflow-y-auto rounded-2xl border border-white/30 bg-background/85 px-4 py-4 shadow-lg backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold">Comment jouer</p>
                <p className="text-xs text-muted-foreground">Défi du jour</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted active:scale-95"
                aria-label="Fermer"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {SECTIONS.map((section) => (
                <div key={section.title}>
                  <p className="font-medium">{section.title}</p>
                  <p className="mt-0.5 text-muted-foreground leading-relaxed">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
