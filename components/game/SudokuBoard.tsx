"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { GRID_SIZE } from "@/lib/sudoku/types";

function getRelatedCells(
  row: number,
  col: number,
): Set<string> {
  const related = new Set<string>();

  for (let i = 0; i < GRID_SIZE; i++) {
    related.add(`${row}-${i}`);
    related.add(`${i}-${col}`);
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      related.add(`${r}-${c}`);
    }
  }

  return related;
}

export function SudokuBoard() {
  const grid = useGameStore((s) => s.grid);
  const notes = useGameStore((s) => s.notes);
  const selectedCell = useGameStore((s) => s.selectedCell);
  const selectCell = useGameStore((s) => s.selectCell);
  const isGiven = useGameStore((s) => s.isGiven);
  const isPaused = useGameStore((s) => s.isPaused);

  const selectedValue =
    selectedCell !== null
      ? grid[selectedCell.row][selectedCell.col]
      : null;

  const related =
    selectedCell !== null
      ? getRelatedCells(selectedCell.row, selectedCell.col)
      : new Set<string>();

  return (
    <div className={cn("mx-auto w-full max-w-[min(100%,22rem)] select-none touch-none", isPaused && "opacity-50 pointer-events-none")}>
      <div className="grid grid-cols-9 overflow-hidden rounded-2xl border-2 border-violet-300 bg-white shadow-md">
        {grid.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            const cellNotes = notes[rowIndex][colIndex];
            const isSelected =
              selectedCell?.row === rowIndex &&
              selectedCell?.col === colIndex;
            const given = isGiven(rowIndex, colIndex);
            const isRelated = related.has(key) && !isSelected;
            const sameValue =
              selectedValue !== null &&
              selectedValue !== 0 &&
              value === selectedValue &&
              !isSelected;

            return (
              <motion.button
                key={key}
                type="button"
                onClick={() => selectCell(rowIndex, colIndex)}
                disabled={given}
                whileTap={given ? undefined : { scale: 0.94 }}
                className={cn(
                  "relative flex aspect-square items-center justify-center text-xl font-semibold sm:text-2xl",
                  "border border-border/70",
                  (colIndex + 1) % 3 === 0 && colIndex !== 8 && "border-r-2 border-r-foreground/50",
                  (rowIndex + 1) % 3 === 0 && rowIndex !== 8 && "border-b-2 border-b-foreground/50",
                  given && "bg-muted/80 text-foreground",
                  !given && "bg-background active:bg-accent/40",
                  isSelected && "z-10 bg-primary/15 ring-2 ring-inset ring-primary",
                  isRelated && "bg-muted/40",
                  sameValue && "bg-primary/10 text-primary",
                )}
              >
                {value !== 0 ? (
                  value
                ) : cellNotes.length > 0 ? (
                  <span className="grid h-full w-full grid-cols-3 gap-0 p-0.5 text-[8px] leading-none text-violet-600">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <span key={n} className="flex items-center justify-center">
                        {cellNotes.includes(n) ? n : ""}
                      </span>
                    ))}
                  </span>
                ) : (
                  ""
                )}
              </motion.button>
            );
          }),
        )}
      </div>
    </div>
  );
}
