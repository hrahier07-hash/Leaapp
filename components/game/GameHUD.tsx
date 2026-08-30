"use client";

import { Pause, Play, Undo2, Lightbulb, PencilLine } from "lucide-react";
import { useEffect } from "react";

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
  const isPaused = useGameStore((s) => s.isPaused);
  const notesMode = useGameStore((s) => s.notesMode);
  const tick = useGameStore((s) => s.tick);
  const togglePause = useGameStore((s) => s.togglePause);
  const toggleNotesMode = useGameStore((s) => s.toggleNotesMode);
  const undo = useGameStore((s) => s.undo);
  const useHint = useGameStore((s) => s.useHint);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-violet-100">
        <div className="text-sm">
          <span className="font-bold">{formatTime(elapsedSeconds)}</span>
          <span className="mx-2 text-muted-foreground">·</span>
          <span>Erreurs {mistakes}</span>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={togglePause} className="flex size-10 items-center justify-center rounded-full bg-muted active:scale-95" aria-label={isPaused ? "Reprendre" : "Pause"}>
            {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
          </button>
          <button type="button" onClick={undo} className="flex size-10 items-center justify-center rounded-full bg-muted active:scale-95" aria-label="Annuler">
            <Undo2 className="size-4" />
          </button>
          <button type="button" onClick={useHint} className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 active:scale-95" aria-label="Indice">
            <Lightbulb className="size-4" />
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
        Indices utilisés : {hintsUsed}
      </p>
    </div>
  );
}
