import type { Difficulty, Grid } from "@/lib/sudoku/types";
import { generateGrid } from "@/lib/sudoku/generator";
import { solveGrid } from "@/lib/sudoku/solver";
import { cloneGrid } from "@/lib/sudoku/grid-utils";

export const STORY_LEVEL_COUNT = 50;

const puzzleCache = new Map<number, { puzzle: Grid; solution: Grid }>();

export function getDifficultyForLevel(level: number): Difficulty {
  if (level <= 10) return "facile";
  if (level <= 25) return "moyen";
  if (level <= 40) return "difficile";
  if (level <= 48) return "expert";
  return "diabolique";
}

export function getStoryLevelLabel(level: number): string {
  const diff = getDifficultyForLevel(level);
  const labels: Record<Difficulty, string> = {
    facile: "Facile",
    moyen: "Moyen",
    difficile: "Difficile",
    expert: "Expert",
    diabolique: "Très dur",
  };
  return labels[diff];
}

/** Grille déterministe par niveau (même niveau = même grille). */
export function getStoryPuzzle(level: number): { puzzle: Grid; solution: Grid } {
  const cached = puzzleCache.get(level);
  if (cached) return cached;

  const rng = mulberry32(level * 9973 + 42);
  const originalRandom = Math.random;
  Math.random = rng;

  try {
    const difficulty = getDifficultyForLevel(level);
    let puzzle = generateGrid(difficulty);
    let solution = solveGrid(puzzle);

    if (!solution) {
      puzzle = generateGrid("facile");
      solution = solveGrid(puzzle)!;
    }

    const entry = {
      puzzle: cloneGrid(puzzle),
      solution: cloneGrid(solution),
    };
    puzzleCache.set(level, entry);
    return entry;
  } finally {
    Math.random = originalRandom;
  }
}

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
