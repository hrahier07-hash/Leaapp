"use client";

import { MobileShell } from "@/components/layout/MobileShell";
import { Gem, Flame, Lightbulb, Crown } from "lucide-react";

const ITEMS = [
  { icon: Lightbulb, title: "Pack indices", price: "50 gemmes", color: "bg-sky-100 text-sky-700" },
  { icon: Flame, title: "Streak freeze", price: "80 gemmes", color: "bg-orange-100 text-orange-700" },
  { icon: Crown, title: "Skin mascotte", price: "120 gemmes", color: "bg-violet-100 text-violet-700" },
  { icon: Gem, title: "Premium mensuel", price: "Stripe test", color: "bg-fuchsia-100 text-fuchsia-700" },
];

export default function BoutiquePage() {
  return (
    <MobileShell title="Boutique">
      <div className="grid gap-3 py-2">
        {ITEMS.map(({ icon: Icon, title, price, color }) => (
          <button
            key={title}
            type="button"
            className="flex items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-violet-100 active:scale-[0.98]"
          >
            <div className={`flex size-12 items-center justify-center rounded-xl ${color}`}>
              <Icon className="size-6" />
            </div>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-muted-foreground">{price}</p>
            </div>
          </button>
        ))}
      </div>
    </MobileShell>
  );
}
