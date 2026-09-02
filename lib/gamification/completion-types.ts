import type { Difficulty } from "@/lib/sudoku/types";

export type CompletionPayload = {
  difficulty: Difficulty;
  timeSeconds: number;
  mistakesCount: number;
  hintsUsed: number;
  gameMode?: "free" | "lesson" | "story" | "daily";
  storyLevel?: number;
  dailyDateKey?: string;
};

export type CompletionResult = {
  xp: number;
  saved: boolean;
  totalXp: number;
  hearts: number;
  hints: number;
  currentStreak: number;
  puzzlesCompleted: number;
  totalMistakes: number;
  totalHintsUsed: number;
  storyLevelUnlocked?: number;
  storyBeatsUnlocked?: number[];
};
