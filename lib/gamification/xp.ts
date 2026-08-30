import type { Difficulty } from "@/lib/sudoku/types";

type CompletionInput = {
  difficulty: Difficulty;
  timeSeconds: number;
  mistakesCount: number;
  hintsUsed: number;
};

const BASE_XP: Record<Difficulty, number> = {
  facile: 40,
  moyen: 70,
  difficile: 110,
  expert: 160,
  diabolique: 230,
};

export function computeXpForCompletion(input: CompletionInput): number {
  const base = BASE_XP[input.difficulty];
  const timeBonus = Math.max(0, 120 - input.timeSeconds) * 0.5;
  const mistakePenalty = input.mistakesCount * 8;
  const hintPenalty = input.hintsUsed * 12;
  return Math.max(10, Math.round(base + timeBonus - mistakePenalty - hintPenalty));
}

export function computeHeartsAfterLoss(
  currentHearts: number,
  now: Date = new Date(),
  lastHeartLostAt: Date | null,
): { hearts: number; lastHeartLostAt: Date | null } {
  if (currentHearts >= 5) {
    return { hearts: 5, lastHeartLostAt: null };
  }

  if (!lastHeartLostAt) {
    return { hearts: currentHearts, lastHeartLostAt };
  }

  const regenMs = 4 * 60 * 60 * 1000;
  const elapsed = now.getTime() - lastHeartLostAt.getTime();
  const regained = Math.floor(elapsed / regenMs);
  const hearts = Math.min(5, currentHearts + regained);

  if (hearts >= 5) {
    return { hearts: 5, lastHeartLostAt: null };
  }

  const remainder = elapsed % regenMs;
  const adjustedLast =
    regained > 0
      ? new Date(now.getTime() - remainder)
      : lastHeartLostAt;

  return { hearts, lastHeartLostAt: adjustedLast };
}

export function updateStreak(
  currentStreak: number,
  longestStreak: number,
  lastActivityDate: Date | null,
  timezone: string,
  now: Date = new Date(),
): { currentStreak: number; longestStreak: number; lastActivityDate: Date } {
  const todayKey = formatDateInTimezone(now, timezone);

  if (!lastActivityDate) {
    return { currentStreak: 1, longestStreak: 1, lastActivityDate: now };
  }

  const lastKey = formatDateInTimezone(lastActivityDate, timezone);
  if (lastKey === todayKey) {
    return { currentStreak, longestStreak, lastActivityDate: now };
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateInTimezone(yesterday, timezone);

  const nextStreak = lastKey === yesterdayKey ? currentStreak + 1 : 1;
  return {
    currentStreak: nextStreak,
    longestStreak: Math.max(longestStreak, nextStreak),
    lastActivityDate: now,
  };
}

function formatDateInTimezone(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export const LEAGUE_NAMES = [
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "DIAMOND",
] as const;
