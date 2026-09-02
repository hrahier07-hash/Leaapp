/** Interpolation visuelle du dégel du village (0 = givré, 1 = réveillé). */
export function getStoryProgressRatio(
  storyLevelUnlocked: number,
  storyBeatsUnlocked: number[],
): number {
  const fromBeats =
    storyBeatsUnlocked.length > 0 ? Math.max(...storyBeatsUnlocked) : 0;
  const fromUnlock = Math.max(0, storyLevelUnlocked - 1);
  const maxCompleted = Math.min(50, Math.max(fromBeats, fromUnlock));
  return maxCompleted / 50;
}

export type StoryWorldPalette = {
  background: string;
  card: string;
  accent: string;
  textMuted: string;
  particle: string;
  showParticles: boolean;
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(
  from: [number, number, number],
  to: [number, number, number],
  t: number,
): string {
  const r = Math.round(lerp(from[0], to[0], t));
  const g = Math.round(lerp(from[1], to[1], t));
  const b = Math.round(lerp(from[2], to[2], t));
  return `rgb(${r}, ${g}, ${b})`;
}

/** Palette bleu-gris givré → dégel → chaleur dorée. */
export function getStoryWorldPalette(ratio: number): StoryWorldPalette {
  const t = Math.max(0, Math.min(1, ratio));

  const frostBg: [number, number, number] = [214, 226, 238];
  const thawBg: [number, number, number] = [232, 228, 218];
  const warmBg: [number, number, number] = [255, 244, 228];

  const frostAccent: [number, number, number] = [96, 130, 168];
  const warmAccent: [number, number, number] = [218, 148, 72];

  let background: string;
  if (t < 0.3) {
    background = lerpColor(frostBg, thawBg, t / 0.3);
  } else {
    background = lerpColor(thawBg, warmBg, (t - 0.3) / 0.7);
  }

  const accent = lerpColor(frostAccent, warmAccent, t);

  return {
    background,
    card: t < 0.5 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.78)",
    accent,
    textMuted: t < 0.4 ? "rgb(100, 116, 139)" : "rgb(120, 90, 70)",
    particle: t > 0.7 ? "rgba(255, 200, 100, 0.7)" : "rgba(180, 210, 255, 0.4)",
    showParticles: t > 0.55,
  };
}

export function getChapterLabel(level: number): string {
  const chapter = Math.ceil(level / 5);
  const titles = [
    "La Nuit de l'Orage",
    "L'Ombre du Vieux Mage",
    "Premiers Signes d'Espoir",
    "L'Ombre Grandit",
    "Le Poids du Passé",
    "Les Souvenirs Gelés",
    "La Course contre le Temps",
    "Le Prix de la Vérité",
    "La Dernière Page",
    "Le Village Se Réveille",
  ];
  return titles[chapter - 1] ?? "Le Grimoire Déchiré";
}
