import { NextResponse } from "next/server";

import { STORY_LEVEL_COUNT } from "@/lib/story/levels";
import { prisma } from "@/lib/db/client";
import { getOrCreateSharedUser } from "@/lib/user/shared-user";

export async function POST(request: Request) {
  const body = (await request.json()) as { level?: number };
  const level = body.level;

  if (!level || level < 1 || level > STORY_LEVEL_COUNT) {
    return NextResponse.json({ error: "niveau_invalide" }, { status: 400 });
  }

  try {
    const user = await getOrCreateSharedUser();

    if (level > user.storyLevelUnlocked) {
      return NextResponse.json({ error: "niveau_verrouille" }, { status: 403 });
    }

    const nextUnlocked =
      level === user.storyLevelUnlocked && level < STORY_LEVEL_COUNT
        ? level + 1
        : user.storyLevelUnlocked;

    await prisma.user.update({
      where: { id: user.id },
      data: { storyLevelUnlocked: nextUnlocked },
    });

    return NextResponse.json({
      ok: true,
      storyLevelUnlocked: nextUnlocked,
    });
  } catch {
    return NextResponse.json({ error: "base_indisponible" }, { status: 503 });
  }
}
