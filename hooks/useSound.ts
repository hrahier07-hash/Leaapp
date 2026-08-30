"use client";

import { useCallback, useRef, useState } from "react";

type UseSoundOptions = {
  enabled?: boolean;
  volume?: number;
};

export function useSound({ enabled = true, volume = 0.4 }: UseSoundOptions = {}) {
  const cache = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [soundOn, setSoundOn] = useState(true);

  const play = useCallback(
    (src: string) => {
      if (!enabled || !soundOn || typeof window === "undefined") return;
      let audio = cache.current.get(src);
      if (!audio) {
        audio = new Audio(src);
        cache.current.set(src, audio);
      }
      audio.volume = volume;
      audio.currentTime = 0;
      void audio.play().catch(() => undefined);
    },
    [enabled, soundOn, volume],
  );

  return { play, soundOn, setSoundOn };
}

export const SOUNDS = {
  correct: "/sounds/correct.mp3",
  error: "/sounds/error.mp3",
  complete: "/sounds/complete.mp3",
  streak: "/sounds/streak.mp3",
} as const;
