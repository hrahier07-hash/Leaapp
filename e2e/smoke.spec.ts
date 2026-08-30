import { expect, test } from "@playwright/test";

test("landing to play flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Progresse en t'amusant")).toBeVisible();
  await page.getByRole("link", { name: "Jouer maintenant" }).click();
  await expect(page).toHaveURL(/\/app/);
});

test("onboarding starts", async ({ page }) => {
  await page.goto("/onboarding");
  await expect(page.getByText("Bienvenue")).toBeVisible();
});
