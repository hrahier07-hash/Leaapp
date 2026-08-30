import type { CandidatesGrid, CellValue, Deduction } from "../types";
import { Technique } from "../types";

function findRowXWing(
  candidates: CandidatesGrid,
  digit: CellValue,
): Deduction | null {
  const rowToCols: number[][] = Array.from({ length: 9 }, () => []);

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (candidates[row][col].includes(digit)) {
        rowToCols[row].push(col);
      }
    }
  }

  const candidateRows = rowToCols
    .map((cols, row) => ({ row, cols }))
    .filter(({ cols }) => cols.length === 2);

  for (let i = 0; i < candidateRows.length; i++) {
    for (let j = i + 1; j < candidateRows.length; j++) {
      const rowA = candidateRows[i];
      const rowB = candidateRows[j];

      if (rowA.cols[0] !== rowB.cols[0] || rowA.cols[1] !== rowB.cols[1]) {
        continue;
      }

      const eliminations: Deduction["eliminations"] = [];
      for (const col of rowA.cols) {
        for (let row = 0; row < 9; row++) {
          if (row === rowA.row || row === rowB.row) continue;
          if (candidates[row][col].includes(digit)) {
            eliminations.push({ row, col, values: [digit] });
          }
        }
      }

      if (eliminations.length > 0) {
        return {
          technique: Technique.XWing,
          placements: [],
          eliminations,
          explanation: `X-Wing for ${digit} in rows ${rowA.row + 1} and ${rowB.row + 1}.`,
        };
      }
    }
  }

  return null;
}

function findColXWing(
  candidates: CandidatesGrid,
  digit: CellValue,
): Deduction | null {
  const colToRows: number[][] = Array.from({ length: 9 }, () => []);

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (candidates[row][col].includes(digit)) {
        colToRows[col].push(row);
      }
    }
  }

  const candidateCols = colToRows
    .map((rows, col) => ({ col, rows }))
    .filter(({ rows }) => rows.length === 2);

  for (let i = 0; i < candidateCols.length; i++) {
    for (let j = i + 1; j < candidateCols.length; j++) {
      const colA = candidateCols[i];
      const colB = candidateCols[j];

      if (colA.rows[0] !== colB.rows[0] || colA.rows[1] !== colB.rows[1]) {
        continue;
      }

      const eliminations: Deduction["eliminations"] = [];
      for (const row of colA.rows) {
        for (let col = 0; col < 9; col++) {
          if (col === colA.col || col === colB.col) continue;
          if (candidates[row][col].includes(digit)) {
            eliminations.push({ row, col, values: [digit] });
          }
        }
      }

      if (eliminations.length > 0) {
        return {
          technique: Technique.XWing,
          placements: [],
          eliminations,
          explanation: `X-Wing for ${digit} in columns ${colA.col + 1} and ${colB.col + 1}.`,
        };
      }
    }
  }

  return null;
}

export function findXWing(candidates: CandidatesGrid): Deduction | null {
  for (let value = 1; value <= 9; value++) {
    const digit = value as CellValue;
    const rowPattern = findRowXWing(candidates, digit);
    if (rowPattern) return rowPattern;

    const colPattern = findColXWing(candidates, digit);
    if (colPattern) return colPattern;
  }

  return null;
}
