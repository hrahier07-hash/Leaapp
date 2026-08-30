import { describe, expect, it } from "vitest";

import {
  computeHeartsAfterLoss,
  computeXpForCompletion,
  updateStreak,
} from "../xp";

describe("computeXpForCompletion", () => {
  it("awards more xp for harder puzzles", () => {
    const easy = computeXpForCompletion({
      difficulty: "facile",
      timeSeconds: 300,
      mistakesCount: 0,
      hintsUsed: 0,
    });
    const hard = computeXpForCompletion({
      difficulty: "expert",
      timeSeconds: 300,
      mistakesCount: 0,
      hintsUsed: 0,
    });
    expect(hard).toBeGreaterThan(easy);
  });

  it("penalizes mistakes and hints", () => {
    const clean = computeXpForCompletion({
      difficulty: "moyen",
      timeSeconds: 200,
      mistakesCount: 0,
      hintsUsed: 0,
    });
    const messy = computeXpForCompletion({
      difficulty: "moyen",
      timeSeconds: 200,
      mistakesCount: 3,
      hintsUsed: 2,
    });
    expect(messy).toBeLessThan(clean);
  });
});

describe("updateStreak", () => {
  it("starts streak on first activity", () => {
    const result = updateStreak(0, 0, null, "Europe/Paris");
    expect(result.currentStreak).toBe(1);
  });
});

describe("computeHeartsAfterLoss", () => {
  it("caps hearts at five", () => {
    expect(computeHeartsAfterLoss(5).hearts).toBe(5);
  });
});
