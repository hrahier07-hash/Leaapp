"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { MobileShell } from "@/components/layout/MobileShell";
import { Mascot } from "@/components/gamification/Mascot";
import { buttonVariants } from "@/components/ui/button";
import { STORY_LEVEL_COUNT } from "@/lib/story/levels";
import { useSharedUser } from "@/hooks/useSharedUser";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useGameStore } from "@/store/useGameStore";
import { cn } from "@/lib/utils";

const RESET_ITEMS = [
  "Points et grilles finies",
  "Erreurs et séries de jours",
  "Vies et indices",
  "Niveaux Histoire (1 à 50)",
  "Progression des leçons",
  "Parcours d'accueil",
] as const;

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
        <div className="space-y-3 py-8 px-2 text-center text-sm text-muted-foreground">
          <p>Les stats ne sont pas disponibles.</p>
          <p className="text-xs leading-relaxed">
            En ligne (Vercel), il faut une URL de base spéciale (pooler Supabase),
            pas la connexion directe. Change DATABASE_URL sur Vercel puis redéploie.
          </p>
        </div>
      </MobileShell>
    );
  }

  const storyDone = Math.max(0, profile.storyLevelUnlocked - 1);

  return (
    <MobileShell title="Profil">
      <div className="space-y-4 py-2">
        <div className="surface-card p-4">
          <p className="text-lg font-bold">{profile.name ?? "Joueur LeaDoku"}</p>
          <p className="text-sm text-muted-foreground">
            Compte partagé. Ta progression est sauvegardée ici.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Points total" value={profile.totalXp} />
          <Stat label="Jours d'affilée" value={profile.currentStreak} />
          <Stat label="Meilleure série" value={profile.longestStreak} />
          <Stat label="Grilles finies" value={profile.puzzlesCompleted} />
          <Stat label="Histoire" value={storyDone} suffix={`/${STORY_LEVEL_COUNT}`} />
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
          <div className="flex items-center gap-2">
            <RotateCcw className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold">Réinitialiser le compte</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Remet tout à zéro comme au premier jour :
          </p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {RESET_ITEMS.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Tout remettre à zéro
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-center text-xs font-medium text-destructive">
                Cette action ne peut pas être annulée.
              </p>
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
            </div>
          )}
        </div>
      </div>
    </MobileShell>
  );
}

function Stat({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="surface-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold">
        {value}
        {suffix}
      </p>
    </div>
  );
}
