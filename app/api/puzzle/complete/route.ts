import { NextResponse } from "next/server";

import { computeXpForCompletion, updateStreak } from "@/lib/gamification/xp";
import { prisma } from "@/lib/db/client";
import { getOrCreateSharedUser } from "@/lib/user/shared-user";
import type { Difficulty } from "@/lib/sudoku/types";

export async function POST(request: Request) {
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

  try {
    const user = await getOrCreateSharedUser();

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
        hints: Math.max(0, user.hints - (body.hintsUsed ?? 0)),
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
    } else {
      const template = await prisma.puzzleTemplate.findFirst({
        where: { difficulty: body.difficulty ?? "facile" },
      });
      if (template) {
        await prisma.userPuzzleAttempt.create({
          data: {
            userId: user.id,
            puzzleTemplateId: template.id,
            completedAt: new Date(),
            timeSpentSeconds: body.timeSeconds,
            mistakesCount: body.mistakesCount ?? 0,
            hintsUsed: body.hintsUsed ?? 0,
            xpEarned: xp,
          },
        });
      }
    }

    return NextResponse.json({
      xp,
      saved: true,
      streak: streak.currentStreak,
      totalXp: user.totalXp + xp,
    });
  } catch {
    return NextResponse.json({ xp, saved: false });
  }
}
