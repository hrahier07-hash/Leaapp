import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/client";
import { getSharedUserProfile, getOrCreateSharedUser } from "@/lib/user/shared-user";

export async function POST() {
  try {
    const user = await getOrCreateSharedUser();
    if (user.hints <= 0) {
      return NextResponse.json({ error: "plus_d_indices" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { hints: user.hints - 1 },
    });

    const profile = await getSharedUserProfile();
    return NextResponse.json({ hints: profile.hints, hearts: profile.hearts });
  } catch {
    return NextResponse.json({ error: "base_indisponible" }, { status: 503 });
  }
}
