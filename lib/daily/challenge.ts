import { classifyDifficulty } from "@/lib/sudoku/classifier";
import {
  cloneGrid,
  countClues,
  countSolutions,
} from "@/lib/sudoku/grid-utils";
import { generateFullGrid } from "@/lib/sudoku/generator";
import { solveGrid } from "@/lib/sudoku/solver";
import type { Difficulty, Grid } from "@/lib/sudoku/types";
import { EMPTY } from "@/lib/sudoku/types";

import { getParisDateKey } from "./time";

export type DailyPatternId =
  | "symetrie"
  | "croix"
  | "cadre"
  | "diagonales"
  | "losange"
  | "coins"
  | "etoile";

export type DailyChallenge = {
  dateKey: string;
  patternId: DailyPatternId;
  patternName: string;
  patternDescription: string;
  difficulty: Difficulty;
  clueCount: number;
  puzzle: Grid;
  solution: Grid;
};

const PATTERN_META: Record<
  DailyPatternId,
  { name: string; description: string }
> = {
  symetrie: {
    name: "Miroir",
    description:
      "Les chiffres de départ sont disposés en symétrie, comme dans un miroir.",
  },
  croix: {
    name: "Croix",
    description: "Les chiffres dessinent une croix au centre de la grille.",
  },
  cadre: {
    name: "Cadre",
    description: "Les chiffres forment un cadre sur les bords de la grille.",
  },
  diagonales: {
    name: "Diagonales",
    description: "Les chiffres suivent les deux grandes diagonales.",
  },
  losange: {
    name: "Losange",
    description: "Les chiffres forment un losange au milieu de la grille.",
  },
  coins: {
    name: "Quatre coins",
    description: "Les chiffres sont regroupés dans les quatre coins.",
  },
  etoile: {
    name: "Étoile",
    description: "Les chiffres dessinent une étoile : croix et diagonales.",
  },
};

const PATTERN_IDS = Object.keys(PATTERN_META) as DailyPatternId[];

const MIN_CLUES = 23;
const MAX_CLUES = 27;

const cache = new Map<string, DailyChallenge>();

function dateKeyToSeed(dateKey: string): number {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
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

function buildPatternMask(id: DailyPatternId): boolean[][] {
  const mask = Array.from({ length: 9 }, () => Array(9).fill(false));

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      switch (id) {
        case "symetrie":
          mask[r][c] = r === 8 - r || c === 8 - c;
          break;
        case "croix":
          mask[r][c] = r === 4 || c === 4;
          break;
        case "cadre":
          mask[r][c] = r === 0 || r === 8 || c === 0 || c === 8;
          break;
        case "diagonales":
          mask[r][c] = r === c || r + c === 8;
          break;
        case "losange":
          mask[r][c] = Math.abs(r - 4) + Math.abs(c - 4) <= 3;
          break;
        case "coins":
          mask[r][c] =
            (r < 3 && c < 3) ||
            (r < 3 && c > 5) ||
            (r > 5 && c < 3) ||
            (r > 5 && c > 5);
          break;
        case "etoile":
          mask[r][c] = r === 4 || c === 4 || r === c || r + c === 8;
          break;
      }
    }
  }

  return mask;
}

function seededShuffle<T>(items: T[], random: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generatePatternedPuzzle(
  random: () => number,
  patternId: DailyPatternId,
): { puzzle: Grid; solution: Grid } | null {
  const mask = buildPatternMask(patternId);
  const full = generateFullGrid();
  const solution = cloneGrid(full);
  const puzzle = cloneGrid(full);

  const cells: { row: number; col: number; keepPriority: number }[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      cells.push({
        row,
        col,
        keepPriority: mask[row][col] ? 1 : 0,
      });
    }
  }

  const shuffled = seededShuffle(cells, random).sort(
    (a, b) => a.keepPriority - b.keepPriority,
  );

  let clues = 81;
  for (const { row, col } of shuffled) {
    if (clues <= MAX_CLUES) break;

    const backup = puzzle[row][col];
    puzzle[row][col] = EMPTY;

    if (countSolutions(puzzle, 2) === 1) {
      clues--;
    } else {
      puzzle[row][col] = backup;
    }
  }

  if (countClues(puzzle) > MAX_CLUES) return null;
  if (countClues(puzzle) < MIN_CLUES) return null;
  if (countSolutions(puzzle, 2) !== 1) return null;
  if (solveGrid(puzzle) === null) return null;

  const classified = classifyDifficulty(puzzle);
  const hardEnough = ["difficile", "expert", "diabolique"].includes(classified);
  if (!hardEnough) return null;

  return { puzzle, solution };
}

export function generateDailyChallenge(dateKey?: string): DailyChallenge {
  const key = dateKey ?? getParisDateKey();
  const cached = cache.get(key);
  if (cached) return cached;

  const seed = dateKeyToSeed(key);
  const random = mulberry32(seed);
  const originalRandom = Math.random;

  const patternId = PATTERN_IDS[seed % PATTERN_IDS.length];

  Math.random = random;

  let puzzle: Grid | null = null;
  let solution: Grid | null = null;
  let usedPatternId = patternId;

  try {
    for (let attempt = 0; attempt < 60; attempt++) {
      const result = generatePatternedPuzzle(random, patternId);
      if (result) {
        puzzle = result.puzzle;
        solution = result.solution;
        break;
      }
    }

    if (!puzzle || !solution) {
      for (let attempt = 0; attempt < 40; attempt++) {
        const altPattern = PATTERN_IDS[(seed + attempt + 1) % PATTERN_IDS.length];
        const result = generatePatternedPuzzle(random, altPattern);
        if (result) {
          puzzle = result.puzzle;
          solution = result.solution;
          usedPatternId = altPattern;
          break;
        }
      }
    }
  } finally {
    Math.random = originalRandom;
  }

  if (!puzzle || !solution) {
    throw new Error("Impossible de générer le défi du jour");
  }

  const usedMeta = PATTERN_META[usedPatternId];
  const difficulty = classifyDifficulty(puzzle);
  const challenge: DailyChallenge = {
    dateKey: key,
    patternId: usedPatternId,
    patternName: usedMeta.name,
    patternDescription: usedMeta.description,
    difficulty,
    clueCount: countClues(puzzle),
    puzzle,
    solution,
  };

  cache.set(key, challenge);
  return challenge;
}

export function getDailyChallengePreview(dateKey?: string) {
  const challenge = generateDailyChallenge(dateKey);
  return {
    dateKey: challenge.dateKey,
    patternId: challenge.patternId,
    patternName: challenge.patternName,
    patternDescription: challenge.patternDescription,
    difficulty: challenge.difficulty,
    clueCount: challenge.clueCount,
  };
}

export function getDailyDifficultyLabel(difficulty: Difficulty): string {
  const labels: Record<Difficulty, string> = {
    facile: "Facile",
    moyen: "Moyen",
    difficile: "Difficile",
    expert: "Expert",
    diabolique: "Très dur",
  };
  return labels[difficulty];
}
