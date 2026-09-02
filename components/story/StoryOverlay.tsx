"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Share2, Sparkles } from "lucide-react";

import type { StoryBeat } from "@/lib/story/types";
import { STORY_WORLD_TITLE } from "@/content/story/grimoire-dechire";
import { buttonVariants } from "@/components/ui/button";
import { useSound, SOUNDS } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

type StoryOverlayProps = {
  beat: StoryBeat;
  open: boolean;
  onContinue: () => void;
};

function StoryImage({
  src,
  alt,
  className,
  fallbackLabel,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-primary/10 text-primary",
          className,
        )}
      >
        <div className="text-center px-3">
          <BookOpen className="mx-auto mb-1 size-8 opacity-60" />
          <p className="text-xs font-medium opacity-80">{fallbackLabel}</p>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

function GoldenParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute size-1 rounded-full bg-amber-300/80"
          initial={{
            x: `${(i * 17) % 100}%`,
            y: "110%",
            opacity: 0,
          }}
          animate={{
            y: "-10%",
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function NormalBeatCard({ beat, onContinue }: { beat: StoryBeat; onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, rotate: 2 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      exit={{ opacity: 0, x: -20, rotate: -1 }}
      transition={{ type: "spring", damping: 22, stiffness: 280 }}
      className="relative z-10 w-full max-w-[min(100%,22rem)] overflow-hidden rounded-2xl border-2 border-primary bg-background/85 shadow-xl backdrop-blur-sm"
    >
      <div className="border-b border-primary/20 bg-primary/5 px-4 py-2">
        <p className="text-xs font-medium text-primary">
          Page {beat.level} · {STORY_WORLD_TITLE}
        </p>
      </div>
      <div className="flex gap-3 p-4">
        <StoryImage
          src={beat.imageAsset}
          alt=""
          fallbackLabel={`Scène ${beat.level}`}
          className="size-16 shrink-0 rounded-xl object-cover ring-1 ring-border"
        />
        <p className="text-sm leading-relaxed text-foreground/90">{beat.caption}</p>
      </div>
      <div className="px-4 pb-4">
        <button type="button" onClick={onContinue} className={cn(buttonVariants(), "w-full")}>
          Continuer
        </button>
      </div>
    </motion.div>
  );
}

function MilestoneBeatScreen({
  beat,
  onContinue,
  isFinale,
}: {
  beat: StoryBeat;
  onContinue: () => void;
  isFinale: boolean;
}) {
  const { play } = useSound({ volume: 0.35 });

  useEffect(() => {
    play(SOUNDS.complete);
  }, [play]);

  const handleShare = async () => {
    const text = `J'ai terminé « ${STORY_WORLD_TITLE} » sur LeaDoku !`;
    if (navigator.share) {
      await navigator.share({ title: STORY_WORLD_TITLE, text }).catch(() => undefined);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl border-2 border-primary bg-background/90 shadow-2xl backdrop-blur-sm"
    >
      <GoldenParticles />
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <StoryImage
            src={beat.imageAsset}
            alt=""
            fallbackLabel={beat.chapterTitle ?? `Page majeure ${beat.level}`}
            className="aspect-[4/3] w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="relative space-y-3 overflow-y-auto px-4 py-4">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="size-4" />
          <p className="text-xs font-semibold uppercase tracking-wide">Page majeure</p>
        </div>
        {beat.chapterTitle && (
          <h2 className="text-lg font-bold leading-tight">{beat.chapterTitle}</h2>
        )}
        <p className="text-sm leading-relaxed text-muted-foreground">{beat.caption}</p>

        {isFinale ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2 rounded-xl bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground"
          >
            <p className="font-semibold text-foreground">Fin du Grimoire Déchiré</p>
            <p>
              Le village se réveille. Une suite pourrait commencer — un nouveau chapitre
              attend peut-être Elian et Sylvaine…
            </p>
          </motion.div>
        ) : null}

        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={onContinue}
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            {isFinale ? "Célébrer et continuer" : "Continuer l'histoire"}
          </button>
          {isFinale && (
            <>
              <button
                type="button"
                onClick={() => void handleShare()}
                className={cn(buttonVariants({ variant: "outline" }), "w-full gap-2")}
              >
                <Share2 className="size-4" />
                J&apos;ai terminé Le Grimoire Déchiré
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function StoryOverlay({ beat, open, onContinue }: StoryOverlayProps) {
  const isFinale = beat.level === 50;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            aria-label="Fermer"
            onClick={onContinue}
          />

          {beat.isMilestone ? (
            <MilestoneBeatScreen beat={beat} onContinue={onContinue} isFinale={isFinale} />
          ) : (
            <NormalBeatCard beat={beat} onContinue={onContinue} />
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
