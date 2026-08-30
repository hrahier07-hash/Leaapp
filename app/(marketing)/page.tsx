import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Sudoku gamifié
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Le Sudoku, mais tu progresses vraiment
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Parcours pédagogique de techniques, XP, streaks, ligues et une
          mascotte pour t&apos;accompagner — dans l&apos;esprit de Duolingo.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/onboarding"
          className={cn(buttonVariants({ size: "lg" }))}
        >
          Commencer gratuitement
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
        >
          J&apos;ai déjà un compte
        </Link>
      </div>
    </section>
  );
}
