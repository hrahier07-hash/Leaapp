import { PrismaClient } from "@prisma/client";

import {
  FACILE_GRID,
  FACILE_SOLUTION,
  MOYEN_GRID,
  MOYEN_SOLUTION,
  DIFFICILE_GRID,
  DIFFICILE_SOLUTION,
} from "../lib/sudoku/fixtures";

const prisma = new PrismaClient();

const TECHNIQUES = [
  {
    slug: "naked-single",
    name: "Case évidente",
    description: "Une case n'accepte qu'un seul chiffre.",
    unitOrder: 1,
  },
  {
    slug: "hidden-single",
    name: "Chiffre caché",
    description: "Un chiffre ne va que dans une case de la ligne.",
    unitOrder: 2,
  },
  {
    slug: "naked-pair",
    name: "Paire nue",
    description: "Deux cases avec les mêmes deux chiffres possibles.",
    unitOrder: 3,
  },
  {
    slug: "pointing-pair",
    name: "Bloc et ligne",
    description: "Un chiffre d'un bloc élimine des cases ailleurs.",
    unitOrder: 4,
  },
  {
    slug: "x-wing",
    name: "Aile en X",
    description: "Un chiffre aligné sur deux lignes.",
    unitOrder: 5,
  },
];

async function main() {
  await prisma.user.upsert({
    where: { email: "joueur@sudoku-quest.app" },
    update: {},
    create: {
      email: "joueur@sudoku-quest.app",
      name: "Joueur Sudoku",
      hearts: 5,
      hints: 5,
      gems: 0,
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      onboardingDone: true,
    },
  });

  for (const t of TECHNIQUES) {
    await prisma.technique.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
  }

  const puzzles = [
    {
      difficulty: "facile",
      gridInitial: FACILE_GRID,
      gridSolution: FACILE_SOLUTION,
      techniquesRequired: ["naked-single", "hidden-single"],
    },
    {
      difficulty: "moyen",
      gridInitial: MOYEN_GRID,
      gridSolution: MOYEN_SOLUTION,
      techniquesRequired: ["naked-single", "hidden-single", "naked-pair"],
    },
    {
      difficulty: "difficile",
      gridInitial: DIFFICILE_GRID,
      gridSolution: DIFFICILE_SOLUTION,
      techniquesRequired: ["naked-single", "hidden-single", "pointing-pair"],
    },
  ];

  for (const p of puzzles) {
    if (!p.gridSolution) continue;
    const existing = await prisma.puzzleTemplate.findFirst({
      where: { difficulty: p.difficulty, isDailyChallenge: false },
    });
    if (existing) {
      await prisma.puzzleTemplate.update({
        where: { id: existing.id },
        data: {
          gridInitial: p.gridInitial,
          gridSolution: p.gridSolution,
          techniquesRequired: p.techniquesRequired,
        },
      });
    } else {
      await prisma.puzzleTemplate.create({
        data: {
          difficulty: p.difficulty,
          gridInitial: p.gridInitial,
          gridSolution: p.gridSolution,
          techniquesRequired: p.techniquesRequired,
        },
      });
    }
  }

  console.log("Seed terminé.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
