import type { Point } from "./types";

const SAMPLE_POINTS = 64;

/** Templates multi-traits pour chiffres 1–9 (plusieurs variantes) */
const PATH_TEMPLATES: Record<number, Point[][]> = {
  1: [
    line(0.5, 0.08, 0.5, 0.92),
    line(0.45, 0.08, 0.55, 0.92),
  ],
  2: [
    path([
      [0.12, 0.18],
      [0.88, 0.18],
      [0.88, 0.48],
      [0.12, 0.48],
      [0.12, 0.88],
      [0.88, 0.88],
    ]),
    path([
      [0.15, 0.12],
      [0.85, 0.12],
      [0.85, 0.5],
      [0.15, 0.5],
      [0.15, 0.9],
      [0.85, 0.9],
    ]),
  ],
  3: [
    path([
      [0.15, 0.12],
      [0.85, 0.12],
      [0.85, 0.5],
      [0.2, 0.5],
      [0.85, 0.5],
      [0.85, 0.88],
      [0.15, 0.88],
    ]),
    path([
      [0.2, 0.15],
      [0.8, 0.15],
      [0.8, 0.48],
      [0.25, 0.48],
      [0.8, 0.52],
      [0.8, 0.85],
      [0.2, 0.85],
    ]),
  ],
  4: [
    path([
      [0.75, 0.08],
      [0.75, 0.92],
      [0.12, 0.55],
      [0.92, 0.55],
    ]),
    path([
      [0.65, 0.1],
      [0.65, 0.55],
      [0.15, 0.55],
      [0.9, 0.55],
    ]),
  ],
  5: [
    path([
      [0.85, 0.12],
      [0.15, 0.12],
      [0.15, 0.48],
      [0.85, 0.48],
      [0.85, 0.88],
      [0.15, 0.88],
    ]),
    path([
      [0.88, 0.15],
      [0.12, 0.15],
      [0.12, 0.5],
      [0.88, 0.5],
      [0.88, 0.85],
      [0.12, 0.85],
    ]),
  ],
  6: [
    path([
      [0.82, 0.18],
      [0.35, 0.18],
      [0.18, 0.45],
      [0.18, 0.75],
      [0.45, 0.88],
      [0.72, 0.75],
      [0.72, 0.52],
      [0.35, 0.52],
    ]),
    path([
      [0.78, 0.22],
      [0.3, 0.22],
      [0.15, 0.5],
      [0.15, 0.78],
      [0.42, 0.88],
      [0.68, 0.78],
      [0.68, 0.55],
      [0.32, 0.55],
    ]),
  ],
  7: [
    path([
      [0.12, 0.12],
      [0.88, 0.12],
      [0.45, 0.92],
    ]),
    path([
      [0.15, 0.15],
      [0.85, 0.15],
      [0.55, 0.9],
    ]),
  ],
  8: [
    path([
      [0.5, 0.1],
      [0.82, 0.28],
      [0.82, 0.45],
      [0.5, 0.55],
      [0.18, 0.45],
      [0.18, 0.28],
      [0.5, 0.1],
      [0.5, 0.55],
      [0.82, 0.72],
      [0.5, 0.9],
      [0.18, 0.72],
      [0.5, 0.55],
    ]),
  ],
  9: [
    path([
      [0.72, 0.78],
      [0.72, 0.32],
      [0.5, 0.12],
      [0.25, 0.32],
      [0.25, 0.55],
      [0.5, 0.65],
      [0.78, 0.55],
    ]),
    path([
      [0.68, 0.75],
      [0.68, 0.35],
      [0.5, 0.15],
      [0.28, 0.35],
      [0.28, 0.52],
      [0.5, 0.62],
      [0.72, 0.52],
    ]),
  ],
};

function line(x1: number, y1: number, x2: number, y2: number): Point[] {
  return resamplePoints(
    [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
    ],
    SAMPLE_POINTS,
  );
}

function path(coords: [number, number][]): Point[] {
  return resamplePoints(
    coords.map(([x, y]) => ({ x, y })),
    SAMPLE_POINTS,
  );
}

function resamplePoints(points: Point[], n: number): Point[] {
  if (points.length === 0) return [];
  if (points.length === 1) {
    return Array.from({ length: n }, () => ({ ...points[0] }));
  }

  const lengths: number[] = [0];
  let total = 0;

  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].y - points[i - 1].y,
    );
    lengths.push(total);
  }

  if (total === 0) {
    return Array.from({ length: n }, () => ({ ...points[0] }));
  }

  const interval = total / (n - 1);
  const resampled: Point[] = [{ ...points[0] }];
  let segment = 1;

  for (let i = 1; i < n - 1; i++) {
    const target = i * interval;
    while (segment < lengths.length - 1 && lengths[segment] < target) {
      segment++;
    }
    const start = points[segment - 1];
    const end = points[segment];
    const span = lengths[segment] - lengths[segment - 1] || 1;
    const t = (target - lengths[segment - 1]) / span;
    resampled.push({
      x: start.x + t * (end.x - start.x),
      y: start.y + t * (end.y - start.y),
    });
  }

  resampled.push({ ...points[points.length - 1] });
  return resampled;
}

function flattenStrokes(strokes: Point[][]): Point[] {
  const merged: Point[] = [];
  for (const stroke of strokes) {
    if (stroke.length === 0) continue;
    merged.push(...stroke);
  }
  return merged;
}

function normalizePoints(points: Point[]): Point[] {
  if (points.length === 0) return [];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }

  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const size = Math.max(width, height);

  return points.map((p) => ({
    x: (p.x - minX - (width - size) / 2) / size,
    y: (p.y - minY - (height - size) / 2) / size,
  }));
}

function pathDistance(a: Point[], b: Point[]): number {
  const len = Math.min(a.length, b.length);
  if (len === 0) return Infinity;

  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += Math.hypot(a[i].x - b[i].x, a[i].y - b[i].y);
  }
  return sum / len;
}

export function recognizeByPath(strokes: Point[][]): {
  digit: number | null;
  confidence: number;
} {
  const flat = flattenStrokes(strokes);
  if (flat.length < 3) return { digit: null, confidence: 0 };

  const candidate = resamplePoints(normalizePoints(flat), SAMPLE_POINTS);

  let bestDigit: number | null = null;
  let bestDistance = Infinity;

  for (let digit = 1; digit <= 9; digit++) {
    for (const template of PATH_TEMPLATES[digit]) {
      const distance = pathDistance(candidate, template);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestDigit = digit;
      }
    }
  }

  const confidence = Math.max(0, 1 - bestDistance / 0.55);
  if (confidence < 0.28) return { digit: null, confidence };

  return { digit: bestDigit, confidence };
}
