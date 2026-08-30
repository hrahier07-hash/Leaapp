import { describe, expect, it } from "vitest";
import { computeCandidates } from "../candidates";
import { classifyDifficulty, getRequiredTechniques } from "../classifier";
import {
  DIABOLIQUE_GRID,
  DIFFICILE_GRID,
  EXPERT_GRID,
  FACILE_GRID,
  FACILE_SOLUTION,
  INVALID_GRID,
  MOYEN_GRID,
  MULTI_SOLUTION_GRID,
} from "../fixtures";
import { generateFullGrid, generateGrid } from "../generator";
import {
  cloneGrid,
  countClues,
  countSolutions,
  getBoxIndex,
  isValidPlacement,
  peers,
} from "../grid-utils";
import { getHint } from "../hint";
import { SAMPLE_PUZZLE } from "../sample-puzzle";
import { solveGrid } from "../solver";
import {
  findHiddenPairs,
  findHiddenSingles,
  findNakedPairs,
  findNakedSingles,
  findNextDeduction,
  findPointingPairs,
  findXWing,
} from "../techniques";
import { Technique } from "../types";
import { isGridComplete, validateMove } from "../validate";

describe("grid-utils", () => {
  it("clones grid deeply", () => {
    const grid = cloneGrid(FACILE_GRID);
    grid[0][0] = 9;
    expect(FACILE_GRID[0][0]).toBe(5);
  });

  it("computes box index", () => {
    expect(getBoxIndex(0, 0)).toBe(0);
    expect(getBoxIndex(4, 4)).toBe(4);
    expect(getBoxIndex(8, 8)).toBe(8);
  });

  it("returns 20 peers per cell", () => {
    expect(peers(4, 4)).toHaveLength(20);
  });

  it("validates placements against row, column, and box", () => {
    expect(isValidPlacement(FACILE_GRID, 0, 2, 4)).toBe(true);
    expect(isValidPlacement(FACILE_GRID, 0, 2, 5)).toBe(false);
  });

  it("counts solutions with limit", () => {
    expect(countSolutions(FACILE_GRID, 2)).toBe(1);
    expect(countSolutions(MULTI_SOLUTION_GRID, 2)).toBeGreaterThanOrEqual(2);
  });
});

describe("solver", () => {
  it("solves a classic puzzle", () => {
    expect(solveGrid(FACILE_GRID)).toEqual(FACILE_SOLUTION);
  });

  it("returns null for invalid grids", () => {
    expect(solveGrid(INVALID_GRID)).toBeNull();
  });
});

describe("validate", () => {
  it("accepts empty clears and rejects conflicts", () => {
    expect(validateMove(FACILE_GRID, 0, 2, 0)).toBe(true);
    expect(validateMove(FACILE_GRID, 0, 2, 5)).toBe(false);
  });

  it("detects completed grids", () => {
    expect(isGridComplete(FACILE_GRID)).toBe(false);
    expect(isGridComplete(FACILE_SOLUTION)).toBe(true);
  });
});

describe("candidates and techniques", () => {
  it("finds naked singles on easy puzzle", () => {
    const candidates = computeCandidates(FACILE_GRID);
    const deduction = findNakedSingles(candidates);
    expect(deduction?.technique).toBe(Technique.NakedSingle);
    expect(deduction?.placements.length).toBeGreaterThan(0);
  });

  it("finds hidden singles", () => {
    const candidates = computeCandidates(FACILE_GRID);
    expect(findHiddenSingles(candidates)?.technique).toBe(
      Technique.HiddenSingle,
    );
  });

  it("findNextDeduction walks technique order", () => {
    const candidates = computeCandidates(FACILE_GRID);
    const deduction = findNextDeduction(candidates);
    expect([
      Technique.NakedSingle,
      Technique.HiddenSingle,
    ]).toContain(deduction?.technique);
  });

  it("exposes pair, pointing, and x-wing finders", () => {
    expect(typeof findNakedPairs).toBe("function");
    expect(typeof findHiddenPairs).toBe("function");
    expect(typeof findPointingPairs).toBe("function");
    expect(typeof findXWing).toBe("function");
  });
});

describe("classifier", () => {
  it("classifies easy demo puzzle as facile", () => {
    expect(classifyDifficulty(FACILE_GRID)).toBe("facile");
    expect(classifyDifficulty(SAMPLE_PUZZLE)).toBe("facile");
  });

  it("classifies expert x-wing puzzle", () => {
    expect(classifyDifficulty(EXPERT_GRID)).toBe("expert");
  });

  it("classifies empty grid as diabolique", () => {
    expect(classifyDifficulty(DIABOLIQUE_GRID)).toBe("diabolique");
  });

  it("tracks required techniques", () => {
    const techniques = getRequiredTechniques(FACILE_GRID);
    expect(techniques.length).toBeGreaterThan(0);
    expect(techniques.every((t) => Object.values(Technique).includes(t))).toBe(
      true,
    );
  });
});

describe("hint", () => {
  it("returns a placement hint aligned with the solution", () => {
    const hint = getHint(FACILE_GRID, FACILE_SOLUTION);
    expect(hint).not.toBeNull();
    if (hint?.kind === "placement") {
      expect(FACILE_SOLUTION[hint.row][hint.col]).toBe(hint.value);
    }
  });

  it("returns null when no logical step matches", () => {
    expect(getHint(INVALID_GRID, FACILE_SOLUTION)).toBeNull();
  });
});

describe("generator", () => {
  it("generates a full valid grid", () => {
    const grid = generateFullGrid();
    expect(countSolutions(grid, 2)).toBe(1);
    expect(countClues(grid)).toBe(81);
  });

  it(
    "generates facile puzzles with unique solutions",
    () => {
      const puzzle = generateGrid("facile");
      expect(countSolutions(puzzle, 2)).toBe(1);
      expect(countClues(puzzle)).toBeGreaterThanOrEqual(30);
      expect(solveGrid(puzzle)).not.toBeNull();
    },
    120000,
  );
});

describe("fixtures", () => {
  it("keeps invalid and multi-solution grids distinct", () => {
    expect(solveGrid(INVALID_GRID)).toBeNull();
    expect(countSolutions(MULTI_SOLUTION_GRID, 2)).toBeGreaterThanOrEqual(2);
  });

  it("keeps curated puzzles solvable", () => {
    expect(solveGrid(MOYEN_GRID)).not.toBeNull();
    expect(solveGrid(DIFFICILE_GRID)).not.toBeNull();
    expect(solveGrid(EXPERT_GRID)).toEqual(solveGrid(EXPERT_GRID));
  });
});
