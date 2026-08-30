import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Mascot } from "@/components/gamification/Mascot";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <section className="flex min-h-[calc(100dvh-5rem)] flex-col justify-center gap-8 py-8">
      <div className="surface-card p-6">
        <p className="text-sm font-medium text-muted-foreground">LeaDoku</p>
        <h2 className="mt-2 text-2xl font-bold">Apprends en jouant</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Remplis la grille, gagne des points, avance leçon par leçon.
        </p>
      </div>
      <Mascot mood="encouraging" message="Salut ! Prêt à remplir ta première grille ?" />
      <div className="flex flex-col gap-3">
        <Link href="/onboarding" className={cn(buttonVariants({ size: "lg" }), "h-12")}>
          Découvrir l&apos;app
        </Link>
        <Link href="/app" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12")}>
          Jouer
        </Link>
      </div>
    </section>
  );
}
