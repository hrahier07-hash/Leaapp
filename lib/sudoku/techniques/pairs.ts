import type { CandidatesGrid, CellValue, Deduction } from "../types";
import { Technique } from "../types";
import {
  emptyCellsInUnit,
  getAllUnits,
  sameCandidates,
} from "./helpers";

export function findNakedPairs(
  candidates: CandidatesGrid,
): Deduction | null {
  for (const unit of getAllUnits()) {
    const empties = emptyCellsInUnit(candidates, unit);

    for (let i = 0; i < empties.length; i++) {
      for (let j = i + 1; j < empties.length; j++) {
        const a = empties[i];
        const b = empties[j];
        const pairA = candidates[a.row][a.col];
        const pairB = candidates[b.row][b.col];

        if (pairA.length !== 2 || pairB.length !== 2) continue;
        if (!sameCandidates(pairA, pairB)) continue;

        const eliminations: Deduction["eliminations"] = [];
        for (const { row, col } of unit.cells) {
          if (
            (row === a.row && col === a.col) ||
            (row === b.row && col === b.col)
          ) {
            continue;
          }

          const overlap = candidates[row][col].filter((value) =>
            pairA.includes(value),
          );
          if (overlap.length > 0) {
            eliminations.push({ row, col, values: overlap });
          }
        }

        if (eliminations.length > 0) {
          return {
            technique: Technique.NakedPair,
            placements: [],
            eliminations,
            explanation: `Naked pair {${pairA.join(",")}} in ${unit.name}.`,
          };
        }
      }
    }
  }

  return null;
}

export function findHiddenPairs(
  candidates: CandidatesGrid,
): Deduction | null {
  for (const unit of getAllUnits()) {
    const empties = emptyCellsInUnit(candidates, unit);
    if (empties.length < 2) continue;

    for (let v1 = 1; v1 <= 8; v1++) {
      for (let v2 = v1 + 1; v2 <= 9; v2++) {
        const digit1 = v1 as CellValue;
        const digit2 = v2 as CellValue;

        const cellsForPair = empties.filter(({ row, col }) => {
          const cellCandidates = candidates[row][col];
          return cellCandidates.includes(digit1) || cellCandidates.includes(digit2);
        });

        if (cellsForPair.length !== 2) continue;

        const [cellA, cellB] = cellsForPair;
        const eliminations: Deduction["eliminations"] = [];

        for (const { row, col } of cellsForPair) {
          const extras = candidates[row][col].filter(
            (value) => value !== digit1 && value !== digit2,
          );
          if (extras.length > 0) {
            eliminations.push({ row, col, values: extras });
          }
        }

        if (eliminations.length > 0) {
          return {
            technique: Technique.HiddenPair,
            placements: [],
            eliminations,
            explanation: `Hidden pair {${digit1},${digit2}} in ${unit.name} at (${cellA.row + 1},${cellA.col + 1}) and (${cellB.row + 1},${cellB.col + 1}).`,
          };
        }
      }
    }
  }

  return null;
}
