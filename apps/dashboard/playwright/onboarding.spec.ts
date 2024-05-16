import { expect, test } from "@playwright/test";

import { signUpAndLogin } from "./utils/helper";
import { teams, users } from "./utils/mock";

const { productName } = teams.onboarding[0];

test.describe("Onboarding Flow Test", async () => {
  test("link workflow", async ({ page }) => {
    const { name, email, password } = users.onboarding[0];
    await signUpAndLogin(page, name, email, password);
    await page.waitForURL("/onboarding");
    await expect(page).toHaveURL("/onboarding");

    await page.getByRole("button", { name: "Link Workflows Create a new" }).click();
    await page.getByRole("button", { name: "Collect Feedback Collect" }).click();
    await page.getByRole("button", { name: "Publish" }).click();

    await page.waitForURL(/\/environments\/[^/]+\/workflows/);
    await expect(page.getByText(productName)).toBeVisible();
  });

  test("website workflow", async ({ page }) => {
    const { name, email, password } = users.onboarding[1];
    await signUpAndLogin(page, name, email, password);
    await page.waitForURL("/onboarding");
    await expect(page).toHaveURL("/onboarding");
    await page.getByRole("button", { name: "Website Workflows Run a workflow" }).click();

    await page.getByRole("button", { name: "Skip" }).click();
    await page.getByRole("button", { name: "Skip" }).click();

    await page.getByRole("button", { name: "Skip" }).click();
    await page.locator("input").click();
    await page.locator("input").fill("test@gmail.com");
    await page.getByRole("button", { name: "Invite" }).click();
    await page.waitForURL(/\/environments\/[^/]+\/workflows/);
    await expect(page.getByText(productName)).toBeVisible();
  });
});
