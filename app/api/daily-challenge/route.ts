import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/client";
import { DAILY_LEADERBOARD_KEY, redis } from "@/lib/redis";
import { FACILE_GRID, FACILE_SOLUTION } from "@/lib/sudoku/fixtures";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const dateKey = todayKey();
  let puzzle = await prisma.puzzleTemplate.findFirst({
    where: { isDailyChallenge: true, dailyChallengeDate: new Date(dateKey) },
  });

  if (!puzzle) {
    puzzle = await prisma.puzzleTemplate.create({
      data: {
        difficulty: "facile",
        gridInitial: FACILE_GRID,
        gridSolution: FACILE_SOLUTION,
        techniquesRequired: ["naked-single"],
        isDailyChallenge: true,
        dailyChallengeDate: new Date(dateKey),
      },
    });
  }

  const leaderboard: { member: string; score: number }[] = [];
  if (redis) {
    const raw = await redis.zrange(DAILY_LEADERBOARD_KEY, 0, 9, {
      rev: true,
      withScores: true,
    });
    if (Array.isArray(raw)) {
      for (let i = 0; i < raw.length; i += 2) {
        leaderboard.push({
          member: String(raw[i]),
          score: Number(raw[i + 1]),
        });
      }
    }
  }

  return NextResponse.json({ puzzle, leaderboard, date: dateKey });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { userId: string; timeSeconds: number };
  if (!redis) {
    return NextResponse.json({ ok: false, reason: "redis_unconfigured" });
  }

  await redis.zadd(DAILY_LEADERBOARD_KEY, {
    score: body.timeSeconds,
    member: body.userId,
  });

  return NextResponse.json({ ok: true });
}
