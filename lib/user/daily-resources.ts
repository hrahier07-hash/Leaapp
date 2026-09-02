import { prisma } from "@/lib/db/client";
import { getParisDateKey } from "@/lib/daily/time";

export const DAILY_HEARTS = 5;
export const DAILY_HINTS = 5;
export const MISTAKES_PER_LIFE = 3;

const userInclude = {
  _count: {
    select: {
      attempts: true,
      badges: true,
    },
  },
} as const;

export async function ensureDailyResourcesReset<
  T extends { id: string; lastResourcesResetKey: string | null },
>(user: T) {
  const todayKey = getParisDateKey();
  if (user.lastResourcesResetKey === todayKey) return user;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      hearts: DAILY_HEARTS,
      hints: DAILY_HINTS,
      lastResourcesResetKey: todayKey,
      lastHeartLostAt: null,
    },
  });

  return prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    include: userInclude,
  });
}

export function todayResourcesResetKey(): string {
  return getParisDateKey();
}

export { userInclude as sharedUserInclude };
