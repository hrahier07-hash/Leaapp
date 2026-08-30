"use client";

import { InputPanel } from "@/components/game/InputPanel";
import { GameHUD } from "@/components/game/GameHUD";
import { GameResults } from "@/components/game/GameResults";
import { SudokuBoard } from "@/components/game/SudokuBoard";
import { MobileShell } from "@/components/layout/MobileShell";
import { useGameStore } from "@/store/useGameStore";

export function GameScreen() {
  const isPaused = useGameStore((s) => s.isPaused);

  return (
    <MobileShell title="Jouer">
      <div className="flex flex-col gap-4 py-2">
        <GameHUD />
        <SudokuBoard />
        {!isPaused && <InputPanel />}
        <GameResults />
      </div>
    </MobileShell>
  );
}
