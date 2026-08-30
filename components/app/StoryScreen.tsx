"use client";

import Link from "next/link";
import { Check, Lock } from "lucide-react";

import { MobileShell } from "@/components/layout/MobileShell";
import { STORY_LEVEL_COUNT, getStoryLevelLabel } from "@/lib/story/levels";
import { useSharedUser } from "@/hooks/useSharedUser";
import { cn } from "@/lib/utils";

export function StoryScreen() {
  const { profile, loading } = useSharedUser();
  const maxUnlocked = profile?.storyLevelUnlocked ?? 1;

  return (
    <MobileShell title="Histoire">
      <div className="space-y-4 py-2 pb-4">
        <div className="surface-card p-4">
          <p className="text-sm text-muted-foreground">50 niveaux de plus en plus durs</p>
          <p className="mt-1 font-semibold">
            {loading
              ? "Chargement…"
              : `Niveau ${Math.min(maxUnlocked, STORY_LEVEL_COUNT)} sur ${STORY_LEVEL_COUNT}`}
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: STORY_LEVEL_COUNT }, (_, i) => {
            const level = i + 1;
            const isLocked = level > maxUnlocked;
            const isDone = level < maxUnlocked;
            const isCurrent = level === maxUnlocked;

            const cell = (
              <div
                className={cn(
                  "flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-bold",
                  isLocked && "bg-muted text-muted-foreground",
                  isDone && "bg-primary/15 text-primary",
                  isCurrent && "bg-primary text-primary-foreground",
                  !isLocked && "active:scale-95",
                )}
              >
                {isLocked ? (
                  <Lock className="size-3.5" />
                ) : isDone ? (
                  <Check className="size-4" />
                ) : (
                  level
                )}
              </div>
            );

            if (isLocked) {
              return <div key={level}>{cell}</div>;
            }

            return (
              <Link key={level} href={`/app/jouer?histoire=${level}`} title={`Niveau ${level} · ${getStoryLevelLabel(level)}`}>
                {cell}
              </Link>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Finis un niveau pour débloquer le suivant.
        </p>
      </div>
    </MobileShell>
  );
}
