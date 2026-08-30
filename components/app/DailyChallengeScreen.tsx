"use client";

import { MobileShell } from "@/components/layout/MobileShell";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DailyChallengeScreen() {
  return (
    <MobileShell title="Grille du jour">
      <div className="space-y-4 py-2">
        <div className="surface-card p-4">
          <p className="text-sm text-muted-foreground">Aujourd&apos;hui</p>
          <p className="mt-1 font-semibold">Une grille facile pour tout le monde</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Même grille, même départ. Finis la plus vite possible.
          </p>
        </div>
        <Link href="/app/jouer" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
          Jouer la grille du jour
        </Link>
      </div>
    </MobileShell>
  );
}
