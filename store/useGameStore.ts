import { create } from "zustand";

import { SAMPLE_PUZZLE, SAMPLE_SOLUTION } from "@/lib/sudoku/sample-puzzle";
import { getHint } from "@/lib/sudoku/hint";
import type { CellValue, Grid } from "@/lib/sudoku/types";
import { EMPTY } from "@/lib/sudoku/types";
import { isGridComplete, validateMove } from "@/lib/sudoku/validate";

type SelectedCell = { row: number; col: number } | null;
type NotesGrid = number[][][];

type HistoryEntry = {
  grid: Grid;
  notes: NotesGrid;
  hintMask: boolean[][];
};

type HintMask = boolean[][];

type GameState = {
  initialGrid: Grid;
  solutionGrid: Grid;
  grid: Grid;
  notes: NotesGrid;
  hintMask: HintMask;
  selectedCell: SelectedCell;
  mistakes: number;
  hintsUsed: number;
  hintsBudget: number;
  isComplete: boolean;
  isPaused: boolean;
  notesMode: boolean;
  startedAt: number | null;
  elapsedSeconds: number;
  history: HistoryEntry[];
  lastRecognition: { digit: number; confidence: number } | null;
  gameMode: "free" | "lesson" | "story" | "daily";
  storyLevel: number | null;
  dailyDateKey: string | null;
  dailyPatternName: string | null;
  selectCell: (row: number, col: number) => void;
  toggleNotesMode: () => void;
  togglePause: () => void;
  tick: () => void;
  setCellValue: (row: number, col: number, value: CellValue) => boolean;
  toggleNote: (row: number, col: number, value: number) => void;
  clearCell: (row: number, col: number) => void;
  undo: () => void;
  useHint: () => boolean;
  restartPuzzle: () => void;
  setLastRecognition: (digit: number | null, confidence: number) => void;
  resetGame: () => void;
  loadPuzzle: (
    initialGrid: Grid,
    solutionGrid: Grid,
    options?: {
      gameMode?: GameState["gameMode"];
      storyLevel?: number | null;
      dailyDateKey?: string | null;
      dailyPatternName?: string | null;
      hintsBudget?: number;
    },
  ) => void;
  clearSelection: () => void;
  isGiven: (row: number, col: number) => boolean;
};

function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

function emptyNotes(): NotesGrid {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => [] as number[]),
  );
}

function cloneNotes(notes: NotesGrid): NotesGrid {
  return notes.map((row) => row.map((cell) => [...cell]));
}

function emptyHintMask(): HintMask {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => false));
}

function cloneHintMask(mask: HintMask): HintMask {
  return mask.map((row) => [...row]);
}

