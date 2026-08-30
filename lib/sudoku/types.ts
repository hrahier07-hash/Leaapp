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
