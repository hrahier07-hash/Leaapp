import { isValidPlacement } from "./grid-utils";
import type { CellValue, CandidatesGrid, Grid } from "./types";
import { EMPTY, GRID_SIZE } from "./types";

export function computeCandidates(grid: Grid): CandidatesGrid {
  const candidates: CandidatesGrid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => [] as CellValue[]),
  );

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] !== EMPTY) continue;

      const cellCandidates: CellValue[] = [];
      for (let value = 1; value <= 9; value++) {
        const digit = value as CellValue;
        if (isValidPlacement(grid, row, col, digit)) {
          cellCandidates.push(digit);
        }
      }
      candidates[row][col] = cellCandidates;
    }
  }

  return candidates;
}

export function applyEliminations(
  candidates: CandidatesGrid,
  eliminations: Array<{ row: number; col: number; values: CellValue[] }>,
): boolean {
  let changed = false;

  for (const { row, col, values } of eliminations) {
    const current = candidates[row][col];
    if (current.length === 0) continue;

    const next = current.filter((value) => !values.includes(value));
    if (next.length !== current.length) {
      candidates[row][col] = next;
      changed = true;
    }
  }

  return changed;
}

export function applyPlacements(
  grid: Grid,
  candidates: CandidatesGrid,
  placements: Array<{ row: number; col: number; value: CellValue }>,
): void {
  for (const { row, col, value } of placements) {
    grid[row][col] = value;
    candidates[row][col] = [];

    for (let c = 0; c < GRID_SIZE; c++) {
      if (c === col) continue;
      candidates[row][c] = candidates[row][c].filter((v) => v !== value);
    }

    for (let r = 0; r < GRID_SIZE; r++) {
      if (r === row) continue;
      candidates[r][col] = candidates[r][col].filter((v) => v !== value);
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (r === row && c === col) continue;
        candidates[r][c] = candidates[r][c].filter((v) => v !== value);
      }
    }
  }
}
