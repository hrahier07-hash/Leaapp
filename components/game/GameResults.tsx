"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { motion } from "framer-motion";

import { Mascot } from "@/components/gamification/Mascot";
import { buttonVariants } from "@/components/ui/button";
import { computeXpForCompletion } from "@/lib/gamification/xp";
import { STORY_LEVEL_COUNT } from "@/lib/story/levels";
import { useSharedUser } from "@/hooks/useSharedUser";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

export function GameResults() {
  const isComplete = useGameStore((s) => s.isComplete);
  const mistakes = useGameStore((s) => s.mistakes);
  const elapsedSeconds = useGameStore((s) => s.elapsedSeconds);
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const gameMode = useGameStore((s) => s.gameMode);
  const storyLevel = useGameStore((s) => s.storyLevel);
  const { refresh } = useSharedUser();
  const savedRef = useRef(false);

  const xp = computeXpForCompletion({
    difficulty: gameMode === "story" && storyLevel ? "moyen" : "facile",
    timeSeconds: elapsedSeconds,
    mistakesCount: mistakes,
    hintsUsed,
  });

  useEffect(() => {
    if (!isComplete || savedRef.current) return;
    savedRef.current = true;
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.65 } });

    if (gameMode === "story" && storyLevel) {
      void fetch("/api/story/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: storyLevel }),
      }).then(() => refresh());
      return;
    }

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
  }, [
    isComplete,
    elapsedSeconds,
    mistakes,
    hintsUsed,
    refresh,
    gameMode,
    storyLevel,
  ]);

  if (!isComplete) return null;

  const nextStoryLevel =
    storyLevel && storyLevel < STORY_LEVEL_COUNT ? storyLevel + 1 : null;

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

      {gameMode === "story" && storyLevel ? (
        <>
          {nextStoryLevel ? (
            <Link
              href={`/app/jouer?histoire=${nextStoryLevel}`}
              className={cn(buttonVariants(), "w-full")}
            >
              Niveau {nextStoryLevel}
            </Link>
          ) : (
            <p className="text-center text-sm font-medium text-primary">
              Tu as fini toute l&apos;histoire !
            </p>
          )}
          <Link
            href="/app/histoire"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Retour à l&apos;histoire
          </Link>
        </>
      ) : (
        <>
          <Link href="/app/jouer" className={cn(buttonVariants(), "w-full")}>
            Nouvelle grille
          </Link>
          <Link href="/app" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
            Retour aux leçons
          </Link>
        </>
      )}
    </motion.div>
  );
}
