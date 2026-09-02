import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const count = await prisma.user.count();
    return NextResponse.json({ status: "ok", db: "connected", users: count });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return NextResponse.json(
      { status: "error", db: "disconnected", message },
      { status: 503 },
    );
  }
}
