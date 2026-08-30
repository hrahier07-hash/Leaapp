"use client";

import { MobileShell } from "@/components/layout/MobileShell";
import { Leaderboard } from "@/components/gamification/Leaderboard";
import { Mascot } from "@/components/gamification/Mascot";

const DEMO = [
  { rank: 1, name: "Lina", score: 142, subtitle: "3 min 02 s" },
  { rank: 2, name: "Toi", score: 156, subtitle: "4 min 10 s" },
  { rank: 3, name: "Noah", score: 171, subtitle: "4 min 45 s" },
];

export function DailyChallengeScreen() {
  return (
    <MobileShell title="Défi du jour">
      <div className="space-y-4 py-2">
        <div className="rounded-2xl gradient-hero p-4 text-white">
          <p className="text-sm opacity-90">Grille du 30 août</p>
          <p className="text-xl font-bold">Même grille pour tous</p>
        </div>
        <Leaderboard title="Classement mondial" entries={DEMO} />
        <Mascot mood="encouraging" context="empty" message="Bat ton record du jour." />
      </div>
    </MobileShell>
  );
}
