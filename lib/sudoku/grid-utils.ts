import type { CellValue, CellCoord, Grid } from "./types";
import { EMPTY, GRID_SIZE } from "./types";

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

export function getBoxIndex(row: number, col: number): number {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

export function peers(row: number, col: number): CellCoord[] {
  const result: CellCoord[] = [];
  const seen = new Set<string>();

  const add = (r: number, c: number): void => {
    if (r === row && c === col) return;
    const key = `${r},${c}`;
    if (seen.has(key)) return;
    seen.add(key);
    result.push({ row: r, col: c });
  };

  for (let c = 0; c < GRID_SIZE; c++) {
    add(row, c);
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    add(r, col);
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      add(r, c);
    }
  }

  return result;
}

export function isValidPlacement(
  grid: Grid,
  row: number,
  col: number,
  value: CellValue,
): boolean {
  if (value === EMPTY) return true;

  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col && grid[row][c] === value) return false;
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && grid[r][col] === value) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (r !== row && c !== col && grid[r][c] === value) return false;
    }
  }

  return true;
}

export function countSolutions(grid: Grid, limit = 2): number {
  const working = cloneGrid(grid);
  let count = 0;

  const findNextEmpty = (): CellCoord | null => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (working[row][col] === EMPTY) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const solve = (): void => {
    if (count >= limit) return;

    const empty = findNextEmpty();
    if (!empty) {
      count++;
      return;
    }

    const { row, col } = empty;
    for (let value = 1; value <= 9; value++) {
      const digit = value as CellValue;
      if (isValidPlacement(working, row, col, digit)) {
        working[row][col] = digit;
        solve();
        working[row][col] = EMPTY;
        if (count >= limit) return;
      }
    }
  };

  solve();
  return count;
}

export function countClues(grid: Grid): number {
  return grid.reduce(
    (total, row) => total + row.filter((cell) => cell !== EMPTY).length,
    0,
  );
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
