import type { CellValue, Grid } from "./types";
import { EMPTY, GRID_SIZE } from "./types";

export function validateMove(
  grid: Grid,
  row: number,
  col: number,
  value: CellValue,
): boolean {
  if (value === EMPTY) return true;
  if (value < 1 || value > 9) return false;

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

export function isGridComplete(grid: Grid): boolean {
  return grid.every((row) => row.every((cell) => cell !== EMPTY));
}
