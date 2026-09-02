import { NextResponse } from "next/server";

import { getSharedUserProfile } from "@/lib/user/shared-user";
import { updateSharedUserProfile } from "@/lib/user/update-profile";

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

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      image?: string | null;
    };

    const profile = await updateSharedUserProfile({
      name: body.name,
      image: body.image,
    });

    return NextResponse.json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : "erreur";
    if (message === "nom_invalide") {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message === "image_invalide") {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: "base_indisponible" }, { status: 503 });
  }
}
