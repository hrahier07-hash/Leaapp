import {
  applyEliminations,
  applyPlacements,
  computeCandidates,
} from "./candidates";
import { cloneGrid } from "./grid-utils";
import { solveGrid } from "./solver";
import {
  findNextDeduction,
  techniqueRank,
} from "./techniques";
import type { Difficulty, Grid, Technique } from "./types";
import { EMPTY } from "./types";

function isSolved(grid: Grid): boolean {
  return grid.every((row) => row.every((cell) => cell !== EMPTY));
}

function difficultyFromTechnique(technique: Technique): Difficulty {
  switch (technique) {
    case "naked_single":
    case "hidden_single":
      return "facile";
    case "naked_pair":
    case "hidden_pair":
      return "moyen";
    case "pointing_pair":
      return "difficile";
    case "x_wing":
      return "expert";
    default:
      return "diabolique";
  }
}

function maxDifficulty(a: Difficulty, b: Difficulty): Difficulty {
  const order: Difficulty[] = [
    "facile",
    "moyen",
    "difficile",
    "expert",
    "diabolique",
  ];
  return order.indexOf(a) >= order.indexOf(b) ? a : b;
}

export function classifyDifficulty(grid: Grid): Difficulty {
  if (solveGrid(grid) === null) {
    return "diabolique";
  }

  const working = cloneGrid(grid);
  let candidates = computeCandidates(working);
  let hardest: Difficulty = "facile";

  while (!isSolved(working)) {
    const deduction = findNextDeduction(candidates);
    if (!deduction) {
      return "diabolique";
    }

    hardest = maxDifficulty(
      hardest,
      difficultyFromTechnique(deduction.technique),
    );

    if (deduction.placements.length > 0) {
      applyPlacements(working, candidates, deduction.placements);
    }

    if (deduction.eliminations.length > 0) {
      const changed = applyEliminations(candidates, deduction.eliminations);
      if (deduction.placements.length === 0 && !changed) {
        return "diabolique";
      }
    }

    if (deduction.placements.length === 0) {
      continue;
    }

    candidates = computeCandidates(working);
  }

  return hardest;
}

export function getRequiredTechniques(grid: Grid): Technique[] {
  const working = cloneGrid(grid);
  let candidates = computeCandidates(working);
  const used = new Set<Technique>();

  while (!isSolved(working)) {
    const deduction = findNextDeduction(candidates);
    if (!deduction) break;

    used.add(deduction.technique);

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

  return [...used].sort(
    (a, b) => techniqueRank(a) - techniqueRank(b),
  );
}
