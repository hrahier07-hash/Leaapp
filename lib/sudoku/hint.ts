import {
  applyEliminations,
  applyPlacements,
  computeCandidates,
} from "./candidates";
import { cloneGrid } from "./grid-utils";
import { findNextDeduction } from "./techniques";
import type { Deduction, Grid, Hint } from "./types";
import { EMPTY } from "./types";

function deductionMatchesSolution(
  deduction: Deduction,
  solution: Grid,
): boolean {
  for (const { row, col, value } of deduction.placements) {
    if (solution[row][col] !== value) return false;
  }

  for (const { row, col, values } of deduction.eliminations) {
    for (const value of values) {
      if (solution[row][col] === value) return false;
    }
  }

  return true;
}

function deductionToHint(deduction: Deduction): Hint | null {
  if (deduction.placements.length > 0) {
    const { row, col, value } = deduction.placements[0];
    return {
      kind: "placement",
      technique: deduction.technique,
      row,
      col,
      value,
      explanation: deduction.explanation,
    };
  }

  if (deduction.eliminations.length > 0) {
    const { row, col, values } = deduction.eliminations[0];
    return {
      kind: "elimination",
      technique: deduction.technique,
      row,
      col,
      values,
      explanation: deduction.explanation,
    };
  }

  return null;
}

function isSolved(grid: Grid): boolean {
  return grid.every((row) => row.every((cell) => cell !== EMPTY));
}

export function getHint(grid: Grid, solution: Grid): Hint | null {
  const working = cloneGrid(grid);
  let candidates = computeCandidates(working);

  while (!isSolved(working)) {
    const deduction = findNextDeduction(candidates);
    if (!deduction) return null;

    if (deductionMatchesSolution(deduction, solution)) {
      return deductionToHint(deduction);
    }

    if (deduction.placements.length > 0) {
      applyPlacements(working, candidates, deduction.placements);
    }

    if (deduction.eliminations.length > 0) {
      const changed = applyEliminations(candidates, deduction.eliminations);
      if (deduction.placements.length === 0 && !changed) {
        break;
      }
    }

    if (deduction.placements.length === 0) {
      continue;
    }

    candidates = computeCandidates(working);
  }

  return null;
}

export function findAllHints(grid: Grid, solution: Grid): Hint[] {
  const hints: Hint[] = [];
  const working = cloneGrid(grid);
  let candidates = computeCandidates(working);

  while (!isSolved(working)) {
    const deduction = findNextDeduction(candidates);
    if (!deduction) break;

    if (deductionMatchesSolution(deduction, solution)) {
      const hint = deductionToHint(deduction);
      if (hint) hints.push(hint);
    }

    if (deduction.placements.length > 0) {
      applyPlacements(working, candidates, deduction.placements);
    }

    if (deduction.eliminations.length > 0) {
      const changed = applyEliminations(candidates, deduction.eliminations);
      if (deduction.placements.length === 0 && !changed) {
        break;
      }
    }

    if (deduction.placements.length === 0) {
      continue;
    }

    candidates = computeCandidates(working);
  }

  return hints;
}
