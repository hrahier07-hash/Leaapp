"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { Mascot } from "@/components/gamification/Mascot";
import { MobileShell } from "@/components/layout/MobileShell";
import { buttonVariants } from "@/components/ui/button";
import type { LessonContent } from "@/lib/lessons/content";
import { cn } from "@/lib/utils";

type LessonTutorialProps = {
  lesson: LessonContent;
};

function DemoGrid({ grid }: { grid: number[][] }) {
  const size = grid.length;
  return (
    <div
      className="mx-auto grid gap-0.5 rounded-xl bg-muted p-2"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, maxWidth: size === 4 ? "10rem" : "16rem" }}
    >
      {grid.flatMap((row, r) =>
        row.map((value, c) => (
          <div
            key={`${r}-${c}`}
            className={cn(
              "flex aspect-square items-center justify-center rounded-md text-sm font-bold",
              value ? "bg-card" : "bg-background text-muted-foreground",
            )}
          >
            {value || "?"}
          </div>
        )),
      )}
    </div>
  );
}

export function LessonTutorial({ lesson }: LessonTutorialProps) {
  const [step, setStep] = useState(0);
  const current = lesson.steps[step];
  const isLast = step === lesson.steps.length - 1;

  return (
    <MobileShell title={lesson.title} showNav={false}>
      <div className="flex min-h-[70dvh] flex-col gap-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Étape {step + 1} sur {lesson.steps.length}
          </span>
          <Link
            href={`/app/jouer?technique=${lesson.slug}`}
            className="font-medium text-primary"
          >
            Passer
          </Link>
        </div>

        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((step + 1) / lesson.steps.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-1 flex-col gap-4"
          >
            <Mascot mood="encouraging" message={current.title} />

            <div className="surface-card space-y-4 p-4">
              <p className="text-sm leading-relaxed">{current.text}</p>
              {current.demo && <DemoGrid grid={current.demo} />}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-auto flex gap-2">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
            >
              Retour
            </button>
          )}
          {isLast ? (
            <Link
              href={`/app/jouer?technique=${lesson.slug}`}
              className={cn(buttonVariants({ size: "lg" }), "flex-1")}
            >
              Jouer cette leçon
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className={cn(buttonVariants({ size: "lg" }), "flex-1")}
            >
              Suivant
            </button>
          )}
        </div>
      </div>
    </MobileShell>
  );
}
