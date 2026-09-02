import { prisma } from "@/lib/db/client";
import { getSharedUserProfile, getOrCreateSharedUser } from "@/lib/user/shared-user";

const MAX_NAME_LENGTH = 24;
const MAX_IMAGE_LENGTH = 600_000;

export type ProfileUpdateInput = {
  name?: string;
  image?: string | null;
};

export function sanitizeProfileName(name: string): string | null {
  const trimmed = name.trim().replace(/\s+/g, " ");
  if (trimmed.length < 1 || trimmed.length > MAX_NAME_LENGTH) return null;
  return trimmed;
}

export function sanitizeProfileImage(image: string | null | undefined): string | null | undefined {
  if (image === undefined) return undefined;
  if (image === null || image === "") return null;
  if (!image.startsWith("data:image/")) return null;
  if (image.length > MAX_IMAGE_LENGTH) return null;
  return image;
}

export async function updateSharedUserProfile(input: ProfileUpdateInput) {
  const user = await getOrCreateSharedUser();
  const data: { name?: string; image?: string | null } = {};

  if (input.name !== undefined) {
    const name = sanitizeProfileName(input.name);
    if (!name) throw new Error("nom_invalide");
    data.name = name;
  }

  if (input.image !== undefined) {
    const image = sanitizeProfileImage(input.image);
    if (image === null && input.image !== null && input.image !== "") {
      throw new Error("image_invalide");
    }
    data.image = image ?? null;
  }

  if (Object.keys(data).length === 0) {
    throw new Error("rien_a_modifier");
  }

  await prisma.user.update({
    where: { id: user.id },
    data,
  });

  return getSharedUserProfile();
}
