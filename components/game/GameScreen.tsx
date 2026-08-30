"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { CellInputSheet } from "@/components/game/CellInputSheet";
import { GameHUD } from "@/components/game/GameHUD";
import { GameResults } from "@/components/game/GameResults";
import { SudokuBoard } from "@/components/game/SudokuBoard";
import { MobileShell } from "@/components/layout/MobileShell";
import { getLesson } from "@/lib/lessons/content";
import { useGameStore } from "@/store/useGameStore";

function GameScreenContent() {
  const isPaused = useGameStore((s) => s.isPaused);
  const searchParams = useSearchParams();
  const technique = searchParams.get("technique");
  const lesson = technique ? getLesson(technique) : null;
  const title = lesson ? lesson.title : "Jouer";

  return (
    <MobileShell title={title}>
      <div className="flex flex-col gap-3 py-2 pb-4">
        {lesson && (
          <p className="text-center text-xs text-muted-foreground">
            {lesson.summary}
          </p>
        )}
        <GameHUD />
        <SudokuBoard />
        <GameResults />
      </div>
      {!isPaused && <CellInputSheet />}
    </MobileShell>
  );
}

export function GameScreen() {
  const resetGame = useGameStore((s) => s.resetGame);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  return (
    <Suspense fallback={<MobileShell title="Jouer"><p className="py-8 text-center text-sm text-muted-foreground">Chargement…</p></MobileShell>}>
      <GameScreenContent />
    </Suspense>
  );
}
