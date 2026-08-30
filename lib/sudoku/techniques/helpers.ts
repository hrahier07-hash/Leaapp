import type { CellCoord, CellValue, CandidatesGrid } from "../types";
import { GRID_SIZE } from "../types";

export type Unit = {
  name: string;
  cells: CellCoord[];
};

export function getRowUnits(): Unit[] {
  return Array.from({ length: GRID_SIZE }, (_, row) => ({
    name: `row ${row + 1}`,
    cells: Array.from({ length: GRID_SIZE }, (_, col) => ({ row, col })),
  }));
}

export function getColUnits(): Unit[] {
  return Array.from({ length: GRID_SIZE }, (_, col) => ({
    name: `column ${col + 1}`,
    cells: Array.from({ length: GRID_SIZE }, (_, row) => ({ row, col })),
  }));
}

export function getBoxUnits(): Unit[] {
  const units: Unit[] = [];
  for (let box = 0; box < GRID_SIZE; box++) {
    const boxRow = Math.floor(box / 3) * 3;
    const boxCol = (box % 3) * 3;
    const cells: CellCoord[] = [];
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        cells.push({ row: r, col: c });
      }
    }
    units.push({ name: `box ${box + 1}`, cells });
  }
  return units;
}

export function getAllUnits(): Unit[] {
  return [...getRowUnits(), ...getColUnits(), ...getBoxUnits()];
}

export function sameCandidates(
  a: CellValue[],
  b: CellValue[],
): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((value, index) => value === sortedB[index]);
}

export function cellsWithCandidate(
  candidates: CandidatesGrid,
  unit: Unit,
  value: CellValue,
): CellCoord[] {
  return unit.cells.filter(({ row, col }) =>
    candidates[row][col].includes(value),
  );
}

export function emptyCellsInUnit(
  candidates: CandidatesGrid,
  unit: Unit,
): CellCoord[] {
  return unit.cells.filter(({ row, col }) => candidates[row][col].length > 0);
}
