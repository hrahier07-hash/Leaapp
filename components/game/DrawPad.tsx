"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { recognizeDigit } from "@/lib/sudoku/digit-recognizer";
import type { Point, Stroke } from "@/lib/sudoku/types";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

const STROKE_WIDTH = 4;

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

export function DrawPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hint, setHint] = useState<string>("Dessine un chiffre avec ton doigt");

  const selectedCell = useGameStore((s) => s.selectedCell);
  const setCellValue = useGameStore((s) => s.setCellValue);
  const clearCell = useGameStore((s) => s.clearCell);
  const setLastRecognition = useGameStore((s) => s.setLastRecognition);
  const lastRecognition = useGameStore((s) => s.lastRecognition);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "oklch(0.205 0 0)";
    ctx.lineWidth = STROKE_WIDTH;

    for (const stroke of strokesRef.current) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    redraw();
    window.addEventListener("resize", redraw);
    return () => window.removeEventListener("resize", redraw);
  }, [redraw]);

  const clearCanvas = useCallback(() => {
    strokesRef.current = [];
    setIsDrawing(false);
    drawingRef.current = false;
    redraw();
    setHint("Dessine un chiffre avec ton doigt");
    setLastRecognition(null, 0);
  }, [redraw, setLastRecognition]);

  const handleRecognize = useCallback(() => {
    const result = recognizeDigit(strokesRef.current);

    if (result.digit === null) {
      setHint("Chiffre non reconnu — réessaie");
      setLastRecognition(null, result.confidence);
      return;
    }

    if (!selectedCell) return;

    const isValid = setCellValue(
      selectedCell.row,
      selectedCell.col,
      result.digit,
    );

    setLastRecognition(result.digit, result.confidence);
    setHint(
      isValid
        ? `Chiffre ${result.digit} ajouté (${Math.round(result.confidence * 100)}%)`
        : `Chiffre ${result.digit} incorrect`,
    );

    clearCanvas();
  }, [clearCanvas, selectedCell, setCellValue, setLastRecognition]);

  const startStroke = (point: Point) => {
    if (!selectedCell) return;
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
    if (last && Math.hypot(last.x - point.x, last.y - point.y) < 2) return;

    current.push(point);
    redraw();
  };

  const endStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setIsDrawing(false);

    if (strokesRef.current.some((s) => s.length > 2)) {
      handleRecognize();
    }
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">Zone de dessin</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClearCell}
            disabled={!selectedCell}
            className="flex size-10 items-center justify-center rounded-full bg-muted disabled:opacity-40 active:scale-95"
            aria-label="Effacer la case"
          >
            <Eraser className="size-4" />
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="rounded-full bg-muted px-3 py-2 text-xs font-medium active:scale-95"
          >
            Effacer
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedCell ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex h-44 items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-4 text-center text-sm text-muted-foreground"
          >
            Touche une case vide sur la grille pour commencer à dessiner
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
            )}
          >
            <canvas
              ref={canvasRef}
              className="h-44 w-full touch-none"
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

      {lastRecognition && (
        <p className="text-center text-xs text-muted-foreground">
          Dernière détection : {lastRecognition.digit} (
          {lastRecognition.confidence}% confiance)
        </p>
      )}
    </div>
  );
}
