"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { motion } from "framer-motion";

import { Mascot } from "@/components/gamification/Mascot";
import { buttonVariants } from "@/components/ui/button";
import { computeXpForCompletion } from "@/lib/gamification/xp";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

export function GameResults() {
  const isComplete = useGameStore((s) => s.isComplete);
  const mistakes = useGameStore((s) => s.mistakes);
  const elapsedSeconds = useGameStore((s) => s.elapsedSeconds);
  const hintsUsed = useGameStore((s) => s.hintsUsed);

  const xp = computeXpForCompletion({
    difficulty: "facile",
    timeSeconds: elapsedSeconds,
    mistakesCount: mistakes,
    hintsUsed,
  });

  useEffect(() => {
    if (!isComplete) return;
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.65 } });
  }, [isComplete]);

  if (!isComplete) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-violet-100"
    >
      <Mascot mood="proud" message="Grille terminée ! Tu as gagné de l'XP." />
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-xl bg-violet-50 p-3">
          <p className="text-xs text-muted-foreground">Temps</p>
          <p className="font-bold">{elapsedSeconds}s</p>
        </div>
        <div className="rounded-xl bg-rose-50 p-3">
          <p className="text-xs text-muted-foreground">Erreurs</p>
          <p className="font-bold">{mistakes}</p>
        </div>
        <div className="rounded-xl bg-sky-50 p-3">
          <p className="text-xs text-muted-foreground">XP</p>
          <p className="font-bold">+{xp}</p>
        </div>
      </div>
      <Link href="/app/jouer" className={cn(buttonVariants(), "w-full")}>
        Grille suivante
      </Link>
      <Link href="/app" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
        Retour au parcours
      </Link>
    </motion.div>
  );
}
