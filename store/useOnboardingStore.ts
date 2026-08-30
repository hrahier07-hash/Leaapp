"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Motivation = "relax" | "performance" | "competition";
export type DailyGoal = "one" | "three" | "unlimited";

type OnboardingState = {
  step: number;
  levelTestErrors: number;
  levelTestSeconds: number;
  startingLevel: string;
  motivation: Motivation | null;
  dailyGoal: DailyGoal | null;
  lessonCompleted: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  recordLevelTest: (errors: number, seconds: number) => void;
  setMotivation: (m: Motivation) => void;
  setDailyGoal: (g: DailyGoal) => void;
  completeLesson: () => void;
  reset: () => void;
};

const initial = {
  step: 0,
  levelTestErrors: 0,
  levelTestSeconds: 0,
  startingLevel: "facile",
  motivation: null as Motivation | null,
  dailyGoal: null as DailyGoal | null,
  lessonCompleted: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initial,
      setStep: (step) => set({ step }),
      nextStep: () => set({ step: get().step + 1 }),
      prevStep: () => set({ step: Math.max(0, get().step - 1) }),
      recordLevelTest: (errors, seconds) => {
        const startingLevel =
          errors === 0 && seconds < 180
            ? "moyen"
            : errors <= 2
              ? "facile"
              : "facile";
        set({ levelTestErrors: errors, levelTestSeconds: seconds, startingLevel });
      },
      setMotivation: (motivation) => set({ motivation }),
      setDailyGoal: (dailyGoal) => set({ dailyGoal }),
      completeLesson: () => set({ lessonCompleted: true }),
      reset: () => set(initial),
    }),
    { name: "sq-onboarding" },
  ),
);
