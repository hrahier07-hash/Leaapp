"use client";

import { Camera, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import type { SharedUserProfile } from "@/hooks/useSharedUser";
import { cn } from "@/lib/utils";

type ProfileEditorProps = {
  profile: SharedUserProfile;
  onUpdated: () => Promise<void>;
};

async function resizeImageToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const size = 200;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");

  const scale = Math.max(size / bitmap.width, size / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;
  ctx.drawImage(bitmap, x, y, w, h);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", 0.85);
}

export function ProfileEditor({ profile, onUpdated }: ProfileEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile.name ?? "Joueur LeaDoku");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(profile.name ?? "Joueur LeaDoku");
  }, [profile.name]);

  const initials = (profile.name ?? "L")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const saveProfile = async (payload: { name?: string; image?: string | null }) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("fail");
      await onUpdated();
      setMessage("Profil mis à jour.");
    } catch {
      setMessage("Impossible de sauvegarder. Réessaie.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveName = () => {
    void saveProfile({ name });
  };

  const handlePickPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Choisis une image (photo ou dessin).");
      return;
    }
    try {
      const image = await resizeImageToDataUrl(file);
      await saveProfile({ image });
    } catch {
      setMessage("Image trop lourde ou invalide.");
    } finally {
      event.target.value = "";
    }
  };

  const handleRemovePhoto = () => {
    void saveProfile({ image: null });
  };

  return (
    <div className="surface-card space-y-4 p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {profile.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.image}
              alt="Photo de profil"
              className="size-24 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary ring-2 ring-border">
              {initials || <User className="size-10" />}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={saving}
            className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow active:scale-95 disabled:opacity-50"
            aria-label="Changer la photo"
          >
            <Camera className="size-4" />
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handlePickPhoto(e)}
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={saving}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Changer la photo
          </button>
          {profile.image && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={saving}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Supprimer
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="profile-name" className="text-xs font-medium text-muted-foreground">
          Ton nom
        </label>
        <input
          id="profile-name"
          type="text"
          maxLength={24}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
          placeholder="Ton pseudo"
        />
        <button
          type="button"
          onClick={handleSaveName}
          disabled={saving || name.trim().length < 1}
          className={cn(buttonVariants(), "w-full")}
        >
          {saving ? "Enregistrement…" : "Enregistrer le nom"}
        </button>
      </div>

      {message && (
        <p className="text-center text-xs text-muted-foreground">{message}</p>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Compte partagé. Ta progression est sauvegardée ici.
      </p>
    </div>
  );
}
