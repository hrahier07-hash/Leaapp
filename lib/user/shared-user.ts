import { prisma } from "@/lib/db/client";

export const SHARED_USER_EMAIL =
  process.env.SHARED_USER_EMAIL ?? "joueur@sudoku-quest.app";

export async function getOrCreateSharedUser() {
  const existing = await prisma.user.findUnique({
    where: { email: SHARED_USER_EMAIL },
    include: {
      _count: {
        select: {
          attempts: true,
          badges: true,
        },
      },
    },
  });

  if (existing) return existing;

  return prisma.user.create({
    data: {
      email: SHARED_USER_EMAIL,
      name: "Joueur LeaDoku",
      hearts: 5,
      hints: 5,
      gems: 0,
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      onboardingDone: true,
      storyLevelUnlocked: 1,
    },
    include: {
      _count: {
        select: {
          attempts: true,
          badges: true,
        },
      },
    },
  });
}

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
};

export async function getSharedUserProfile(): Promise<SharedUserProfile> {
  const user = await getOrCreateSharedUser();
  return {
    id: user.id,
    name: user.name,
    totalXp: user.totalXp,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    hearts: user.hearts,
    hints: user.hints,
    gems: user.gems,
    puzzlesCompleted: user._count.attempts,
    badgesCount: user._count.badges,
    storyLevelUnlocked: user.storyLevelUnlocked,
  };
}
