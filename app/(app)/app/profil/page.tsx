"use client";

import { MobileShell } from "@/components/layout/MobileShell";
import { Mascot } from "@/components/gamification/Mascot";

export default function ProfilPage() {
  return (
    <MobileShell title="Profil">
      <div className="space-y-4 py-2">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-violet-100">
          <p className="text-lg font-bold">Joueur invité</p>
          <p className="text-sm text-muted-foreground">Connecte toi pour sauvegarder</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-violet-50 p-3"><p className="text-xs text-muted-foreground">XP total</p><p className="text-xl font-bold">1 240</p></div>
          <div className="rounded-xl bg-orange-50 p-3"><p className="text-xs text-muted-foreground">Meilleur streak</p><p className="text-xl font-bold">12</p></div>
          <div className="rounded-xl bg-emerald-50 p-3"><p className="text-xs text-muted-foreground">Grilles</p><p className="text-xl font-bold">47</p></div>
          <div className="rounded-xl bg-sky-50 p-3"><p className="text-xs text-muted-foreground">Badges</p><p className="text-xl font-bold">3</p></div>
        </div>
        <Mascot mood="proud" message="Tu progresses vite. Continue comme ça." />
      </div>
    </MobileShell>
  );
}
