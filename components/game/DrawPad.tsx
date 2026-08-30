"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import getStroke from "perfect-freehand";

import {
  preloadDigitModel,
  recognizeDigitAsync,
} from "@/lib/sudoku/digit-recognizer";
import { smoothStrokes } from "@/lib/sudoku/stroke-renderer";
import type { Point, Stroke } from "@/lib/sudoku/types";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

const STROKE_SIZE_INLINE = 16;
const STROKE_SIZE_SHEET = 22;

function getCanvasPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
): Point {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function drawStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  width: number,
  height: number,
  strokeSize: number,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  for (const stroke of strokes) {
    if (stroke.length === 0) continue;

    const outline =
      stroke.length >= 2
        ? getStroke(
            stroke.map((p) => [p.x, p.y]),
            { size: strokeSize, thinning: 0.65, smoothing: 0.65, streamline: 0.4 },
          )
        : [];

    if (outline.length >= 3) {
      ctx.fillStyle = "#111111";
      ctx.beginPath();
      ctx.moveTo(outline[0][0], outline[0][1]);
      for (let i = 1; i < outline.length; i++) {
        ctx.lineTo(outline[i][0], outline[i][1]);
      }
      ctx.closePath();
      ctx.fill();
    } else if (stroke.length === 1) {
      ctx.fillStyle = "#111111";
      ctx.beginPath();
      ctx.arc(stroke[0].x, stroke[0].y, strokeSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function DrawPad({
  variant = "inline",
  onDone,
}: {
  variant?: "inline" | "sheet";
  onDone?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const recognizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [hint, setHint] = useState("Dessine un chiffre avec ton doigt");

  const selectedCell = useGameStore((s) => s.selectedCell);
  const setCellValue = useGameStore((s) => s.setCellValue);
  const clearCell = useGameStore((s) => s.clearCell);
  const setLastRecognition = useGameStore((s) => s.setLastRecognition);
  const lastRecognition = useGameStore((s) => s.lastRecognition);

  useEffect(() => {
    preloadDigitModel();
  }, []);

  const strokeSize = variant === "sheet" ? STROKE_SIZE_SHEET : STROKE_SIZE_INLINE;

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawStrokes(ctx, strokesRef.current, width, height, strokeSize);
  }, [strokeSize]);

  useEffect(() => {
    redraw();
    window.addEventListener("resize", redraw);
    return () => window.removeEventListener("resize", redraw);
  }, [redraw]);

  const clearCanvas = useCallback(() => {
    if (recognizeTimerRef.current) {
      clearTimeout(recognizeTimerRef.current);
      recognizeTimerRef.current = null;
    }
    strokesRef.current = [];
    setIsDrawing(false);
    drawingRef.current = false;
    redraw();

    setHint("Dessine un chiffre avec ton doigt");
    setLastRecognition(null, 0);
  }, [redraw, setLastRecognition]);

  const handleRecognize = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedCell) return;

    const rawStrokes = strokesRef.current;
    if (!rawStrokes.some((s) => s.length > 2)) {
      setHint("Trait trop court. Dessine plus grand.");
      return;
    }

    setIsRecognizing(true);
    const { width, height } = canvas.getBoundingClientRect();
    const smoothed = smoothStrokes(rawStrokes);

    try {
      const result = await recognizeDigitAsync(smoothed, width, height);

      if (result.digit === null) {
        setHint("Pas reconnu. Réessaie ou utilise le clavier.");
        setLastRecognition(null, result.confidence);
        return;
      }

      const isValid = setCellValue(
        selectedCell.row,
        selectedCell.col,
        result.digit,
      );

      setLastRecognition(result.digit, result.confidence);
      setHint(
        isValid
          ? `${result.digit} ajouté (${Math.round(result.confidence * 100)}%)`
          : `${result.digit} incorrect pour cette case`,
      );

      clearCanvas();
      if (isValid) onDone?.();
    } finally {
      setIsRecognizing(false);
    }
  }, [clearCanvas, onDone, selectedCell, setCellValue, setLastRecognition]);

  const scheduleRecognize = useCallback(() => {
    if (recognizeTimerRef.current) {
      clearTimeout(recognizeTimerRef.current);
    }
    recognizeTimerRef.current = setTimeout(() => {
      void handleRecognize();
    }, 700);
  }, [handleRecognize]);

  const startStroke = (point: Point) => {
    if (!selectedCell || isRecognizing) return;
    if (recognizeTimerRef.current) {
      clearTimeout(recognizeTimerRef.current);
    }
    drawingRef.current = true;
    setIsDrawing(true);
    strokesRef.current.push([point]);
    redraw();
  };

  const continueStroke = (point: Point) => {
    if (!drawingRef.current) return;
    const strokes = strokesRef.current;
    const current = strokes[strokes.length - 1];
    if (!current) return;

    const last = current[current.length - 1];
    if (last && Math.hypot(last.x - point.x, last.y - point.y) < 1.5) return;

    current.push(point);
    redraw();
  };

  const endStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setIsDrawing(false);
    scheduleRecognize();
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!selectedCell) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const canvas = canvasRef.current;
    if (!canvas) return;
    startStroke(getCanvasPoint(canvas, event.clientX, event.clientY));
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    continueStroke(getCanvasPoint(canvas, event.clientX, event.clientY));
  };

  const onPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    endStroke();
  };

  const handleClearCell = () => {
    if (!selectedCell) return;
    clearCell(selectedCell.row, selectedCell.col);
    clearCanvas();
    setHint("Case effacée");
  };

  const canvasHeight = variant === "sheet" ? "h-56" : "h-48";
  const showCanvas = variant === "sheet" || selectedCell;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          {variant === "inline" && (
            <p className="text-sm font-medium">Mode dessin</p>
          )}
          <p className="truncate text-xs text-muted-foreground">{hint}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleClearCell}
            disabled={!selectedCell}
            className="flex size-11 items-center justify-center rounded-full bg-muted disabled:opacity-40 active:scale-95"
            aria-label="Effacer la case"
          >
            <Eraser className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => void handleRecognize()}
            disabled={!selectedCell || isRecognizing}
            className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 active:scale-95"
            aria-label="Valider le chiffre dessiné"
          >
            <Check className="size-5" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showCanvas ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex h-48 items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-4 text-center text-sm text-muted-foreground"
          >
            Touche une case vide, puis dessine le chiffre ici
          </motion.div>
        ) : (
          <motion.div
            key="canvas"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              "overflow-hidden rounded-2xl border-2 bg-white shadow-inner",
              isDrawing ? "border-primary" : "border-border",
              isRecognizing && "opacity-70",
            )}
          >
            <canvas
              ref={canvasRef}
              className={cn("w-full touch-none", canvasHeight)}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              onPointerCancel={onPointerUp}
              aria-label="Dessiner un chiffre"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <button
          type="button"
          onClick={clearCanvas}
          className="rounded-full bg-muted px-3 py-1.5 font-medium active:scale-95"
        >
          Effacer le dessin
        </button>
        {lastRecognition && (
          <span>
            Dernier : {lastRecognition.digit} ({lastRecognition.confidence}%)
          </span>
        )}
      </div>
    </div>
  );
}
