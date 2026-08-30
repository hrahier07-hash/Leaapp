import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <section className="flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center gap-8 py-8 text-center">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Sudoku mobile
        </p>
        <h2 className="text-3xl font-bold tracking-tight">
          Dessine les chiffres avec ton doigt
        </h2>
        <p className="text-base text-muted-foreground">
          App optimisée pour téléphone. Touche une case, dessine le chiffre en
          bas de l&apos;écran — l&apos;app le reconnaît automatiquement.
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link href="/app" className={cn(buttonVariants({ size: "lg" }), "h-12")}>
          Jouer maintenant
        </Link>
        <Link
          href="/onboarding"
          className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12")}
        >
          Découvrir le parcours
        </Link>
      </div>
    </section>
  );
}
