import type { CandidatesGrid, CellValue, Deduction } from "../types";
import { Technique } from "../types";
import { cellsWithCandidate, getBoxUnits } from "./helpers";

export function findPointingPairs(
  candidates: CandidatesGrid,
): Deduction | null {
  for (let value = 1; value <= 9; value++) {
    const digit = value as CellValue;

    for (const box of getBoxUnits()) {
      const boxCells = cellsWithCandidate(candidates, box, digit);
      if (boxCells.length < 2) continue;

      const rows = new Set(boxCells.map(({ row }) => row));
      if (rows.size === 1) {
        const row = boxCells[0].row;
        const eliminations: Deduction["eliminations"] = [];

        for (let col = 0; col < 9; col++) {
          const inBox = box.cells.some(
            (cell) => cell.row === row && cell.col === col,
          );
          if (inBox) continue;

          if (candidates[row][col].includes(digit)) {
            eliminations.push({ row, col, values: [digit] });
          }
        }

        if (eliminations.length > 0) {
          return {
            technique: Technique.PointingPair,
            placements: [],
            eliminations,
            explanation: `${digit} in ${box.name} is confined to row ${row + 1}.`,
          };
        }
      }

      const cols = new Set(boxCells.map(({ col }) => col));
      if (cols.size === 1) {
        const col = boxCells[0].col;
        const eliminations: Deduction["eliminations"] = [];

        for (let row = 0; row < 9; row++) {
          const inBox = box.cells.some(
            (cell) => cell.row === row && cell.col === col,
          );
          if (inBox) continue;

          if (candidates[row][col].includes(digit)) {
            eliminations.push({ row, col, values: [digit] });
          }
        }

        if (eliminations.length > 0) {
          return {
            technique: Technique.PointingPair,
            placements: [],
            eliminations,
            explanation: `${digit} in ${box.name} is confined to column ${col + 1}.`,
          };
        }
      }
    }

    for (let row = 0; row < 9; row++) {
      const rowCells = [];
      for (let col = 0; col < 9; col++) {
        if (candidates[row][col].includes(digit)) {
          rowCells.push({ row, col });
        }
      }
      if (rowCells.length < 2) continue;

      const boxes = new Set(
        rowCells.map(({ row: r, col: c }) => Math.floor(r / 3) * 3 + Math.floor(c / 3)),
      );
      if (boxes.size !== 1) continue;

      const boxIndex = [...boxes][0];
      const boxRow = Math.floor(boxIndex / 3) * 3;
      const boxCol = (boxIndex % 3) * 3;
      const eliminations: Deduction["eliminations"] = [];

      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if (r === row) continue;
          if (candidates[r][c].includes(digit)) {
            eliminations.push({ row: r, col: c, values: [digit] });
          }
        }
      }

      if (eliminations.length > 0) {
        return {
          technique: Technique.PointingPair,
          placements: [],
          eliminations,
          explanation: `${digit} in row ${row + 1} is confined to one box.`,
        };
      }
    }

    for (let col = 0; col < 9; col++) {
      const colCells = [];
      for (let row = 0; row < 9; row++) {
        if (candidates[row][col].includes(digit)) {
          colCells.push({ row, col });
        }
      }
      if (colCells.length < 2) continue;

      const boxes = new Set(
        colCells.map(({ row: r, col: c }) => Math.floor(r / 3) * 3 + Math.floor(c / 3)),
      );
      if (boxes.size !== 1) continue;

      const boxIndex = [...boxes][0];
      const boxRow = Math.floor(boxIndex / 3) * 3;
      const boxCol = (boxIndex % 3) * 3;
      const eliminations: Deduction["eliminations"] = [];

      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if (c === col) continue;
          if (candidates[r][c].includes(digit)) {
            eliminations.push({ row: r, col: c, values: [digit] });
          }
        }
      }

      if (eliminations.length > 0) {
        return {
          technique: Technique.PointingPair,
          placements: [],
          eliminations,
          explanation: `${digit} in column ${col + 1} is confined to one box.`,
        };
      }
    }
  }

  return null;
}
