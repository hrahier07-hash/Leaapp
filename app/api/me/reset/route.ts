import { NextResponse } from "next/server";

import { getSharedUserProfile } from "@/lib/user/shared-user";
import { resetSharedUser } from "@/lib/user/reset-shared-user";

export async function POST() {
  try {
    await resetSharedUser();
    const profile = await getSharedUserProfile();
    return NextResponse.json({ ok: true, profile });
  } catch {
    return NextResponse.json({ error: "reset_echoue" }, { status: 503 });
  }
}
