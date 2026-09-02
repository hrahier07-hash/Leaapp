"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CellInputSheet } from "@/components/game/CellInputSheet";
import { GameHUD } from "@/components/game/GameHUD";
import { GameResults } from "@/components/game/GameResults";
import { SudokuBoard } from "@/components/game/SudokuBoard";
import { MobileShell } from "@/components/layout/MobileShell";
import { generateDailyChallenge } from "@/lib/daily/challenge";
import { getParisDateKey } from "@/lib/daily/time";
import { getLesson } from "@/lib/lessons/content";
import { getStoryLevelLabel, getStoryPuzzle } from "@/lib/story/levels";
import { useSharedUser } from "@/hooks/useSharedUser";
import { useGameStore } from "@/store/useGameStore";

function GameScreenContent() {
  const isPaused = useGameStore((s) => s.isPaused);
  const dailyPatternName = useGameStore((s) => s.dailyPatternName);
  const searchParams = useSearchParams();
  const technique = searchParams.get("technique");
  const histoireParam = searchParams.get("histoire");
  const isDaily = searchParams.get("defi") === "1";
  const storyLevel = histoireParam ? Number(histoireParam) : null;
  const lesson = technique ? getLesson(technique) : null;

  const title = isDaily
    ? "Défi du jour"
    : storyLevel
      ? `Histoire · Niveau ${storyLevel}`
      : lesson
        ? lesson.title
        : "Jouer";

  return (
    <MobileShell title={title}>
      <div className="flex flex-col gap-3 py-2 pb-4">
        {isDaily && dailyPatternName && (
          <p className="text-center text-xs text-muted-foreground">
            {dailyPatternName} · Défi spécial
          </p>
        )}
        {storyLevel && (
          <p className="text-center text-xs text-muted-foreground">
            {getStoryLevelLabel(storyLevel)}
          </p>
        )}
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

function GameLoader() {
  const searchParams = useSearchParams();
  const loadPuzzle = useGameStore((s) => s.loadPuzzle);
  const resetGame = useGameStore((s) => s.resetGame);
  const { profile } = useSharedUser();
  const [ready, setReady] = useState(false);
  const [loadingDaily, setLoadingDaily] = useState(false);
  const hintsLoadedRef = useRef(false);

  const technique = searchParams.get("technique");
  const histoireParam = searchParams.get("histoire");
  const isDaily = searchParams.get("defi") === "1";
  const storyLevel = histoireParam ? Number(histoireParam) : null;

  const hintsBudget = profile?.hints ?? 5;

  useEffect(() => {
    if (isDaily) {
      setReady(false);
      setLoadingDaily(true);
      const dateKey = getParisDateKey();
      const timer = window.setTimeout(() => {
        try {
          const challenge = generateDailyChallenge(dateKey);
          loadPuzzle(challenge.puzzle, challenge.solution, {
            gameMode: "daily",
            dailyDateKey: dateKey,
            dailyPatternName: challenge.patternName,
            hintsBudget,
          });
          setReady(true);
        } catch {
          resetGame();
          setReady(true);
        } finally {
          setLoadingDaily(false);
        }
      }, 0);
      return () => window.clearTimeout(timer);
    }

    if (storyLevel && storyLevel >= 1 && storyLevel <= 50) {
      setReady(false);
      const { puzzle, solution } = getStoryPuzzle(storyLevel);
      loadPuzzle(puzzle, solution, {
        gameMode: "story",
        storyLevel,
        hintsBudget,
      });
      setReady(true);
      return;
    }

    resetGame();
    if (technique) {
      useGameStore.setState({ gameMode: "lesson", hintsBudget });
    } else {
      useGameStore.setState({ hintsBudget });
    }
    setReady(true);
  }, [
    isDaily,
    storyLevel,
    technique,
    loadPuzzle,
    resetGame,
    hintsBudget,
  ]);

  useEffect(() => {
    if (!profile || hintsLoadedRef.current || isDaily || storyLevel) return;
    hintsLoadedRef.current = true;
    useGameStore.setState({ hintsBudget: profile.hints });
  }, [profile, isDaily, storyLevel]);

  if (!ready) {
    return (
      <MobileShell title={isDaily ? "Défi du jour" : "Jouer"}>
        <p className="py-12 text-center text-sm text-muted-foreground">
          {loadingDaily
            ? "Préparation du défi du jour…"
            : "Préparation de la grille…"}
        </p>
      </MobileShell>
    );
  }

  return <GameScreenContent />;
}

export function GameScreen() {
  return (
    <Suspense
      fallback={
        <MobileShell title="Jouer">
          <p className="py-8 text-center text-sm text-muted-foreground">Chargement…</p>
        </MobileShell>
      }
    >
      <GameLoader />
    </Suspense>
  );
}
