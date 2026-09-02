export type StorySoundCue = "minor" | "major";

export type StoryBeat = {
  level: number;
  chapterTitle?: string;
  isMilestone: boolean;
  caption: string;
  imagePrompt: string;
  imageAsset: string;
  soundCue?: StorySoundCue;
};

export const STORY_WORLD_TITLE = "Le Grimoire Déchiré";

export const STORY_WORLD_PITCH =
  "Elian a déchiré le grimoire ancestral de son village. Chaque grille résolue restaure une page perdue et rapproche le village du réveil.";
