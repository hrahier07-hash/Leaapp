"use client";

import { useState } from "react";

import { MobileShell } from "@/components/layout/MobileShell";
import { Mascot } from "@/components/gamification/Mascot";
import { buttonVariants } from "@/components/ui/button";
import { useSharedUser } from "@/hooks/useSharedUser";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useGameStore } from "@/store/useGameStore";
import { cn } from "@/lib/utils";

export default function ProfilPage() {
  const { profile, loading, error, refresh } = useSharedUser();
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      const res = await fetch("/api/me/reset", { method: "POST" });
      if (!res.ok) throw new Error("fail");
      useOnboardingStore.getState().reset();
      useGameStore.getState().resetGame();
      await refresh();
      setConfirmReset(false);
    } catch {
      alert("Impossible de tout remettre à zéro. Vérifie la base de données.");
    } finally {
      setResetting(false);
    }
  };

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

        <div className="surface-card space-y-3 p-4">
          <p className="text-sm font-semibold">Recommencer</p>
          <p className="text-xs text-muted-foreground">
            Remet à zéro les points, les grilles finies, les séries et le parcours.
          </p>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Tout remettre à zéro
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                disabled={resetting}
                className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void handleReset()}
                disabled={resetting}
                className={cn(buttonVariants({ variant: "destructive" }), "flex-1")}
              >
                {resetting ? "…" : "Confirmer"}
              </button>
            </div>
          )}
        </div>
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
