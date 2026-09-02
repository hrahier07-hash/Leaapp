import { computeXpForCompletion, updateStreak } from "@/lib/gamification/xp";
import type { CompletionPayload, CompletionResult } from "@/lib/gamification/completion-types";
import { STORY_LEVEL_COUNT } from "@/lib/story/levels";
import { prisma } from "@/lib/db/client";
import { getOrCreateSharedUser } from "@/lib/user/shared-user";

async function findPuzzleTemplate(payload: CompletionPayload) {
  if (payload.dailyDateKey) {
    const daily = await prisma.puzzleTemplate.findFirst({
      where: {
        isDailyChallenge: true,
        dailyChallengeDate: new Date(payload.dailyDateKey),
      },
    });
    if (daily) return daily;
  }

  const difficulties = [
    payload.difficulty,
    "difficile",
    "moyen",
    "facile",
  ] as const;

  for (const difficulty of difficulties) {
    const template = await prisma.puzzleTemplate.findFirst({
      where: { difficulty, isDailyChallenge: false },
    });
    if (template) return template;
  }

  return prisma.puzzleTemplate.findFirst({
    where: { isDailyChallenge: false },
  });
}

export async function recordPuzzleCompletion(
  payload: CompletionPayload,
): Promise<CompletionResult> {
  const xp = computeXpForCompletion({
    difficulty: payload.difficulty,
    timeSeconds: payload.timeSeconds,
    mistakesCount: payload.mistakesCount,
    hintsUsed: payload.hintsUsed,
  });

  const user = await getOrCreateSharedUser();
  const now = new Date();

  const streak = updateStreak(
    user.currentStreak,
    user.longestStreak,
    user.lastActivityDate,
    user.timezone,
    now,
  );

  let storyLevelUnlocked = user.storyLevelUnlocked;
  const storyBeatsUnlocked = [...user.storyBeatsUnlocked];

  if (
    payload.gameMode === "story" &&
    payload.storyLevel &&
    payload.storyLevel >= 1 &&
    payload.storyLevel <= STORY_LEVEL_COUNT &&
    payload.storyLevel <= user.storyLevelUnlocked
  ) {
    if (!storyBeatsUnlocked.includes(payload.storyLevel)) {
      storyBeatsUnlocked.push(payload.storyLevel);
    }

    if (
      payload.storyLevel === user.storyLevelUnlocked &&
      payload.storyLevel < STORY_LEVEL_COUNT
    ) {
      storyLevelUnlocked = payload.storyLevel + 1;
    } else if (
      payload.storyLevel === STORY_LEVEL_COUNT &&
      payload.storyLevel === user.storyLevelUnlocked
    ) {
      storyLevelUnlocked = STORY_LEVEL_COUNT + 1;
    }
  }

  const template = await findPuzzleTemplate(payload);

  if (template) {
    await prisma.userPuzzleAttempt.create({
      data: {
        userId: user.id,
        puzzleTemplateId: template.id,
        completedAt: now,
        timeSpentSeconds: payload.timeSeconds,
        mistakesCount: payload.mistakesCount,
        hintsUsed: payload.hintsUsed,
        xpEarned: xp,
      },
    });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      totalXp: user.totalXp + xp,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityDate: streak.lastActivityDate,
      storyLevelUnlocked,
      storyBeatsUnlocked,
    },
  });

  const attempts = await prisma.userPuzzleAttempt.findMany({
    where: { userId: user.id, completedAt: { not: null } },
    select: { mistakesCount: true, hintsUsed: true },
  });

  const totalMistakes = attempts.reduce((sum, a) => sum + a.mistakesCount, 0);
  const totalHintsUsed = attempts.reduce((sum, a) => sum + a.hintsUsed, 0);

  return {
    xp,
    saved: true,
    totalXp: updated.totalXp,
    hearts: updated.hearts,
    hints: updated.hints,
    currentStreak: updated.currentStreak,
    puzzlesCompleted: attempts.length,
    totalMistakes,
    totalHintsUsed,
    storyLevelUnlocked: updated.storyLevelUnlocked,
    storyBeatsUnlocked: updated.storyBeatsUnlocked,
  };
}
