"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { getUnlockedBeats } from "@/content/story/grimoire-dechire";
import { STORY_WORLD_TITLE } from "@/content/story/grimoire-dechire";
import { useSharedUser } from "@/hooks/useSharedUser";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StoryGallery() {
  const { profile, loading } = useSharedUser();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (loading || !profile) return null;

  const beats = getUnlockedBeats(
    profile.storyLevelUnlocked,
    profile.storyBeatsUnlocked ?? [],
  );

  if (beats.length === 0) return null;

  const beat = beats[index];

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndex(Math.max(0, beats.length - 1));
          setOpen(true);
        }}
        className={cn(buttonVariants({ variant: "outline" }), "w-full gap-2")}
      >
        <BookOpen className="size-4" />
        Relire l&apos;histoire ({beats.length} scène{beats.length > 1 ? "s" : ""})
      </button>

      <AnimatePresence>
        {open && beat && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              aria-label="Fermer"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="relative z-10 w-full max-w-md rounded-2xl border-2 border-primary bg-background p-4 shadow-xl"
            >
              <p className="text-xs font-medium text-primary">
                {STORY_WORLD_TITLE} · Page {beat.level}
                {beat.isMilestone ? " · Page majeure" : ""}
              </p>
              {beat.chapterTitle && (
                <p className="mt-1 font-semibold">{beat.chapterTitle}</p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {beat.caption}
              </p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={index <= 0}
                  onClick={() => setIndex((i) => i - 1)}
                  className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
                  aria-label="Scène précédente"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="text-xs text-muted-foreground">
                  {index + 1} / {beats.length}
                </span>
                <button
                  type="button"
                  disabled={index >= beats.length - 1}
                  onClick={() => setIndex((i) => i + 1)}
                  className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
                  aria-label="Scène suivante"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants(), "mt-3 w-full")}
              >
                Fermer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
