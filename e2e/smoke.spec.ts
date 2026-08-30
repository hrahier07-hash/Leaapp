import { expect, test } from "@playwright/test";

test("landing to play flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Apprends en jouant")).toBeVisible();
  await page.getByRole("link", { name: "Jouer" }).click();
  await expect(page).toHaveURL(/\/app/);
});

test("onboarding starts", async ({ page }) => {
  await page.goto("/onboarding");
  await expect(page.getByText("Bienvenue")).toBeVisible();
});
