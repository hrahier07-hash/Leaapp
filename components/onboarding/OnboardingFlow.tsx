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
  { id: "relax", label: "Me détendre", emoji: "🌿" },
  { id: "performance", label: "M'améliorer", emoji: "🎯" },
  { id: "competition", label: "Me challenger", emoji: "🏆" },
];

const GOALS: { id: DailyGoal; label: string }[] = [
  { id: "one", label: "1 grille" },
  { id: "three", label: "3 grilles" },
  { id: "unlimited", label: "Autant que je veux" },
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
              <div className="surface-card p-4">
                <p className="text-sm text-muted-foreground">Petit test pour voir ton niveau</p>
                <p className="mt-2 text-lg font-bold">On estime ton niveau après le test</p>
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
                      motivation === m.id ? "border-primary bg-accent" : "border-transparent surface-card",
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
                      dailyGoal === g.id ? "border-primary bg-accent" : "border-transparent surface-card",
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
              <div className="grid grid-cols-4 gap-1 surface-card p-4">
                {[1, 2, 0, 3, 0, 4, 3, 1, 2, 0, 1, 0, 4, 0, 2, 3].map((v, i) => (
                  <div key={i} className="flex aspect-square items-center justify-center rounded-lg bg-muted text-lg font-bold">
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
              <div className="surface-card space-y-1 p-4 text-sm">
                <p>Niveau : <strong>{startingLevel}</strong></p>
                <p>Objectif : <strong>{dailyGoal === "one" ? "1 grille" : dailyGoal === "three" ? "3 grilles" : "Autant que tu veux"}</strong></p>
              </div>
              <Link href="/app" className={cn(buttonVariants({ size: "lg" }), "mt-auto w-full")}>
                Aller jouer
              </Link>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </MobileShell>
  );
}
