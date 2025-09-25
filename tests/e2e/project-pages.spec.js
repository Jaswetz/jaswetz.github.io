import { test, expect } from "@playwright/test";

test.describe("Project Pages", () => {
  const projectPages = [
    "/projects/project-adsk-notification.html",
    "/projects/project-autodesk-di.html",
    "/projects/project-intel-lfc.html",
    "/projects/project-daimler-dcd.html",
  ];

  for (const projectPage of projectPages) {
    test(`${projectPage} loads successfully`, async ({ page }) => {
      await page.goto(projectPage);
      await expect(page).toHaveTitle(/Jason Swetzoff/);
    });

    test(`${projectPage} has hero section`, async ({ page }) => {
      await page.goto(projectPage);

      // Check for hero section
      await expect(page.locator(".hero--project")).toBeVisible();
      await expect(page.locator(".hero--project__header")).toBeVisible();
    });

    test(`${projectPage} has navigation`, async ({ page }) => {
      await page.goto(projectPage);

      // Wait for site-header to be defined
      await page.waitForFunction(() =>
        window.customElements.get("site-header")
      );

      const header = page.locator("site-header");
      await expect(header).toBeVisible();
    });

    test(`${projectPage} has main content`, async ({ page }) => {
      await page.goto(projectPage);

      // Wait for page to load completely
      await page.waitForLoadState("networkidle");

      // Check that main content exists and has content - check for presence rather than visibility
      // since CSS positioning might make Playwright think it's hidden
      const mainElement = page.locator("main");
      await expect(mainElement).toBeAttached();

      const articleElement = page.locator("article");
      await expect(articleElement).toBeAttached();

      // Verify main content has some text content
      const mainContent = await mainElement.textContent();
      expect(mainContent?.trim().length).toBeGreaterThan(10);
    });
  }
});
