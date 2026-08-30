import { MNIST_SIZE } from "./stroke-renderer";

const FONTS = [
  "bold 22px Arial, sans-serif",
  "bold 20px Helvetica, sans-serif",
  "bold 21px Georgia, serif",
  "600 20px system-ui, sans-serif",
];

const ROTATIONS = [-12, -6, 0, 6, 12];
const SHIFTS = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
];

let cachedTemplates: Map<number, Float32Array[]> | null = null;

function extractPixels(ctx: CanvasRenderingContext2D): Float32Array {
  const image = ctx.getImageData(0, 0, MNIST_SIZE, MNIST_SIZE);
  const pixels = new Float32Array(MNIST_SIZE * MNIST_SIZE);

  for (let i = 0; i < MNIST_SIZE * MNIST_SIZE; i++) {
    pixels[i] = image.data[i * 4] / 255;
  }

  return pixels;
}

export function getBitmapTemplates(): Map<number, Float32Array[]> {
  if (cachedTemplates) return cachedTemplates;

  const canvas = document.createElement("canvas");
  canvas.width = MNIST_SIZE;
  canvas.height = MNIST_SIZE;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    cachedTemplates = new Map();
    return cachedTemplates;
  }

  const templates = new Map<number, Float32Array[]>();

  for (let digit = 1; digit <= 9; digit++) {
    const variants: Float32Array[] = [];

    for (const font of FONTS) {
      for (const rotation of ROTATIONS) {
        for (const shift of SHIFTS) {
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, MNIST_SIZE, MNIST_SIZE);
          ctx.fillStyle = "#ffffff";
          ctx.font = font;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.save();
          ctx.translate(MNIST_SIZE / 2 + shift.x, MNIST_SIZE / 2 + shift.y);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.fillText(String(digit), 0, 1);
          ctx.restore();

          variants.push(extractPixels(ctx));
        }
      }
    }

    templates.set(digit, variants);
  }

  cachedTemplates = templates;
  return templates;
}

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return dot / denom;
}

function normalizedMse(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return sum / a.length;
}

function invertPixels(pixels: Float32Array): Float32Array {
  const inverted = new Float32Array(pixels.length);
  for (let i = 0; i < pixels.length; i++) {
    inverted[i] = 1 - pixels[i];
  }
  return inverted;
}

function enhanceContrast(pixels: Float32Array): Float32Array {
  const enhanced = new Float32Array(pixels.length);
  for (let i = 0; i < pixels.length; i++) {
    enhanced[i] = pixels[i] > 0.15 ? Math.min(1, pixels[i] * 1.35) : 0;
  }
  return enhanced;
}

export function recognizeByBitmap(pixels: Float32Array): {
  digit: number | null;
  confidence: number;
} {
  const templates = getBitmapTemplates();
  if (templates.size === 0) return { digit: null, confidence: 0 };

  const candidates = [
    enhanceContrast(pixels),
    enhanceContrast(invertPixels(pixels)),
  ];

  let bestDigit: number | null = null;
  let bestScore = -Infinity;

  for (let digit = 1; digit <= 9; digit++) {
    const variants = templates.get(digit) ?? [];

    for (const candidate of candidates) {
      for (const template of variants) {
        const cosine = cosineSimilarity(candidate, template);
        const mseScore = 1 - normalizedMse(candidate, template);
        const score = cosine * 0.65 + mseScore * 0.35;

        if (score > bestScore) {
          bestScore = score;
          bestDigit = digit;
        }
      }
    }
  }

  const confidence = Math.max(0, Math.min(1, (bestScore - 0.35) / 0.55));
  if (confidence < 0.32 || bestDigit === null) {
    return { digit: null, confidence };
  }

  return { digit: bestDigit, confidence };
}
