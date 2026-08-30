"use client";

import { Flame, Gem, Heart, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type TopBarProps = {
  hearts?: number;
  hints?: number;
  gems?: number;
  streak?: number;
  dailyXp?: number;
  className?: string;
};

export function TopBar({
  hearts = 5,
  hints = 5,
  gems = 0,
  streak = 0,
  dailyXp = 0,
  className,
}: TopBarProps) {
  const items = [
    { icon: Heart, value: hearts, color: "text-rose-500", label: "Cœurs" },
    { icon: Sparkles, value: hints, color: "text-sky-500", label: "Indices" },
    { icon: Gem, value: gems, color: "text-fuchsia-500", label: "Gemmes" },
    { icon: Flame, value: streak, color: "text-orange-500", label: "Streak" },
  ];

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-2xl bg-white/90 px-3 py-2 shadow-sm ring-1 ring-violet-100",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {items.map(({ icon: Icon, value, color, label }) => (
          <div key={label} className="flex items-center gap-1" title={label}>
            <Icon className={cn("size-4", color)} />
            <span className="text-sm font-bold">{value}</span>
          </div>
        ))}
      </div>
      <div className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-primary">
        +{dailyXp} XP
      </div>
    </div>
  );
}
