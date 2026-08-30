"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

import { Mascot } from "@/components/gamification/Mascot";
import { MobileShell } from "@/components/layout/MobileShell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <MobileShell title="Connexion" showNav={false}>
      <div className="flex min-h-[70dvh] flex-col gap-6 py-6">
        <Mascot mood="encouraging" message="Connecte toi pour sauvegarder ta progression et tes streaks." />
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/app" })}
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          Continuer avec Google
        </button>
        <button
          type="button"
          onClick={() => signIn("resend", { callbackUrl: "/app" })}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
        >
          Lien magique par email
        </button>
        <Link href="/app" className="mt-auto text-center text-sm text-muted-foreground underline">
          Continuer sans compte
        </Link>
      </div>
    </MobileShell>
  );
}
