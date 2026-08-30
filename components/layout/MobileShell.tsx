"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

type MobileShellProps = {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
};

export function MobileShell({
  children,
  title = "Sudoku Quest",
  showNav = true,
}: MobileShellProps) {
  const pathname = usePathname();
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <div className="mobile-app flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Mobile
            </p>
            <h1 className="text-lg font-bold leading-tight">{title}</h1>
          </div>
          {pathname.startsWith("/app") && (
            <button
              type="button"
              onClick={resetGame}
              className="flex size-10 items-center justify-center rounded-full bg-muted active:scale-95"
              aria-label="Recommencer la grille"
            >
              <RotateCcw className="size-4" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
        {children}
      </main>

      {showNav && (
        <nav className="sticky bottom-0 z-20 border-t bg-background/95 px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
          <div className="flex items-center justify-around">
            <Link
              href="/"
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition-colors active:scale-95",
                pathname === "/"
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              <Home className="size-5" />
              Accueil
            </Link>
            <Link
              href="/app"
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition-colors active:scale-95",
                pathname.startsWith("/app")
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              <span className="flex size-5 items-center justify-center rounded-md border-2 border-current text-[10px] font-bold">
                9
              </span>
              Jouer
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
