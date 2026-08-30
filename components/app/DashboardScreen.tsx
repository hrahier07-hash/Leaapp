"use client";

import { MobileShell, QuickPlayBanner } from "@/components/layout/MobileShell";
import { Mascot } from "@/components/gamification/Mascot";
import { PathMap } from "@/components/gamification/PathMap";
import { TopBar } from "@/components/gamification/TopBar";
import Link from "next/link";

export function DashboardScreen() {
  return (
    <MobileShell title="Parcours">
      <div className="space-y-5 pb-4">
        <TopBar hearts={5} hints={5} gems={120} streak={3} dailyXp={40} />

        <Link
          href="/app/defi-du-jour"
          className="block rounded-2xl bg-amber-100 px-4 py-3 ring-1 ring-amber-200 active:scale-[0.98]"
        >
          <p className="text-xs font-bold uppercase text-amber-700">Défi du jour</p>
          <p className="font-semibold text-amber-900">Une grille pour tout le monde</p>
        </Link>

        <PathMap />

        <QuickPlayBanner />

        <Mascot mood="encouraging" message="La technique Paire nue t'attend. Tu peux la débloquer aujourd'hui." />
      </div>
    </MobileShell>
  );
}
