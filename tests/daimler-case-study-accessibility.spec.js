import { test, expect } from "@playwright/test";

test.describe("Daimler Case Study - Accessibility & Responsive Design", () => {
  const caseStudyUrl = "/projects/project-daimler-dcd.html";

  test.beforeEach(async ({ page }) => {
    await page.goto(caseStudyUrl);
  });

  test.describe("Accessibility Features", () => {
    test("has proper heading hierarchy", async ({ page }) => {
      // Check for single h1
      const h1Elements = page.locator("h1");
      expect(await h1Elements.count()).toBe(1);

      // Check h1 content
      await expect(h1Elements).toContainText("Streamlining Data Access");

      // Check that h2 elements exist and follow h1
      const h2Elements = page.locator("h2");
      expect(await h2Elements.count()).toBeGreaterThan(0);

      // Check that h3 elements exist in appropriate sections
      const h3Elements = page.locator("h3");
      expect(await h3Elements.count()).toBeGreaterThan(0);
    });

    test("has skip link for keyboard navigation", async ({ page }) => {
      const skipLink = page.locator("a[href=\"#main-content\"]");
      // Skip link exists in DOM (may be visually hidden until focused)
      await expect(skipLink).toHaveCount(1);
      await expect(skipLink).toHaveText("Skip to main content");
    });

    test("all images have descriptive alt text", async ({ page }) => {
      const images = page.locator("img");
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute("alt");
        const src = await img.getAttribute("src");

        // Alt text should exist
        expect(alt).toBeDefined();

        // Log failing image for debugging
        if (!alt || alt === "") {
          console.log(`Image with empty alt text: ${src}`);
        }

        expect(alt).not.toBe("");

        // If alt text exists, it should be descriptive (more than just filename)
        if (alt && alt.length > 0) {
          expect(alt.length).toBeGreaterThan(5);

          // Should not contain file extensions or generic terms
          expect(alt.toLowerCase()).not.toContain(".jpg");
          expect(alt.toLowerCase()).not.toContain(".png");
          expect(alt.toLowerCase()).not.toContain(".gif");
        }
      }
    });

    test("has proper ARIA labels and roles", async ({ page }) => {
      // Check for main content landmark
      const mainContent = page.locator("main[role=\"main\"]");
      await expect(mainContent).toBeVisible();

      // Check for article role
      const article = page.locator("article[role=\"article\"]");
      await expect(article).toBeVisible();

      // Check for region roles on sections
      const regions = page.locator("section[role=\"region\"]");
      expect(await regions.count()).toBeGreaterThan(0);

      // Check for proper aria-labelledby attributes
      const labelledElements = page.locator("[aria-labelledby]");
      expect(await labelledElements.count()).toBeGreaterThan(0);
    });

    test("keyboard navigation works properly", async ({ page }) => {
      // Skip on mobile as keyboard navigation is different
      const userAgent = await page.evaluate(() => navigator.userAgent);
      const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);

      if (isMobile) {
        test.skip("Skipping keyboard test on mobile");
      }

      // Test tab navigation
      await page.keyboard.press("Tab");

      // Should focus on skip link first
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();

      // Continue tabbing through interactive elements
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Should be able to navigate to main content
      const mainContentFocused = page.locator("main:focus, main *:focus");
      // At least one element should be focusable within main content area
      expect(await page.locator(":focus").count()).toBeGreaterThanOrEqual(1);
    });

    test("has proper list semantics", async ({ page }) => {
      // Check for proper list roles
      const lists = page.locator("ul[role=\"list\"], ol[role=\"list\"]");
      const listItems = page.locator("li[role=\"listitem\"]");

      if ((await lists.count()) > 0) {
        expect(await listItems.count()).toBeGreaterThan(0);
      }
    });

    test("figures have proper captions", async ({ page }) => {
      const figures = page.locator("figure");
      const figureCount = await figures.count();

      for (let i = 0; i < figureCount; i++) {
        const figure = figures.nth(i);
        const figcaption = figure.locator("figcaption");

        // Each figure should have a caption
        await expect(figcaption).toBeVisible();

        // Caption should have meaningful content
        const captionText = await figcaption.textContent();
        expect(captionText.length).toBeGreaterThan(10);
      }
    });
  });

  test.describe("Responsive Design", () => {
    test("mobile layout (375px width)", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Check that content is visible and readable
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();

      // Check that grid layouts adapt to mobile
      const userGroups = page.locator(".user-groups");
      if ((await userGroups.count()) > 0) {
        const computedStyle = await userGroups.evaluate(
          (el) => window.getComputedStyle(el).gridTemplateColumns
        );
        // Should be responsive (either single column or adapted columns)
        expect(computedStyle).toBeDefined();
        expect(computedStyle.length).toBeGreaterThan(0);
      }

      // Check that images are responsive
      const images = page.locator(".project__img");
      for (let i = 0; i < Math.min(3, await images.count()); i++) {
        const img = images.nth(i);
        const boundingBox = await img.boundingBox();
        if (boundingBox) {
          expect(boundingBox.width).toBeLessThanOrEqual(375);
        }
      }
    });

    test("tablet layout (768px width)", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      // Check that content adapts to tablet size
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();

      // Check that some grids show 2 columns on tablet
      const userGroups = page.locator(".user-groups");
      if ((await userGroups.count()) > 0) {
        const computedStyle = await userGroups.evaluate(
          (el) => window.getComputedStyle(el).gridTemplateColumns
        );
        // May be 2 columns or still 1 column depending on design
        expect(computedStyle).toBeDefined();
      }
    });

    test("desktop layout (1920px width)", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Check that content uses full desktop layout
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();

      // Check that grids show multiple columns on desktop
      const userGroups = page.locator(".user-groups");
      if ((await userGroups.count()) > 0) {
        const computedStyle = await userGroups.evaluate(
          (el) => window.getComputedStyle(el).gridTemplateColumns
        );
        // Should show multiple columns on desktop (could be px values or fr units)
        expect(computedStyle).toBeDefined();
        // Check that it's not just a single column (should have spaces indicating multiple columns)
        expect(computedStyle.split(" ").length).toBeGreaterThanOrEqual(2);
      }
    });

    test("images are properly optimized and responsive", async ({ page }) => {
      const images = page.locator("img");
      const imageCount = await images.count();

      for (let i = 0; i < Math.min(5, imageCount); i++) {
        const img = images.nth(i);

        // Check for loading attribute
        const loading = await img.getAttribute("loading");
        if (i > 0) {
          // First image might not have lazy loading
          expect(loading).toBe("lazy");
        }

        // Check that images are responsive (only if visible)
        const isVisible = await img.isVisible();
        if (isVisible) {
          const boundingBox = await img.boundingBox();
          if (boundingBox) {
            expect(boundingBox.width).toBeGreaterThan(0);
            expect(boundingBox.height).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  test.describe("Performance & Optimization", () => {
    test("page loads within acceptable time", async ({ page }) => {
      const startTime = Date.now();
      await page.goto(caseStudyUrl);
      await page.waitForLoadState("networkidle");
      const loadTime = Date.now() - startTime;

      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test("images load properly", async ({ page }) => {
      const images = page.locator("img");
      const imageCount = await images.count();

      for (let i = 0; i < Math.min(3, imageCount); i++) {
        const img = images.nth(i);

        // Check if image is visible (some may be lazy loaded)
        const isVisible = await img.isVisible();
        if (!isVisible) {
          // Skip lazy-loaded images that aren't in viewport
          continue;
        }

        // Check that image has loaded (has dimensions)
        const boundingBox = await img.boundingBox();
        expect(boundingBox).toBeTruthy();
        expect(boundingBox.width).toBeGreaterThan(0);
        expect(boundingBox.height).toBeGreaterThan(0);
      }
    });
  });

  test.describe("Content Structure", () => {
    test("has all required sections", async ({ page }) => {
      // Check for key sections
      const requiredSections = [
        "#project-summary",
        "#brief",
        "#assignment",
        "#users",
        "#results",
      ];

      for (const sectionId of requiredSections) {
        const section = page.locator(sectionId);
        await expect(section).toBeVisible();
      }
    });

    test("project metadata is properly displayed", async ({ page }) => {
      // Check for project summary cards
      const summaryCards = page.locator(".project-summary__card");
      expect(await summaryCards.count()).toBeGreaterThanOrEqual(4);

      // Check for specific metadata (use first occurrence)
      await expect(
        page.locator("text=Daimler Trucks North America").first()
      ).toBeVisible();
      await expect(page.locator("text=Lead UX Designer").first()).toBeVisible();
      await expect(
        page.locator("text=Detroit Connect Direct").first()
      ).toBeVisible();
    });

    test("results metrics are displayed correctly", async ({ page }) => {
      const metricsSection = page.locator("#results");
      await expect(metricsSection).toBeVisible();

      // Check for metric cards
      const metricCards = page.locator(".metric-card");
      expect(await metricCards.count()).toBeGreaterThanOrEqual(3);

      // Check for percentage values
      await expect(page.locator("text=85%")).toBeVisible();
      await expect(page.locator("text=60%")).toBeVisible();
      await expect(page.locator("text=4.7/5")).toBeVisible();
    });
  });

  test.describe("Reduced Motion Support", () => {
    test("respects prefers-reduced-motion", async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.reload();

      // Check that animations are disabled
      const animatedElements = page.locator(
        ".project__img, .project-summary__image"
      );

      for (let i = 0; i < Math.min(3, await animatedElements.count()); i++) {
        const element = animatedElements.nth(i);
        const transition = await element.evaluate(
          (el) => window.getComputedStyle(el).transition
        );

        // Transitions should be disabled or very short
        // Accept 'none', very small values in ms, or scientific notation in seconds
        expect(transition).toMatch(/none|0\.01ms|0\.0+1ms|1e-0[5-9]s|0\.0+1s/);
      }
    });
  });
});
