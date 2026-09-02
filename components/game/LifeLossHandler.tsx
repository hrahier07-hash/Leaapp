"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { HeartIcon } from "@/components/gamification/ResourceIcons";
import { MISTAKES_PER_LIFE } from "@/lib/user/daily-resources";
import { formatCountdown, getMsUntilParisMidnight } from "@/lib/daily/time";
import { useSharedUser } from "@/hooks/useSharedUser";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

export function LifeLossHandler() {
  const mistakes = useGameStore((s) => s.mistakes);
  const isComplete = useGameStore((s) => s.isComplete);
  const restartPuzzle = useGameStore((s) => s.restartPuzzle);
  const { refresh } = useSharedUser();
  const [outOfLives, setOutOfLives] = useState(false);
  const processingRef = useRef(false);

  useEffect(() => {
    if (mistakes < MISTAKES_PER_LIFE || isComplete || processingRef.current) return;

    processingRef.current = true;

    void (async () => {
      try {
        const res = await fetch("/api/me/lose-life", { method: "POST" });
        if (!res.ok) {
          setOutOfLives(true);
          return;
        }

        const data = (await res.json()) as { hearts: number; hints: number };
        await refresh();

        if (data.hearts <= 0) {
          setOutOfLives(true);
          return;
        }

        restartPuzzle();
        useGameStore.setState({ hintsBudget: data.hints });
      } finally {
        processingRef.current = false;
      }
    })();
  }, [mistakes, isComplete, restartPuzzle, refresh]);

  if (!outOfLives) return null;

  return <NoLivesOverlay />;
}

function NoLivesOverlay() {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const tick = () => setCountdown(formatCountdown(getMsUntilParisMidnight()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl border-2 border-primary bg-background p-5 text-center shadow-xl">
        <HeartIcon className="mx-auto size-10" />
        <p className="mt-3 text-lg font-bold">Plus de vies</p>
        <p className="mt-2 text-sm text-muted-foreground">
          3 erreurs ont coûté ta dernière vie. Reviens demain ou attends minuit
          (heure de Paris) pour retrouver 5 vies et 5 indices.
        </p>
        {countdown && (
          <p className="mt-3 text-sm font-semibold text-primary">
            Recharge dans {countdown}
          </p>
        )}
        <Link href="/app" className={cn(buttonVariants(), "mt-4 w-full")}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

export function NoLivesGate({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useSharedUser();
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const tick = () => setCountdown(formatCountdown(getMsUntilParisMidnight()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">Chargement…</p>
    );
  }

  if (profile && profile.hearts <= 0) {
    return (
      <div className="space-y-4 py-8 text-center">
        <HeartIcon className="mx-auto size-12" />
        <p className="text-lg font-bold">Plus de vies aujourd&apos;hui</p>
        <p className="text-sm text-muted-foreground">
          Tes vies et indices se rechargent à minuit (heure de Paris).
        </p>
        {countdown && (
          <p className="text-sm font-semibold text-primary">Dans {countdown}</p>
        )}
        <Link href="/app" className={cn(buttonVariants(), "mx-auto w-full max-w-xs")}>
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
