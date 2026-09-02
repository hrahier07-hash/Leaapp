import { prisma } from "@/lib/db/client";
import {
  DAILY_HEARTS,
  DAILY_HINTS,
  ensureDailyResourcesReset,
  sharedUserInclude,
  todayResourcesResetKey,
} from "@/lib/user/daily-resources";

export const SHARED_USER_EMAIL =
  process.env.SHARED_USER_EMAIL ?? "joueur@sudoku-quest.app";

export async function getOrCreateSharedUser() {
  const existing = await prisma.user.findUnique({
    where: { email: SHARED_USER_EMAIL },
    include: sharedUserInclude,
  });

  if (existing) {
    return ensureDailyResourcesReset(existing);
  }

  const todayKey = todayResourcesResetKey();
  return prisma.user.create({
    data: {
      email: SHARED_USER_EMAIL,
      name: "Joueur LeaDoku",
      hearts: DAILY_HEARTS,
      hints: DAILY_HINTS,
      gems: 0,
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      onboardingDone: true,
      storyLevelUnlocked: 1,
      storyBeatsUnlocked: [],
      lastResourcesResetKey: todayKey,
    },
    include: sharedUserInclude,
  });
}

export type SharedUserProfile = {
  id: string;
  name: string | null;
  image: string | null;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  hearts: number;
  hints: number;
  gems: number;
  puzzlesCompleted: number;
  badgesCount: number;
  storyLevelUnlocked: number;
  storyBeatsUnlocked: number[];
  totalMistakes: number;
  totalHintsUsed: number;
};

export async function getSharedUserProfile(): Promise<SharedUserProfile> {
  const user = await getOrCreateSharedUser();

  const attempts = await prisma.userPuzzleAttempt.findMany({
    where: { userId: user.id, completedAt: { not: null } },
    select: { mistakesCount: true, hintsUsed: true },
  });

  const totalMistakes = attempts.reduce((sum, a) => sum + a.mistakesCount, 0);
  const totalHintsUsed = attempts.reduce((sum, a) => sum + a.hintsUsed, 0);

  return {
    id: user.id,
    name: user.name,
    image: user.image,
    totalXp: user.totalXp,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    hearts: user.hearts,
    hints: user.hints,
    gems: user.gems,
    puzzlesCompleted: attempts.length,
    badgesCount: user._count.badges,
    storyLevelUnlocked: user.storyLevelUnlocked,
    storyBeatsUnlocked: user.storyBeatsUnlocked,
    totalMistakes,
    totalHintsUsed,
  };
}
