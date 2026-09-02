import { Flame, Heart, Lightbulb } from "lucide-react";

import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

export function HeartIcon({ className }: IconProps) {
  return (
    <Heart
      className={cn("size-4 fill-red-500 text-red-500", className)}
      aria-hidden
    />
  );
}

export function HintIcon({ className }: IconProps) {
  return (
    <Lightbulb
      className={cn("size-4 fill-amber-300 text-amber-500", className)}
      aria-hidden
    />
  );
}

export function StreakIcon({
  className,
  active = true,
}: IconProps & { active?: boolean }) {
  return (
    <Flame
      className={cn(
        "size-4",
        active
          ? "fill-orange-500 text-orange-600"
          : "text-muted-foreground",
        className,
      )}
      aria-hidden
    />
  );
}