function createInitialState() {
  const initialGrid = cloneGrid(SAMPLE_PUZZLE);
  return {
    initialGrid,
    solutionGrid: cloneGrid(SAMPLE_SOLUTION),
    grid: cloneGrid(initialGrid),
    notes: emptyNotes(),
    hintMask: emptyHintMask(),
    selectedCell: null as SelectedCell,
    mistakes: 0,
    hintsUsed: 0,
    hintsBudget: 5,
    isComplete: false,
    isPaused: false,
    notesMode: false,
    startedAt: Date.now(),
    elapsedSeconds: 0,
    history: [] as HistoryEntry[],
    lastRecognition: null as { digit: number; confidence: number } | null,
    gameMode: "free" as const,
    storyLevel: null as number | null,
    dailyDateKey: null as string | null,
    dailyPatternName: null as string | null,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  ...createInitialState(),

  selectCell: (row, col) => {
    const state = get();
    if (state.initialGrid[row][col] !== EMPTY) return;
    set({ selectedCell: { row, col } });
  },

  toggleNotesMode: () => set({ notesMode: !get().notesMode }),
  togglePause: () => set({ isPaused: !get().isPaused }),

  tick: () => {
    const { isPaused, isComplete, startedAt } = get();
    if (isPaused || isComplete || !startedAt) return;
    set({ elapsedSeconds: Math.floor((Date.now() - startedAt) / 1000) });
  },

  setCellValue: (row, col, value) => {
    const state = get();
    if (state.initialGrid[row][col] !== EMPTY) return false;
    if (value === EMPTY) return false;

    const isValid = validateMove(state.grid, row, col, value);
    const matchesSolution = state.solutionGrid[row][col] === value;
    const isCorrect = isValid && matchesSolution;

    const nextGrid = cloneGrid(state.grid);
    nextGrid[row][col] = value;
    const nextNotes = cloneNotes(state.notes);
    nextNotes[row][col] = [];
    const nextHintMask = cloneHintMask(state.hintMask);
    nextHintMask[row][col] = false;

    set({
      history: [
        ...state.history,
        {
          grid: cloneGrid(state.grid),
          notes: cloneNotes(state.notes),
          hintMask: cloneHintMask(state.hintMask),
        },
      ],
      grid: nextGrid,
      notes: nextNotes,
      hintMask: nextHintMask,
      mistakes: isCorrect ? state.mistakes : state.mistakes + 1,
      isComplete: isGridComplete(nextGrid, state.solutionGrid),
      selectedCell: { row, col },
    });

    return isCorrect;
  },

  toggleNote: (row, col, value) => {
    const state = get();
    if (state.initialGrid[row][col] !== EMPTY) return;
    const nextNotes = cloneNotes(state.notes);
    const cell = nextNotes[row][col];
    if (cell.includes(value)) {
      nextNotes[row][col] = cell.filter((n) => n !== value);
    } else {
      nextNotes[row][col] = [...cell, value].sort();
    }
    set({ notes: nextNotes, selectedCell: { row, col } });
  },

  clearCell: (row, col) => {
    const state = get();
    if (state.initialGrid[row][col] !== EMPTY) return;
    const nextGrid = cloneGrid(state.grid);
    nextGrid[row][col] = EMPTY;
    const nextNotes = cloneNotes(state.notes);
    nextNotes[row][col] = [];
    const nextHintMask = cloneHintMask(state.hintMask);
    nextHintMask[row][col] = false;
    set({
      history: [
        ...state.history,
        {
          grid: cloneGrid(state.grid),
          notes: cloneNotes(state.notes),
          hintMask: cloneHintMask(state.hintMask),
        },
      ],
      grid: nextGrid,
      notes: nextNotes,
      hintMask: nextHintMask,
      isComplete: false,
    });
  },

  undo: () => {
    const { history } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({
      grid: cloneGrid(prev.grid),
      notes: cloneNotes(prev.notes),
      hintMask: cloneHintMask(prev.hintMask),
      history: history.slice(0, -1),
      isComplete: isGridComplete(prev.grid, get().solutionGrid),
    });
  },

  useHint: () => {
    const state = get();
    if (state.hintsBudget <= 0) return false;

    let row: number;
    let col: number;
    let value: number;

    const hint = getHint(state.grid, state.solutionGrid);
    if (hint?.kind === "placement") {
      ({ row, col, value } = hint);
    } else {
      const fallback = findFallbackHintPlacement(
        state.grid,
        state.initialGrid,
        state.solutionGrid,
      );
      if (!fallback) return false;
      ({ row, col, value } = fallback);
    }

    const nextGrid = cloneGrid(state.grid);
    nextGrid[row][col] = value as CellValue;
    const nextNotes = cloneNotes(state.notes);
    nextNotes[row][col] = [];
    const nextHintMask = cloneHintMask(state.hintMask);
    nextHintMask[row][col] = true;

    set({
      history: [
        ...state.history,
        {
          grid: cloneGrid(state.grid),
          notes: cloneNotes(state.notes),
          hintMask: cloneHintMask(state.hintMask),
        },
      ],
      grid: nextGrid,
      notes: nextNotes,
      hintMask: nextHintMask,
      hintsUsed: state.hintsUsed + 1,
      isComplete: isGridComplete(nextGrid, state.solutionGrid),
      selectedCell: null,
    });

    return true;
  },

  restartPuzzle: () => {
    const state = get();
    set({
      grid: cloneGrid(state.initialGrid),
      notes: emptyNotes(),
      hintMask: emptyHintMask(),
      mistakes: 0,
      history: [],
      isComplete: false,
      isPaused: false,
      selectedCell: null,
      startedAt: Date.now(),
      elapsedSeconds: 0,
    });
  },

  setLastRecognition: (digit, confidence) => {
    set({
      lastRecognition:
        digit === null ? null : { digit, confidence: Math.round(confidence * 100) },
    });
  },

  resetGame: () => set(createInitialState()),

  loadPuzzle: (initialGrid, solutionGrid, options) => {
    const grid = cloneGrid(initialGrid);
    set({
      initialGrid: cloneGrid(initialGrid),
      solutionGrid: cloneGrid(solutionGrid),
      grid,
      notes: emptyNotes(),
      hintMask: emptyHintMask(),
      selectedCell: null,
      mistakes: 0,
      hintsUsed: 0,
      hintsBudget: options?.hintsBudget ?? 5,
      isComplete: false,
      isPaused: false,
      notesMode: false,
      startedAt: Date.now(),
      elapsedSeconds: 0,
      history: [],
      lastRecognition: null,
      gameMode: options?.gameMode ?? "free",
      storyLevel: options?.storyLevel ?? null,
      dailyDateKey: options?.dailyDateKey ?? null,
      dailyPatternName: options?.dailyPatternName ?? null,
    });
  },

  clearSelection: () => set({ selectedCell: null }),

  isGiven: (row, col) => get().initialGrid[row][col] !== EMPTY,
}));

function findFallbackHintPlacement(
  grid: Grid,
  initialGrid: Grid,
  solutionGrid: Grid,
): { row: number; col: number; value: number } | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (initialGrid[row][col] !== EMPTY) continue;
      if (grid[row][col] !== EMPTY) continue;
      return { row, col, value: solutionGrid[row][col] };
    }
  }
  return null;
}
