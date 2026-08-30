export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Grid = CellValue[][];

export type Point = { x: number; y: number };

export type Stroke = Point[];

export type RecognitionResult = {
  digit: CellValue | null;
  confidence: number;
};

export const GRID_SIZE = 9;

export const EMPTY = 0 as const;

export type Difficulty =
  | "facile"
  | "moyen"
  | "difficile"
  | "expert"
  | "diabolique";

export enum Technique {
  NakedSingle = "naked_single",
  HiddenSingle = "hidden_single",
  NakedPair = "naked_pair",
  HiddenPair = "hidden_pair",
  PointingPair = "pointing_pair",
  XWing = "x_wing",
}

export type CellCoord = { row: number; col: number };

export type Placement = {
  row: number;
  col: number;
  value: CellValue;
};

export type Elimination = {
  row: number;
  col: number;
  values: CellValue[];
};

export type Deduction = {
  technique: Technique;
  placements: Placement[];
  eliminations: Elimination[];
  explanation: string;
};

/** Candidate possibilities per empty cell (9×9 grid of digit lists). */
export type CandidatesGrid = CellValue[][][];

export type HintPlacement = {
  kind: "placement";
  technique: Technique;
  row: number;
  col: number;
  value: CellValue;
  explanation: string;
};

export type HintElimination = {
  kind: "elimination";
  technique: Technique;
  row: number;
  col: number;
  values: CellValue[];
  explanation: string;
};

export type Hint = HintPlacement | HintElimination;
