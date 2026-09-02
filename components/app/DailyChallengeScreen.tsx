"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { MobileShell } from "@/components/layout/MobileShell";
import {
  getDailyChallengePreview,
  getDailyDifficultyLabel,
} from "@/lib/daily/challenge";
import {
  formatCountdown,
  formatParisDateLabel,
  getMsUntilParisMidnight,
  getParisDateKey,
} from "@/lib/daily/time";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DailyPreview = ReturnType<typeof getDailyChallengePreview> & {
  dateLabel?: string;
};

function PatternPreview({ patternId }: { patternId: string }) {
  const cells = Array.from({ length: 81 }, (_, i) => {
    const r = Math.floor(i / 9);
    const c = i % 9;
    let on = false;
    switch (patternId) {
      case "symetrie":
        on = r === 8 - r || c === 8 - c;
        break;
      case "croix":
        on = r === 4 || c === 4;
        break;
      case "cadre":
        on = r === 0 || r === 8 || c === 0 || c === 8;
        break;
      case "diagonales":
        on = r === c || r + c === 8;
        break;
      case "losange":
        on = Math.abs(r - 4) + Math.abs(c - 4) <= 3;
        break;
      case "coins":
        on =
          (r < 3 && c < 3) ||
          (r < 3 && c > 5) ||
          (r > 5 && c < 3) ||
          (r > 5 && c > 5);
        break;
      case "etoile":
        on = r === 4 || c === 4 || r === c || r + c === 8;
        break;
    }
    return on;
  });

  return (
    <div className="mx-auto grid w-28 grid-cols-9 gap-0.5 rounded-lg bg-muted p-1.5">
      {cells.map((on, i) => (
        <div
          key={i}
          className={cn(
            "aspect-square rounded-sm",
            on ? "bg-primary" : "bg-background/80",
          )}
        />
      ))}
    </div>
  );
}

export function DailyChallengeScreen() {
  const [preview, setPreview] = useState<DailyPreview | null>(null);
  const [countdown, setCountdown] = useState("");
  const dateKey = getParisDateKey();

  useEffect(() => {
    try {
      const data = getDailyChallengePreview(dateKey);
      setPreview({
        ...data,
        dateLabel: formatParisDateLabel(dateKey),
      });
    } catch {
      setPreview(null);
    }
  }, [dateKey]);

  useEffect(() => {
    const tick = () => setCountdown(formatCountdown(getMsUntilParisMidnight()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const difficultyLabel = preview
    ? getDailyDifficultyLabel(preview.difficulty)
    : "Expert";

  return (
    <MobileShell title="Défi du jour">
      <div className="space-y-4 py-2">
        <div className="surface-card space-y-3 p-4">
          <p className="text-sm text-muted-foreground">
            {preview?.dateLabel ?? formatParisDateLabel(dateKey)}
          </p>
          <p className="text-lg font-bold">
            Forme du jour : {preview?.patternName ?? "…"}
          </p>
          <p className="text-sm text-muted-foreground">
            {preview?.patternDescription ??
              "Une grille spéciale change chaque nuit à minuit (heure de Paris)."}
          </p>

          {preview && <PatternPreview patternId={preview.patternId} />}

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
              {difficultyLabel}
            </span>
            {preview && (
              <span className="rounded-full bg-muted px-2.5 py-1 font-medium">
                {preview.clueCount} chiffres visibles
              </span>
            )}
          </div>
        </div>

        <div className="surface-card p-4 text-center text-sm">
          <p className="text-muted-foreground">Prochain défi dans</p>
          <p className="mt-1 text-lg font-bold">{countdown || "…"}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Nouvelle grille chaque jour à minuit (Paris)
          </p>
        </div>

        <Link
          href="/app/jouer?defi=1"
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          Jouer le défi du jour
        </Link>

        <p className="text-center text-xs text-muted-foreground">
          Même grille pour tout le monde aujourd&apos;hui. Difficile mais faisable.
        </p>
      </div>
    </MobileShell>
  );
}
