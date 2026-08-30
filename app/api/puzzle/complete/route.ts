import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { computeXpForCompletion, updateStreak } from "@/lib/gamification/xp";
import { prisma } from "@/lib/db/client";
import type { Difficulty } from "@/lib/sudoku/types";

export async function POST(request: Request) {
  const session = await auth();
  const body = (await request.json()) as {
    puzzleTemplateId?: string;
    difficulty?: Difficulty;
    timeSeconds?: number;
    mistakesCount?: number;
    hintsUsed?: number;
  };

  const xp = computeXpForCompletion({
    difficulty: body.difficulty ?? "facile",
    timeSeconds: body.timeSeconds ?? 0,
    mistakesCount: body.mistakesCount ?? 0,
    hintsUsed: body.hintsUsed ?? 0,
  });

  if (!session?.user?.id) {
    return NextResponse.json({ xp, saved: false });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ xp, saved: false });
  }

  const streak = updateStreak(
    user.currentStreak,
    user.longestStreak,
    user.lastActivityDate,
    user.timezone,
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      totalXp: user.totalXp + xp,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityDate: streak.lastActivityDate,
    },
  });

  if (body.puzzleTemplateId) {
    await prisma.userPuzzleAttempt.create({
      data: {
        userId: user.id,
        puzzleTemplateId: body.puzzleTemplateId,
        completedAt: new Date(),
        timeSpentSeconds: body.timeSeconds,
        mistakesCount: body.mistakesCount ?? 0,
        hintsUsed: body.hintsUsed ?? 0,
        xpEarned: xp,
      },
    });
  }

  return NextResponse.json({ xp, saved: true, streak: streak.currentStreak });
}
