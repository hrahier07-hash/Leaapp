"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { motion } from "framer-motion";

import { Mascot } from "@/components/gamification/Mascot";
import { buttonVariants } from "@/components/ui/button";
import { computeXpForCompletion } from "@/lib/gamification/xp";
import { useSharedUser } from "@/hooks/useSharedUser";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

export function GameResults() {
  const isComplete = useGameStore((s) => s.isComplete);
  const mistakes = useGameStore((s) => s.mistakes);
  const elapsedSeconds = useGameStore((s) => s.elapsedSeconds);
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const { refresh } = useSharedUser();

  const xp = computeXpForCompletion({
    difficulty: "facile",
    timeSeconds: elapsedSeconds,
    mistakesCount: mistakes,
    hintsUsed,
  });

  useEffect(() => {
    if (!isComplete) return;
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.65 } });

    void fetch("/api/puzzle/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        difficulty: "facile",
        timeSeconds: elapsedSeconds,
        mistakesCount: mistakes,
        hintsUsed,
      }),
    }).then(() => refresh());
  }, [isComplete, elapsedSeconds, mistakes, hintsUsed, refresh]);

  if (!isComplete) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-card space-y-4 p-4"
    >
      <Mascot mood="proud" message="Grille complète ! Tous les chiffres sont bons." />
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-muted-foreground">Temps</p>
          <p className="font-bold">{elapsedSeconds}s</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-muted-foreground">Erreurs</p>
          <p className="font-bold">{mistakes}</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-muted-foreground">Points</p>
          <p className="font-bold">+{xp}</p>
        </div>
      </div>
      <Link href="/app/jouer" className={cn(buttonVariants(), "w-full")}>
        Nouvelle grille
      </Link>
      <Link href="/app" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
        Retour aux leçons
      </Link>
    </motion.div>
  );
}
