import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Mascot } from "@/components/gamification/Mascot";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <section className="flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center gap-8 py-8 text-center">
      <div className="w-full rounded-3xl gradient-hero p-8 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest opacity-90">
          Sudoku mobile
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Progresse en t&apos;amusant
        </h2>
        <p className="mt-3 text-base opacity-90">
          Parcours coloré, XP, streaks et dessin au doigt.
        </p>
      </div>
      <Mascot mood="surprised" message="Salut ! Prêt à devenir un maître du Sudoku ?" />
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link href="/onboarding" className={cn(buttonVariants({ size: "lg" }), "h-12")}>
          Commencer
        </Link>
        <Link href="/app" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12")}>
          Jouer maintenant
        </Link>
      </div>
    </section>
  );
}
