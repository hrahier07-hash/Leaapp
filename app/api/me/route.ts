import { NextResponse } from "next/server";

import { getSharedUserProfile } from "@/lib/user/shared-user";

export async function GET() {
  try {
    const profile = await getSharedUserProfile();
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json(
      { error: "base_indisponible" },
      { status: 503 },
    );
  }
}
