import type { CandidatesGrid, Deduction } from "../types";
import { Technique } from "../types";
import { getAllUnits } from "./helpers";

export function findNakedSingles(
  candidates: CandidatesGrid,
): Deduction | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cellCandidates = candidates[row][col];
      if (cellCandidates.length === 1) {
        const value = cellCandidates[0];
        return {
          technique: Technique.NakedSingle,
          placements: [{ row, col, value }],
          eliminations: [],
          explanation: `Cell (${row + 1},${col + 1}) has only candidate ${value}.`,
        };
      }
    }
  }

  return null;
}

export function findHiddenSingles(
  candidates: CandidatesGrid,
): Deduction | null {
  for (const unit of getAllUnits()) {
    for (let value = 1; value <= 9; value++) {
      const digit = value as CandidatesGrid[0][0][0];
      const cells = unit.cells.filter(({ row, col }) =>
        candidates[row][col].includes(digit),
      );

      if (cells.length === 1) {
        const { row, col } = cells[0];
        return {
          technique: Technique.HiddenSingle,
          placements: [{ row, col, value: digit }],
          eliminations: [],
          explanation: `${digit} can only go in one cell of ${unit.name}.`,
        };
      }
    }
  }

  return null;
}
