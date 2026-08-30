"use client";

import { cn } from "@/lib/utils";

export type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  subtitle?: string;
};

type LeaderboardProps = {
  title: string;
  entries: LeaderboardEntry[];
  className?: string;
};

export function Leaderboard({ title, entries, className }: LeaderboardProps) {
  return (
    <div className={cn("rounded-2xl bg-white p-4 shadow-sm ring-1 ring-violet-100", className)}>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">{title}</h2>
      <ul className="space-y-2">
        {entries.map((entry) => (
          <li
            key={`${entry.rank}-${entry.name}`}
            className={cn(
              "flex items-center justify-between rounded-xl px-3 py-2",
              entry.rank <= 3 ? "bg-violet-50" : "bg-muted/40",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {entry.rank}
              </span>
              <div>
                <p className="text-sm font-semibold">{entry.name}</p>
                {entry.subtitle && (
                  <p className="text-xs text-muted-foreground">{entry.subtitle}</p>
                )}
              </div>
            </div>
            <span className="text-sm font-bold">{entry.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
