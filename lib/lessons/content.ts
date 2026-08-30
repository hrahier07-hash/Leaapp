export type LessonStep = {
  title: string;
  text: string;
  /** Petite grille 4×4 ou 9×9 pour illustrer (0 = vide) */
  demo?: number[][];
};

export type LessonContent = {
  slug: string;
  title: string;
  summary: string;
  steps: LessonStep[];
};

export const LESSONS: Record<string, LessonContent> = {
  "naked-single": {
    slug: "naked-single",
    title: "Case évidente",
    summary: "Quand une case n'accepte qu'un seul chiffre.",
    steps: [
      {
        title: "Le but du Sudoku",
        text: "Remplis la grille avec les chiffres 1 à 9. Chaque ligne, chaque colonne et chaque bloc de 3×3 doit contenir tous les chiffres, sans répéter.",
      },
      {
        title: "Regarde une case vide",
        text: "Choisis une case vide. Note les chiffres déjà présents dans sa ligne, sa colonne et son bloc.",
        demo: [
          [5, 3, 0, 6],
          [6, 0, 1, 0],
          [0, 9, 8, 0],
          [8, 0, 0, 3],
        ],
      },
      {
        title: "Un seul chiffre possible",
        text: "Si un seul chiffre peut aller dans cette case, c'est la bonne réponse. Tu viens de trouver une case évidente !",
        demo: [
          [5, 3, 4, 6],
          [6, 7, 1, 0],
          [1, 9, 8, 0],
          [8, 0, 0, 3],
        ],
      },
      {
        title: "À toi de jouer",
        text: "Cherche les cases évidentes une par une. Commence par celles qui ont le moins de choix possibles.",
      },
    ],
  },
  "hidden-single": {
    slug: "hidden-single",
    title: "Chiffre caché",
    summary: "Quand un chiffre ne va que dans une case d'une ligne.",
    steps: [
      {
        title: "Cherche un chiffre",
        text: "Prends un chiffre, par exemple le 7. Regarde une ligne : où peut-il aller ?",
      },
      {
        title: "Élimine les cases",
        text: "Une case est interdite si le 7 est déjà dans la même colonne ou le même bloc.",
        demo: [
          [0, 0, 7, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 7, 0, 0],
        ],
      },
      {
        title: "Une seule place reste",
        text: "Si le 7 ne peut aller que dans une case de la ligne, tu l'as trouvé même si la case avait plusieurs candidats.",
      },
      {
        title: "Astuce",
        text: "Fais ça chiffre par chiffre (1, puis 2, puis 3…) sur chaque ligne. Tu trouveras des cases que tu ne voyais pas au premier coup d'œil.",
      },
    ],
  },
  "naked-pair": {
    slug: "naked-pair",
    title: "Paire nue",
    summary: "Deux cases qui partagent les mêmes deux chiffres possibles.",
    steps: [
      {
        title: "Deux cases, deux chiffres",
        text: "Parfois deux cases voisines ne peuvent contenir que les mêmes deux chiffres, par exemple 3 et 7.",
      },
      {
        title: "Ce que ça change",
        text: "Le 3 et le 7 sont pris par ces deux cases. Tu peux les enlever des autres cases de la même ligne, colonne ou bloc.",
        demo: [
          [0, 3, 7, 0],
          [0, 7, 3, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        title: "Pourquoi c'est utile",
        text: "En enlevant des candidats ailleurs, une autre case peut devenir évidente.",
      },
      {
        title: "À toi de jouer",
        text: "Cherche deux cases avec exactement les mêmes petits chiffres possibles. C'est une paire nue.",
      },
    ],
  },
  "pointing-pair": {
    slug: "pointing-pair",
    title: "Bloc et ligne",
    summary: "Un chiffre d'un bloc qui aide ailleurs.",
    steps: [
      {
        title: "Regarde un bloc",
        text: "Dans un bloc 3×3, un chiffre comme le 4 ne peut être que sur une ligne du bloc.",
      },
      {
        title: "Suis la ligne",
        text: "Si le 4 du bloc est forcément sur la deuxième ligne, alors le 4 ne peut pas être ailleurs sur cette même ligne, en dehors du bloc.",
      },
      {
        title: "En pratique",
        text: "Tu élimines des possibilités dans le reste de la ligne. Ça peut révéler une case évidente.",
      },
      {
        title: "À toi de jouer",
        text: "Quand tu es bloqué, regarde chaque bloc : est-ce qu'un chiffre est coincé sur une seule ligne ou colonne ?",
      },
    ],
  },
  "x-wing": {
    slug: "x-wing",
    title: "Aile en X",
    summary: "Un chiffre aligné sur deux lignes.",
    steps: [
      {
        title: "Deux lignes, même colonne",
        text: "Imagine le chiffre 5 : il n'apparaît que dans deux cases sur la ligne 2, et dans deux cases sur la ligne 7, aux mêmes colonnes.",
      },
      {
        title: "Forme en X",
        text: "Les quatre cases forment un rectangle. Le 5 doit être sur deux coins opposés.",
      },
      {
        title: "Ce que tu gagnes",
        text: "Tu peux enlever le 5 des autres cases de ces deux colonnes. Une case se simplifie souvent après.",
      },
      {
        title: "Niveau avancé",
        text: "C'est une technique pour les grilles difficiles. Maîtrise d'abord les cases évidentes et les chiffres cachés.",
      },
    ],
  },
};

export function getLesson(slug: string): LessonContent | null {
  return LESSONS[slug] ?? null;
}

export const LESSON_SLUGS = Object.keys(LESSONS);
