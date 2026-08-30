import { prisma } from "@/lib/db/client";
import { SHARED_USER_EMAIL } from "@/lib/user/shared-user";

export async function resetSharedUser() {
  const user = await prisma.user.findUnique({
    where: { email: SHARED_USER_EMAIL },
  });

  if (!user) {
    return prisma.user.create({
      data: {
        email: SHARED_USER_EMAIL,
        name: "Joueur Sudoku",
        hearts: 5,
        hints: 5,
        gems: 0,
        totalXp: 0,
        currentStreak: 0,
        longestStreak: 0,
        onboardingDone: false,
      },
    });
  }

  await prisma.$transaction([
    prisma.userPuzzleAttempt.deleteMany({ where: { userId: user.id } }),
    prisma.userTechniqueMastery.deleteMany({ where: { userId: user.id } }),
    prisma.userBadge.deleteMany({ where: { userId: user.id } }),
    prisma.leagueParticipant.deleteMany({ where: { userId: user.id } }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        totalXp: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        hearts: 5,
        hints: 5,
        gems: 0,
        league: "BRONZE",
        onboardingDone: false,
        motivation: null,
        startingLevel: null,
        lastHeartLostAt: null,
        streakFreezes: 0,
      },
    }),
  ]);

  return user;
}
