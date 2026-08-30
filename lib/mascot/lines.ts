export const MASCOT_LINES = {
  welcome: [
    "Salut ! On remplit la grille ensemble ?",
    "Chaque grille te rend plus fort au Sudoku.",
  ],
  onboarding: {
    hook: "Apprends le Sudoku pas à pas.",
    levelTest: "Résous quelques cases pour voir ton niveau.",
    motivation: "Tu joues surtout pour…",
    dailyGoal: "Combien de grilles par jour ?",
    lesson: "Ici, deux cases ne peuvent prendre que deux chiffres.",
    summary: "Tu connais déjà la paire nue. Bien joué !",
  },
  game: {
    goodMove: "Bon chiffre !",
    mistake: "Ce chiffre ne va pas ici.",
    hint: "Regarde cette case.",
    complete: "Grille finie !",
    streak: "Tu as joué plusieurs jours d'affilée.",
  },
  empty: {
    leaderboard: "Personne n'a fini la grille du jour.",
    badges: "Finis des grilles pour gagner des badges.",
  },
} as const;

export type MascotMood =
  | "proud"
  | "encouraging"
  | "worried"
  | "surprised"
  | "neutral";

export function getMascotLine(
  context: keyof typeof MASCOT_LINES,
  sub?: string,
): string {
  const block = MASCOT_LINES[context];
  if (typeof block === "string") return block;
  if (Array.isArray(block)) {
    return block[Math.floor(Math.random() * block.length)];
  }
  if (sub && sub in block) {
    const lines = block[sub as keyof typeof block];
    if (typeof lines === "string") return lines;
  }
  return "Continue, tu y es presque.";
}
