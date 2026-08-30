import getStroke from "perfect-freehand";

import type { Point, Stroke } from "./types";

const MNIST_SIZE = 28;
const STROKE_OPTIONS = {
  size: 14,
  thinning: 0.6,
  smoothing: 0.65,
  streamline: 0.35,
};

export function smoothStroke(stroke: Point[]): Point[] {
  if (stroke.length < 2) return stroke;

  const input = stroke.map((p) => [p.x, p.y]);
  const outline = getStroke(input, STROKE_OPTIONS);

  if (outline.length === 0) return stroke;

  return outline.map(([x, y]) => ({ x, y }));
}

export function smoothStrokes(strokes: Stroke[]): Stroke[] {
  return strokes
    .filter((s) => s.length > 0)
    .map((stroke) => {
      if (stroke.length < 3) return stroke;
      const smoothed = smoothStroke(stroke);
      return smoothed.length > 0 ? smoothed : stroke;
    });
}

type BoundingBox = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

function getBounds(strokes: Stroke[]): BoundingBox | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const stroke of strokes) {
    for (const p of stroke) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
  }

  if (!Number.isFinite(minX)) return null;

  return { minX, minY, maxX, maxY };
}

/** Rendu MNIST : fond noir, chiffre blanc, 28×28 */
export function renderStrokesToMnistArray(
  strokes: Stroke[],
  canvasWidth: number,
  canvasHeight: number,
): Float32Array | null {
  if (strokes.every((s) => s.length === 0)) return null;

  const smoothed = smoothStrokes(strokes);
  const bounds = getBounds(smoothed);
  if (!bounds) return null;

  const source = document.createElement("canvas");
  source.width = canvasWidth;
  source.height = canvasHeight;
  const sctx = source.getContext("2d");
  if (!sctx) return null;

  sctx.clearRect(0, 0, canvasWidth, canvasHeight);
  sctx.lineCap = "round";
  sctx.lineJoin = "round";
  sctx.strokeStyle = "#ffffff";
  sctx.fillStyle = "#ffffff";

  for (const stroke of smoothed) {
    if (stroke.length === 1) {
      sctx.beginPath();
      sctx.arc(stroke[0].x, stroke[0].y, 5, 0, Math.PI * 2);
      sctx.fill();
      continue;
    }

    sctx.beginPath();
    sctx.lineWidth = 10;
    sctx.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i++) {
      sctx.lineTo(stroke[i].x, stroke[i].y);
    }
    sctx.stroke();
  }

  const boxWidth = bounds.maxX - bounds.minX || 1;
  const boxHeight = bounds.maxY - bounds.minY || 1;
  const boxSize = Math.max(boxWidth, boxHeight);
  const padding = boxSize * 0.2;

  const dest = document.createElement("canvas");
  dest.width = MNIST_SIZE;
  dest.height = MNIST_SIZE;
  const dctx = dest.getContext("2d");
  if (!dctx) return null;

  dctx.fillStyle = "#000000";
  dctx.fillRect(0, 0, MNIST_SIZE, MNIST_SIZE);

  const contentSize = MNIST_SIZE - 4;
  const scale = contentSize / (boxSize + padding * 2);
  const offsetX =
    (MNIST_SIZE - (boxWidth + padding * 2) * scale) / 2 -
    (bounds.minX - padding) * scale;
  const offsetY =
    (MNIST_SIZE - (boxHeight + padding * 2) * scale) / 2 -
    (bounds.minY - padding) * scale;

  dctx.strokeStyle = "#ffffff";
  dctx.fillStyle = "#ffffff";
  dctx.lineCap = "round";
  dctx.lineJoin = "round";

  for (const stroke of smoothed) {
    if (stroke.length === 1) {
      dctx.beginPath();
      dctx.arc(
        stroke[0].x * scale + offsetX,
        stroke[0].y * scale + offsetY,
        1.2,
        0,
        Math.PI * 2,
      );
      dctx.fill();
      continue;
    }

    dctx.beginPath();
    dctx.lineWidth = Math.max(1.8, 10 * scale);
    dctx.moveTo(stroke[0].x * scale + offsetX, stroke[0].y * scale + offsetY);
    for (let i = 1; i < stroke.length; i++) {
      dctx.lineTo(stroke[i].x * scale + offsetX, stroke[i].y * scale + offsetY);
    }
    dctx.stroke();
  }

  const image = dctx.getImageData(0, 0, MNIST_SIZE, MNIST_SIZE);
  const pixels = new Float32Array(MNIST_SIZE * MNIST_SIZE);

  for (let i = 0; i < MNIST_SIZE * MNIST_SIZE; i++) {
    pixels[i] = image.data[i * 4] / 255;
  }

  return pixels;
}

export { MNIST_SIZE };
