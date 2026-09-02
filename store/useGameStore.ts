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
};

type GameState = {
  initialGrid: Grid;
  solutionGrid: Grid;
  grid: Grid;
  notes: NotesGrid;
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

function createInitialState() {
  const initialGrid = cloneGrid(SAMPLE_PUZZLE);
  return {
    initialGrid,
    solutionGrid: cloneGrid(SAMPLE_SOLUTION),
    grid: cloneGrid(initialGrid),
    notes: emptyNotes(),
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
    if (get().initialGrid[row][col] !== EMPTY) return;
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

    set({
      history: [
        ...state.history,
        { grid: cloneGrid(state.grid), notes: cloneNotes(state.notes) },
      ],
      grid: nextGrid,
      notes: nextNotes,
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
    set({
      history: [
        ...state.history,
        { grid: cloneGrid(state.grid), notes: cloneNotes(state.notes) },
      ],
      grid: nextGrid,
      notes: nextNotes,
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
      history: history.slice(0, -1),
      isComplete: isGridComplete(prev.grid, get().solutionGrid),
    });
  },

  useHint: () => {
    const state = get();
    if (state.hintsUsed >= state.hintsBudget) return false;
    const hint = getHint(state.grid, state.solutionGrid);
    if (!hint || hint.kind !== "placement") return false;

    const nextGrid = cloneGrid(state.grid);
    nextGrid[hint.row][hint.col] = hint.value;
    const nextNotes = cloneNotes(state.notes);
    nextNotes[hint.row][hint.col] = [];

    set({
      history: [
        ...state.history,
        { grid: cloneGrid(state.grid), notes: cloneNotes(state.notes) },
      ],
      grid: nextGrid,
      notes: nextNotes,
      hintsUsed: state.hintsUsed + 1,
      isComplete: isGridComplete(nextGrid, state.solutionGrid),
      selectedCell: { row: hint.row, col: hint.col },
    });

    return true;
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
