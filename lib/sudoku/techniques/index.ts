export { findNakedSingles, findHiddenSingles } from "./naked-hidden-singles";
export { findNakedPairs, findHiddenPairs } from "./pairs";
export { findPointingPairs } from "./pointing-pairs";
export { findXWing } from "./x-wing";

import type { CandidatesGrid, Deduction } from "../types";
import { Technique } from "../types";
import { findHiddenSingles, findNakedSingles } from "./naked-hidden-singles";
import { findHiddenPairs, findNakedPairs } from "./pairs";
import { findPointingPairs } from "./pointing-pairs";
import { findXWing } from "./x-wing";

const TECHNIQUE_FINDERS: Array<(candidates: CandidatesGrid) => Deduction | null> =
  [
    findNakedSingles,
    findHiddenSingles,
    findNakedPairs,
    findHiddenPairs,
    findPointingPairs,
    findXWing,
  ];

export function findNextDeduction(
  candidates: CandidatesGrid,
): Deduction | null {
  for (const finder of TECHNIQUE_FINDERS) {
    const deduction = finder(candidates);
    if (deduction) return deduction;
  }
  return null;
}

export const TECHNIQUE_ORDER: Technique[] = [
  Technique.NakedSingle,
  Technique.HiddenSingle,
  Technique.NakedPair,
  Technique.HiddenPair,
  Technique.PointingPair,
  Technique.XWing,
];

export function techniqueRank(technique: Technique): number {
  return TECHNIQUE_ORDER.indexOf(technique);
}
