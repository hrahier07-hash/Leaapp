import { cloneGrid, isValidPlacement } from "./grid-utils";
import type { CellValue, CellCoord, Grid } from "./types";
import { EMPTY, GRID_SIZE } from "./types";

function findNextEmpty(grid: Grid): CellCoord | null {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === EMPTY) {
        return { row, col };
      }
    }
  }
  return null;
}

export function solveGrid(grid: Grid): Grid | null {
  const working = cloneGrid(grid);

  const backtrack = (): boolean => {
    const empty = findNextEmpty(working);
    if (!empty) return true;

    const { row, col } = empty;
    for (let value = 1; value <= 9; value++) {
      const digit = value as CellValue;
      if (isValidPlacement(working, row, col, digit)) {
        working[row][col] = digit;
        if (backtrack()) return true;
        working[row][col] = EMPTY;
      }
    }

    return false;
  };

  return backtrack() ? working : null;
}
