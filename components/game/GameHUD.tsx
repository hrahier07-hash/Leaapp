"use client";

import { Pause, Play, Undo2, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";

import { HeartIcon, HintIcon } from "@/components/gamification/ResourceIcons";
import { MISTAKES_PER_LIFE } from "@/lib/user/daily-resources";
import { useSharedUser } from "@/hooks/useSharedUser";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function GameHUD() {
  const elapsedSeconds = useGameStore((s) => s.elapsedSeconds);
  const mistakes = useGameStore((s) => s.mistakes);
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const hintsBudget = useGameStore((s) => s.hintsBudget);
  const isPaused = useGameStore((s) => s.isPaused);
  const notesMode = useGameStore((s) => s.notesMode);
  const tick = useGameStore((s) => s.tick);
  const togglePause = useGameStore((s) => s.togglePause);
  const toggleNotesMode = useGameStore((s) => s.toggleNotesMode);
  const undo = useGameStore((s) => s.undo);
  const { profile, refresh } = useSharedUser();
  const [hintLoading, setHintLoading] = useState(false);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  useEffect(() => {
    if (profile) {
      useGameStore.setState({ hintsBudget: profile.hints });
    }
  }, [profile?.hints]);

  const hearts = profile?.hearts ?? 0;
  const canHint = hintsBudget > 0 && !hintLoading;

  const handleHint = async () => {
    if (!canHint) return;
    setHintLoading(true);
    try {
      const res = await fetch("/api/me/use-hint", { method: "POST" });
      if (!res.ok) return;

      const data = (await res.json()) as { hints: number; hearts: number };
      const placed = useGameStore.getState().useHint();
      if (!placed) return;

      useGameStore.setState({ hintsBudget: data.hints });
      await refresh();
    } finally {
      setHintLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between surface-card px-4 py-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold">{formatTime(elapsedSeconds)}</span>
          <span className="text-muted-foreground">
            Erreurs {mistakes}/{MISTAKES_PER_LIFE}
          </span>
          <span className="flex items-center gap-1 text-red-600">
            <HeartIcon className="size-3.5" />
            <strong>{hearts}</strong>
          </span>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={togglePause} className="flex size-10 items-center justify-center rounded-full bg-muted active:scale-95" aria-label={isPaused ? "Reprendre" : "Pause"}>
            {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
          </button>
          <button type="button" onClick={undo} className="flex size-10 items-center justify-center rounded-full bg-muted active:scale-95" aria-label="Annuler">
            <Undo2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => void handleHint()}
            disabled={!canHint}
            className={cn(
              "flex size-10 items-center justify-center rounded-full active:scale-95 disabled:opacity-40",
              canHint ? "bg-amber-100" : "bg-muted",
            )}
            aria-label="Indice"
          >
            <HintIcon className={cn(!canHint && "fill-muted text-muted-foreground")} />
          </button>
          <button
            type="button"
            onClick={toggleNotesMode}
            className={cn(
              "flex size-10 items-center justify-center rounded-full active:scale-95",
              notesMode ? "bg-primary text-primary-foreground" : "bg-muted",
            )}
            aria-label="Mode notes"
          >
            <PencilLine className="size-4" />
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        <HintIcon className="mr-1 inline size-3.5 align-[-2px]" />
        Indices : {hintsUsed} utilisé{hintsUsed > 1 ? "s" : ""} · {hintsBudget} restant
        {hintsBudget > 1 ? "s" : ""}
        <span className="mx-2">·</span>
        3 erreurs = −1 vie, grille remise à zéro
      </p>
    </div>
  );
}
