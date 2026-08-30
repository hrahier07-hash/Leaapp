import { recognizeByBitmap } from "./bitmap-recognizer";
import { recognizeByPath } from "./path-recognizer";
import { renderStrokesToMnistArray } from "./stroke-renderer";
import type { CellValue, RecognitionResult, Stroke } from "./types";

function mergeResults(
  results: Array<{ digit: number | null; confidence: number; weight: number }>,
): RecognitionResult {
  const scores = new Map<number, number>();

  for (const { digit, confidence, weight } of results) {
    if (digit === null || digit < 1 || digit > 9) continue;
    scores.set(digit, (scores.get(digit) ?? 0) + confidence * weight);
  }

  let bestDigit: CellValue | null = null;
  let bestScore = 0;

  for (const [digit, score] of scores) {
    if (score > bestScore) {
      bestScore = score;
      bestDigit = digit as CellValue;
    }
  }

  if (bestDigit === null) {
    return { digit: null, confidence: 0 };
  }

  const confidence = Math.min(1, bestScore);
  if (confidence < 0.25) {
    return { digit: null, confidence };
  }

  return { digit: bestDigit, confidence };
}

export async function recognizeDigitAsync(
  strokes: Stroke[],
  canvasWidth: number,
  canvasHeight: number,
): Promise<RecognitionResult> {
  return recognizeDigit(strokes, canvasWidth, canvasHeight);
}

/** Reconnaissance hybride : comparaison pixel (70%) + forme du trait (30%) */
export function recognizeDigit(
  strokes: Stroke[],
  canvasWidth: number,
  canvasHeight: number,
): RecognitionResult {
  if (strokes.every((s) => s.length === 0)) {
    return { digit: null, confidence: 0 };
  }

  const pathResult = recognizeByPath(strokes);
  const pixels = renderStrokesToMnistArray(strokes, canvasWidth, canvasHeight);

  const results: Array<{
    digit: number | null;
    confidence: number;
    weight: number;
  }> = [{ ...pathResult, weight: 0.3 }];

  if (pixels) {
    results.push({ ...recognizeByBitmap(pixels), weight: 0.7 });
  }

  return mergeResults(results);
}

export function preloadDigitModel(): void {
  if (typeof window === "undefined") return;
  // Pré-génère les templates bitmap en arrière-plan
  import("./bitmap-recognizer").then(({ getBitmapTemplates }) => {
    getBitmapTemplates();
  });
}
