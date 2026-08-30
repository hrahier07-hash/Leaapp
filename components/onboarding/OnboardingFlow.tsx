"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { Mascot } from "@/components/gamification/Mascot";
import { MobileShell } from "@/components/layout/MobileShell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getMascotLine } from "@/lib/mascot/lines";
import {
  useOnboardingStore,
  type DailyGoal,
  type Motivation,
} from "@/store/useOnboardingStore";

const MOTIVATIONS: { id: Motivation; label: string; emoji: string }[] = [
  { id: "relax", label: "Détente", emoji: "🌿" },
  { id: "performance", label: "Performance", emoji: "🎯" },
  { id: "competition", label: "Compétition", emoji: "🏆" },
];

const GOALS: { id: DailyGoal; label: string }[] = [
  { id: "one", label: "1 grille" },
  { id: "three", label: "3 grilles" },
  { id: "unlimited", label: "Illimité" },
];

export function OnboardingFlow() {
  const {
    step,
    nextStep,
    prevStep,
    setMotivation,
    setDailyGoal,
    completeLesson,
    startingLevel,
    motivation,
    dailyGoal,
    lessonCompleted,
    recordLevelTest,
  } = useOnboardingStore();

  const finishLevelTest = () => {
    recordLevelTest(1, 240);
    nextStep();
  };

  return (
    <MobileShell title="Bienvenue" showNav={false}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          className="flex min-h-[70dvh] flex-col gap-6 py-4"
        >
          {step === 0 && (
            <>
              <Mascot mood="surprised" message={getMascotLine("onboarding", "hook")} />
              <button type="button" onClick={nextStep} className={cn(buttonVariants({ size: "lg" }), "mt-auto w-full")}>
                C&apos;est parti
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <Mascot mood="encouraging" message={getMascotLine("onboarding", "levelTest")} />
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-violet-100">
                <p className="text-sm text-muted-foreground">Test rapide simulé</p>
                <p className="mt-2 text-lg font-bold">Niveau estimé après test</p>
              </div>
              <div className="mt-auto flex gap-2">
                <button type="button" onClick={prevStep} className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>
                  Retour
                </button>
                <button type="button" onClick={finishLevelTest} className={cn(buttonVariants(), "flex-1")}>
                  Terminer le test
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Mascot mood="neutral" message={getMascotLine("onboarding", "motivation")} />
              <div className="grid gap-3">
                {MOTIVATIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMotivation(m.id)}
                    className={cn(
                      "rounded-2xl border-2 px-4 py-4 text-left font-semibold active:scale-[0.98]",
                      motivation === m.id ? "border-primary bg-violet-50" : "border-transparent bg-white shadow-sm",
                    )}
                  >
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
              <button type="button" disabled={!motivation} onClick={nextStep} className={cn(buttonVariants({ size: "lg" }), "mt-auto w-full")}>
                Continuer
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <Mascot mood="encouraging" message={getMascotLine("onboarding", "dailyGoal")} />
              <div className="grid gap-3">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setDailyGoal(g.id)}
                    className={cn(
                      "rounded-2xl border-2 px-4 py-4 font-semibold active:scale-[0.98]",
                      dailyGoal === g.id ? "border-primary bg-violet-50" : "border-transparent bg-white shadow-sm",
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              <button type="button" disabled={!dailyGoal} onClick={nextStep} className={cn(buttonVariants({ size: "lg" }), "mt-auto w-full")}>
                Continuer
              </button>
            </>
          )}

          {step === 4 && (
            <>
              <Mascot mood="proud" message={getMascotLine("onboarding", "lesson")} />
              <div className="grid grid-cols-4 gap-1 rounded-2xl bg-white p-4 shadow-sm">
                {[1, 2, 0, 3, 0, 4, 3, 1, 2, 0, 1, 0, 4, 0, 2, 3].map((v, i) => (
                  <div key={i} className="flex aspect-square items-center justify-center rounded-lg bg-violet-50 text-lg font-bold">
                    {v || ""}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => { completeLesson(); nextStep(); }} className={cn(buttonVariants({ size: "lg" }), "mt-auto w-full")}>
                J&apos;ai compris
              </button>
            </>
          )}

          {step === 5 && (
            <>
              <Mascot mood="proud" message={getMascotLine("onboarding", "summary")} />
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm ring-1 ring-emerald-100">
                <p>Niveau de départ : <strong>{startingLevel}</strong></p>
                <p>Motivation : <strong>{motivation}</strong></p>
                <p>Objectif : <strong>{dailyGoal}</strong></p>
                <p>Leçon : <strong>{lessonCompleted ? "validée" : "en cours"}</strong></p>
              </div>
              <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "mt-auto w-full")}>
                Créer mon compte
              </Link>
              <Link href="/app" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}>
                Jouer sans compte
              </Link>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </MobileShell>
  );
}
