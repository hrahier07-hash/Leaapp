import { NextResponse } from "next/server";

import {
  generateDailyChallenge,
  getDailyDifficultyLabel,
} from "@/lib/daily/challenge";
import { formatParisDateLabel, getParisDateKey } from "@/lib/daily/time";
import { prisma } from "@/lib/db/client";

export async function GET() {
  const dateKey = getParisDateKey();

  try {
    const challenge = generateDailyChallenge(dateKey);

    try {
      const existing = await prisma.puzzleTemplate.findFirst({
        where: { isDailyChallenge: true, dailyChallengeDate: new Date(dateKey) },
      });

      if (!existing) {
        await prisma.puzzleTemplate.create({
          data: {
            difficulty: challenge.difficulty,
            gridInitial: challenge.puzzle,
            gridSolution: challenge.solution,
            techniquesRequired: [
              `pattern:${challenge.patternId}`,
              challenge.patternName,
            ],
            isDailyChallenge: true,
            dailyChallengeDate: new Date(dateKey),
          },
        });
      }
    } catch {
      // Base optionnelle pour l'aperçu
    }

    return NextResponse.json({
      date: dateKey,
      dateLabel: formatParisDateLabel(dateKey),
      pattern: {
        id: challenge.patternId,
        name: challenge.patternName,
        description: challenge.patternDescription,
      },
      difficulty: challenge.difficulty,
      difficultyLabel: getDailyDifficultyLabel(challenge.difficulty),
      clueCount: challenge.clueCount,
      timezone: "Europe/Paris",
    });
  } catch {
    return NextResponse.json(
      { error: "generation_echouee", date: dateKey },
      { status: 500 },
    );
  }
}
