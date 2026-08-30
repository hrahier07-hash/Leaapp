"use client";

import { MobileShell } from "@/components/layout/MobileShell";
import { Mascot } from "@/components/gamification/Mascot";
import { useSharedUser } from "@/hooks/useSharedUser";

export default function ProfilPage() {
  const { profile, loading, error } = useSharedUser();

  if (loading) {
    return (
      <MobileShell title="Profil">
        <p className="py-8 text-center text-sm text-muted-foreground">Chargement…</p>
      </MobileShell>
    );
  }

  if (error || !profile) {
    return (
      <MobileShell title="Profil">
        <p className="py-8 text-center text-sm text-muted-foreground">
          Les stats ne sont pas disponibles. Vérifie la base de données.
        </p>
      </MobileShell>
    );
  }

  return (
    <MobileShell title="Profil">
      <div className="space-y-4 py-2">
        <div className="surface-card p-4">
          <p className="text-lg font-bold">{profile.name ?? "Joueur Sudoku"}</p>
          <p className="text-sm text-muted-foreground">
            Compte partagé. Ta progression est sauvegardée ici.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Points total" value={profile.totalXp} />
          <Stat label="Jours d'affilée" value={profile.currentStreak} />
          <Stat label="Meilleure série" value={profile.longestStreak} />
          <Stat label="Grilles finies" value={profile.puzzlesCompleted} />
          <Stat label="Vies restantes" value={profile.hearts} />
          <Stat label="Indices restants" value={profile.hints} />
        </div>

        <Mascot
          mood="proud"
          message={
            profile.puzzlesCompleted > 0
              ? `Tu as fini ${profile.puzzlesCompleted} grille${profile.puzzlesCompleted > 1 ? "s" : ""}. Bravo !`
              : "Finis ta première grille pour gagner des points."
          }
        />
      </div>
    </MobileShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="surface-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
