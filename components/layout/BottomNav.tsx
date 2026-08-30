"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Trophy,
  Target,
  ShoppingBag,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Accueil", icon: Home },
  { href: "/app/classement", label: "Classement", icon: Trophy },
  { href: "/app/defi-du-jour", label: "Défis", icon: Target },
  { href: "/app/boutique", label: "Boutique", icon: ShoppingBag },
  { href: "/app/profil", label: "Profil", icon: User },
] as const;

type BottomNavProps = {
  className?: string;
};

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "sticky bottom-0 z-20 border-t border-violet-100 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-end justify-between">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-semibold transition active:scale-95",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("size-5", active && "stroke-[2.5]")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
