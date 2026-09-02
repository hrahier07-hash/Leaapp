import { NextResponse } from "next/server";

import { recordPuzzleCompletion } from "@/lib/gamification/record-completion";
import type { CompletionPayload } from "@/lib/gamification/completion-types";
import { computeXpForCompletion } from "@/lib/gamification/xp";
import type { Difficulty } from "@/lib/sudoku/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    difficulty?: Difficulty;
    timeSeconds?: number;
    mistakesCount?: number;
    hintsUsed?: number;
    gameMode?: CompletionPayload["gameMode"];
    storyLevel?: number;
    dailyDateKey?: string;
  };

  const payload: CompletionPayload = {
    difficulty: body.difficulty ?? "facile",
    timeSeconds: body.timeSeconds ?? 0,
    mistakesCount: body.mistakesCount ?? 0,
    hintsUsed: body.hintsUsed ?? 0,
    gameMode: body.gameMode,
    storyLevel: body.storyLevel,
    dailyDateKey: body.dailyDateKey,
  };

  try {
    const result = await recordPuzzleCompletion(payload);
    return NextResponse.json(result);
  } catch {
    const xp = computeXpForCompletion(payload);
    return NextResponse.json({ xp, saved: false }, { status: 503 });
  }
}
