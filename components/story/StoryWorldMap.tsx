"use client";

import Link from "next/link";
import { Check, Lock, Sparkles } from "lucide-react";

import { getStoryBeat, STORY_WORLD_PITCH, STORY_WORLD_TITLE } from "@/content/story/grimoire-dechire";
import { MobileShell } from "@/components/layout/MobileShell";
import { STORY_LEVEL_COUNT, getStoryLevelLabel } from "@/lib/story/levels";
import {
  getStoryProgressRatio,
  getStoryWorldPalette,
} from "@/lib/story/world-visual";
import { useSharedUser } from "@/hooks/useSharedUser";
import { cn } from "@/lib/utils";

function AmbientParticles({ color }: { color: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute size-1 rounded-full animate-pulse"
          style={{
            backgroundColor: color,
            left: `${(i * 23 + 5) % 95}%`,
            top: `${(i * 31 + 10) % 80}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

export function StoryWorldMap() {
  const { profile, loading } = useSharedUser();
  const maxUnlocked = profile?.storyLevelUnlocked ?? 1;
  const beatsUnlocked = profile?.storyBeatsUnlocked ?? [];
  const allComplete = maxUnlocked > STORY_LEVEL_COUNT;

  const progressRatio = getStoryProgressRatio(maxUnlocked, beatsUnlocked);
  const palette = getStoryWorldPalette(progressRatio);
  const nextLevel = Math.min(maxUnlocked, STORY_LEVEL_COUNT);
  const cliffLevel =
    !allComplete && maxUnlocked <= STORY_LEVEL_COUNT
      ? Math.min(maxUnlocked + 1, STORY_LEVEL_COUNT)
      : null;
  const cliffhangerBeat = cliffLevel ? getStoryBeat(cliffLevel) : null;

  return (
    <MobileShell title="Monde Histoire">
      <div
        className="relative -mx-4 min-h-[calc(100dvh-8rem)] space-y-4 px-4 py-2 pb-6 transition-colors duration-700"
        style={{ backgroundColor: palette.background }}
      >
        {palette.showParticles && <AmbientParticles color={palette.particle} />}

        <div
          className="relative surface-card border-0 p-4 shadow-sm backdrop-blur-sm"
          style={{ backgroundColor: palette.card }}
        >
          <p className="font-heading text-xs font-medium uppercase tracking-wide" style={{ color: palette.accent }}>
            {STORY_WORLD_TITLE}
          </p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: palette.textMuted }}>
            {STORY_WORLD_PITCH}
          </p>
          <p className="mt-2 font-semibold">
            {loading
              ? "Chargement…"
              : allComplete
                ? "Histoire terminée !"
                : `Page ${Math.min(maxUnlocked, STORY_LEVEL_COUNT)} sur ${STORY_LEVEL_COUNT}`}
          </p>
        </div>

        {!allComplete && cliffhangerBeat && cliffLevel && (
          <div
            className="relative overflow-hidden rounded-2xl border border-dashed p-4"
            style={{ borderColor: palette.accent, backgroundColor: palette.card }}
          >
            <p className="text-xs font-semibold" style={{ color: palette.accent }}>
              Que va révéler la page suivante ?
            </p>
            <p className="mt-2 blur-[3px] select-none text-sm leading-relaxed opacity-70">
              {cliffhangerBeat.caption.slice(0, 120)}…
            </p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                Finis le niveau {nextLevel} pour débloquer la page {cliffLevel}
              </p>
              <Link
                href={`/app/jouer?histoire=${nextLevel}`}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-primary-foreground active:scale-95"
                style={{ backgroundColor: palette.accent }}
              >
                Jouer maintenant
              </Link>
            </div>
          </div>
        )}

        <div className="relative grid grid-cols-5 gap-2">
          {Array.from({ length: STORY_LEVEL_COUNT }, (_, i) => {
            const level = i + 1;
            const isLocked = level > maxUnlocked;
            const isDone = level < maxUnlocked || (level === STORY_LEVEL_COUNT && allComplete);
            const isCurrent = level === maxUnlocked && !allComplete;
            const isMilestone = level % 5 === 0;

            const cell = (
              <div
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-bold transition-colors",
                  isLocked && "bg-black/5 text-muted-foreground",
                  isDone && "bg-primary/20 text-primary",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/40",
                  !isLocked && "active:scale-95",
                )}
                style={
                  isDone && progressRatio > 0.35
                    ? { boxShadow: `0 0 0 1px ${palette.accent}33` }
                    : undefined
                }
              >
                {isMilestone && !isLocked && (
                  <Sparkles className="absolute right-0.5 top-0.5 size-2.5 opacity-70" />
                )}
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
              return (
                <div key={level} title={`Niveau ${level} verrouillé`}>
                  {cell}
                </div>
              );
            }

            return (
              <Link
                key={level}
                href={`/app/jouer?histoire=${level}`}
                title={`Niveau ${level} · ${getStoryLevelLabel(level)}`}
              >
                {cell}
              </Link>
            );
          })}
        </div>

        {nextLevel && !allComplete && (
          <p className="relative text-center text-xs text-muted-foreground">
            Résous la grille pour déchiffrer la page {nextLevel}.
          </p>
        )}
      </div>
    </MobileShell>
  );
}
