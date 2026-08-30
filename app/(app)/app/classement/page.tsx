"use client";

import { MobileShell } from "@/components/layout/MobileShell";
import { Leaderboard } from "@/components/gamification/Leaderboard";

const LEAGUE = [
  { rank: 1, name: "Camille", score: 890 },
  { rank: 2, name: "Toi", score: 720 },
  { rank: 3, name: "Alex", score: 680 },
];

export default function ClassementPage() {
  return (
    <MobileShell title="Classement">
      <div className="space-y-4 py-2">
        <div className="rounded-2xl bg-amber-100 p-4 ring-1 ring-amber-200">
          <p className="text-xs font-bold uppercase text-amber-700">Ligue Or</p>
          <p className="font-semibold">Semaine en cours</p>
        </div>
        <Leaderboard title="Ta ligue" entries={LEAGUE} />
      </div>
    </MobileShell>
  );
}
