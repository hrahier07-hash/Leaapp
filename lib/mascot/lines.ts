export const MASCOT_LINES = {
  welcome: [
    "Salut ! Prêt à devenir un maître du Sudoku ?",
    "Chaque grille te rapproche de la couronne.",
  ],
  onboarding: {
    hook: "Le Sudoku, mais tu progresses vraiment.",
    levelTest: "Montre moi ton niveau avec cette grille.",
    motivation: "Quel est ton objectif principal ?",
    dailyGoal: "Combien de grilles par jour ?",
    lesson: "Regarde cette paire nue sur la mini grille.",
    summary: "Tu maîtrises déjà une vraie technique !",
    signup: "Crée ton compte pour sauvegarder ta progression.",
  },
  game: {
    goodMove: "Bien joué !",
    mistake: "Oups, ce n'est pas le bon chiffre.",
    hint: "Voici un indice logique.",
    complete: "Grille terminée ! Tu es incroyable.",
    streak: "Ta flamme brille encore aujourd'hui.",
  },
  empty: {
    leaderboard: "Sois le premier à compléter le défi du jour.",
    badges: "Termine des grilles pour débloquer des badges.",
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
  return "Continue, tu progresses !";
}
