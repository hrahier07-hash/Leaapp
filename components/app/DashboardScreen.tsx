"use client";

import { MobileShell, QuickPlayBanner } from "@/components/layout/MobileShell";
import { Mascot } from "@/components/gamification/Mascot";
import { PathMap } from "@/components/gamification/PathMap";
import { TopBar } from "@/components/gamification/TopBar";
import Link from "next/link";

export function DashboardScreen() {
  return (
    <MobileShell title="Leçons">
      <div className="space-y-4 pb-4">
        <TopBar />

        <Link
          href="/app/defi-du-jour"
          className="block surface-card px-4 py-3 active:scale-[0.98]"
        >
          <p className="text-xs font-medium text-muted-foreground">Grille du jour</p>
          <p className="font-semibold">Même grille pour tous les joueurs</p>
        </Link>

        <PathMap />

        <p className="text-center text-xs text-muted-foreground">
          Touche une leçon pour voir comment faire, étape par étape.
        </p>

        <QuickPlayBanner />

        <Mascot mood="encouraging" message="La leçon Paire nue est prête. Une case en moins à chercher !" />
      </div>
    </MobileShell>
  );
}
