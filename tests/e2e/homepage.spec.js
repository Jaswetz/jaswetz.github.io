import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Jason Swetzoff/);
  });

  test("has main sections", async ({ page }) => {
    await page.goto("/");

    // Check for main sections
    await expect(page.locator("section#hero")).toBeVisible();
    await expect(page.locator("section#quotes")).toBeVisible();
    await expect(page.locator("section#featured-projects")).toBeVisible();
    await expect(page.locator("section#about")).toBeVisible();
  });

  test("has working navigation", async ({ page }) => {
    await page.goto("/");

    // Wait for site-header to be defined
    await page.waitForFunction(() => window.customElements.get("site-header"));

    // Check navigation links
    const header = page.locator("site-header");
    await expect(header).toBeVisible();
  });

  test("project cards link to case studies", async ({ page }) => {
    await page.goto("/");

    // Check project cards
    const projectCards = page.locator(".project-snippet");
    expect(await projectCards.count()).toBeGreaterThan(0);

    // Check first project card links
    const firstCard = projectCards.first();
    await expect(firstCard.locator("h3")).toBeVisible();
    await expect(firstCard.locator("p")).toBeVisible();
  });

  test("footer is present", async ({ page }) => {
    await page.goto("/");

    await page.waitForFunction(() => window.customElements.get("site-footer"));
    const footer = page.locator("site-footer");
    await expect(footer).toBeVisible();
  });
});
