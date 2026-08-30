import { create } from "zustand";

import { SAMPLE_PUZZLE } from "@/lib/sudoku/sample-puzzle";
import type { CellValue, Grid } from "@/lib/sudoku/types";
import { EMPTY } from "@/lib/sudoku/types";
import { isGridComplete, validateMove } from "@/lib/sudoku/validate";

type SelectedCell = { row: number; col: number } | null;

type GameState = {
  initialGrid: Grid;
  grid: Grid;
  selectedCell: SelectedCell;
  mistakes: number;
  isComplete: boolean;
  lastRecognition: { digit: number; confidence: number } | null;
  selectCell: (row: number, col: number) => void;
  clearSelection: () => void;
  setCellValue: (row: number, col: number, value: CellValue) => boolean;
  clearCell: (row: number, col: number) => void;
  setLastRecognition: (digit: number | null, confidence: number) => void;
  resetGame: () => void;
  isGiven: (row: number, col: number) => boolean;
};

function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

function createInitialState() {
  const initialGrid = cloneGrid(SAMPLE_PUZZLE);
  return {
    initialGrid,
    grid: cloneGrid(initialGrid),
    selectedCell: null as SelectedCell,
    mistakes: 0,
    isComplete: false,
    lastRecognition: null as { digit: number; confidence: number } | null,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  ...createInitialState(),

  selectCell: (row, col) => {
    if (get().initialGrid[row][col] !== EMPTY) return;
    set({ selectedCell: { row, col } });
  },

  clearSelection: () => set({ selectedCell: null }),

  setCellValue: (row, col, value) => {
    const { initialGrid, grid } = get();
    if (initialGrid[row][col] !== EMPTY) return false;
    if (value === EMPTY) return false;

    const isValid = validateMove(grid, row, col, value);
    const nextGrid = cloneGrid(grid);
    nextGrid[row][col] = value;

    set({
      grid: nextGrid,
      mistakes: isValid ? get().mistakes : get().mistakes + 1,
      isComplete: isGridComplete(nextGrid),
      selectedCell: { row, col },
    });

    return isValid;
  },

  clearCell: (row, col) => {
    const { initialGrid, grid } = get();
    if (initialGrid[row][col] !== EMPTY) return;

    const nextGrid = cloneGrid(grid);
    nextGrid[row][col] = EMPTY;

    set({ grid: nextGrid, isComplete: false });
  },

  setLastRecognition: (digit, confidence) => {
    set({
      lastRecognition:
        digit === null ? null : { digit, confidence: Math.round(confidence * 100) },
    });
  },

  resetGame: () => set(createInitialState()),

  isGiven: (row, col) => get().initialGrid[row][col] !== EMPTY,
}));
