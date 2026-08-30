import { classifyDifficulty } from "./classifier";
import {
  cloneGrid,
  countClues,
  countSolutions,
  isValidPlacement,
  shuffle,
} from "./grid-utils";
import { solveGrid } from "./solver";
import type { CellValue, Difficulty, Grid } from "./types";
import { EMPTY, GRID_SIZE } from "./types";

const DIFFICULTY_TARGETS: Record<
  Difficulty,
  { minClues: number; maxClues: number }
> = {
  facile: { minClues: 38, maxClues: 45 },
  moyen: { minClues: 32, maxClues: 37 },
  difficile: { minClues: 28, maxClues: 31 },
  expert: { minClues: 23, maxClues: 27 },
  diabolique: { minClues: 17, maxClues: 22 },
};

function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => EMPTY as CellValue),
  );
}

function fillGrid(grid: Grid): boolean {
  const emptyCell = ((): { row: number; col: number } | null => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === EMPTY) return { row, col };
      }
    }
    return null;
  })();

  if (!emptyCell) return true;

  const { row, col } = emptyCell;
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9] as CellValue[]);

  for (const digit of digits) {
    if (isValidPlacement(grid, row, col, digit)) {
      grid[row][col] = digit;
      if (fillGrid(grid)) return true;
      grid[row][col] = EMPTY;
    }
  }

  return false;
}

export function generateFullGrid(): Grid {
  const grid = createEmptyGrid();
  fillGrid(grid);
  return grid;
}

function removeCells(fullGrid: Grid, targetClues: number): Grid {
  const puzzle = cloneGrid(fullGrid);
  const positions = shuffle(
    Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => ({
      row: Math.floor(index / GRID_SIZE),
      col: index % GRID_SIZE,
    })),
  );

  let clues = countClues(puzzle);

  for (const { row, col } of positions) {
    if (clues <= targetClues) break;

    const backup = puzzle[row][col];
    puzzle[row][col] = EMPTY;

    if (countSolutions(puzzle, 2) === 1) {
      clues--;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return puzzle;
}

function difficultyMatches(puzzle: Grid, difficulty: Difficulty): boolean {
  const classified = classifyDifficulty(puzzle);
  const order: Difficulty[] = [
    "facile",
    "moyen",
    "difficile",
    "expert",
    "diabolique",
  ];
  return order.indexOf(classified) === order.indexOf(difficulty);
}

export function generateGrid(difficulty: Difficulty): Grid {
  const { minClues, maxClues } = DIFFICULTY_TARGETS[difficulty];
  const targetClues = Math.floor((minClues + maxClues) / 2);

  for (let attempt = 0; attempt < 40; attempt++) {
    const fullGrid = generateFullGrid();
    const puzzle = removeCells(fullGrid, targetClues);
    const clues = countClues(puzzle);

    if (clues < minClues || clues > maxClues) continue;
    if (countSolutions(puzzle, 2) !== 1) continue;
    if (solveGrid(puzzle) === null) continue;

    if (difficulty === "diabolique" || difficultyMatches(puzzle, difficulty)) {
      return puzzle;
    }
  }

  const fallback = generateFullGrid();
  return removeCells(fallback, targetClues);
}

export { DIFFICULTY_TARGETS };
