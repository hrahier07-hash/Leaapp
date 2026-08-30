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
    name: "Candidat unique",
    description: "Une case n'a qu'un seul chiffre possible.",
    unitOrder: 1,
  },
  {
    slug: "hidden-single",
    name: "Candidat caché",
    description: "Un chiffre ne peut aller que dans une case d'une zone.",
    unitOrder: 2,
  },
  {
    slug: "naked-pair",
    name: "Paire nue",
    description: "Deux cases partagent exactement deux candidats.",
    unitOrder: 3,
  },
  {
    slug: "pointing-pair",
    name: "Réduction bloc",
    description: "Un chiffre dans un bloc élimine des candidats ailleurs.",
    unitOrder: 4,
  },
  {
    slug: "x-wing",
    name: "X Wing",
    description: "Alignement de candidats sur deux lignes et colonnes.",
    unitOrder: 5,
  },
];

async function main() {
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
