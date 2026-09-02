"use client";

import { useSharedUser } from "@/hooks/useSharedUser";
import { HeartIcon, HintIcon, StreakIcon } from "@/components/gamification/ResourceIcons";
import { cn } from "@/lib/utils";

type TopBarProps = {
  className?: string;
};

export function TopBar({ className }: TopBarProps) {
  const { profile, loading } = useSharedUser();

  const hearts = profile?.hearts ?? 5;
  const hints = profile?.hints ?? 5;
  const streak = profile?.currentStreak ?? 0;
  const xp = profile?.totalXp ?? 0;

  return (
    <div
      className={cn(
        "flex items-center justify-between surface-card px-3 py-2.5",
        className,
      )}
    >
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1" title="Vies">
          <HeartIcon />
          <strong className="text-red-600">{loading ? "…" : hearts}</strong>
        </span>
        <span className="flex items-center gap-1" title="Indices">
          <HintIcon />
          <strong className="text-amber-600">{loading ? "…" : hints}</strong>
        </span>
        <span className="flex items-center gap-1" title="Jours d'affilée">
          <StreakIcon active={streak > 0} />
          <strong className={streak > 0 ? "text-orange-600" : undefined}>
            {loading ? "…" : streak}
          </strong>
        </span>
      </div>
      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
        {loading ? "…" : `${xp} pts`}
      </span>
    </div>
  );
}
