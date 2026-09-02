"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/BottomNav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MobileShellProps = {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
  headerAction?: ReactNode;
};

export function MobileShell({
  children,
  title = "LeaDoku",
  showNav = true,
  headerAction,
}: MobileShellProps) {
  return (
    <div className="mobile-app flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 bg-background/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">LeaDoku</p>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          {headerAction}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
        {children}
      </main>

      {showNav && <BottomNav />}
    </div>
  );
}

export function QuickPlayBanner() {
  return (
    <Link
      href="/app/jouer"
      className={cn(
        buttonVariants({ size: "lg" }),
        "flex h-14 w-full items-center justify-between px-5",
      )}
    >
      <span className="font-semibold">Grille libre</span>
      <span className="text-sm opacity-80">Jouer →</span>
    </Link>
  );
}
