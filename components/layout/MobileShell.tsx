"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";

type MobileShellProps = {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
  headerExtra?: ReactNode;
};

export function MobileShell({
  children,
  title = "Sudoku Quest",
  showNav = true,
  headerExtra,
}: MobileShellProps) {
  return (
    <div className="mobile-app flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Sudoku Quest
            </p>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </div>
          {headerExtra}
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
        "mt-4 flex items-center justify-between rounded-2xl px-4 py-4 text-white shadow-lg active:scale-[0.98]",
        "gradient-hero",
      )}
    >
      <div>
        <p className="text-sm font-semibold opacity-90">Grille libre</p>
        <p className="text-lg font-bold">Jouer maintenant</p>
      </div>
      <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
        GO
      </span>
    </Link>
  );
}
