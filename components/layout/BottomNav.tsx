"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, User } from "lucide-react";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Accueil", icon: Home },
  { href: "/app/defi-du-jour", label: "Défi", icon: Grid3X3 },
  { href: "/app/profil", label: "Profil", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 border-t bg-card/95 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <div className="flex justify-around">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/app" ? pathname === "/app" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 text-[11px] font-medium active:scale-95",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
