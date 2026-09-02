"use client";

import { useCallback, useEffect, useState } from "react";

export type SharedUserProfile = {
  id: string;
  name: string | null;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  hearts: number;
  hints: number;
  gems: number;
  puzzlesCompleted: number;
  badgesCount: number;
  storyLevelUnlocked: number;
  totalMistakes: number;
  totalHintsUsed: number;
};

export function useSharedUser() {
  const [profile, setProfile] = useState<SharedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/me");
      if (!res.ok) throw new Error("fail");
      setProfile(await res.json());
      setError(false);
    } catch {
      setError(true);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { profile, loading, error, refresh };
}
