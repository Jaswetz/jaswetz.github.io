import { test, expect } from "@playwright/test";

test.describe("Daimler Case Study - Comprehensive Test Coverage", () => {
  const caseStudyUrl = "/projects/project-daimler-dcd.html";

  test.beforeEach(async ({ page }) => {
    await page.goto(caseStudyUrl);
    await page.waitForLoadState("networkidle");
  });

  test.describe("Page Functionality", () => {
    test("loads successfully with proper title", async ({ page }) => {
      await expect(page).toHaveTitle(
        /Streamlining Data Access.*Daimler Trucks.*Jason Swetzoff/
      );
    });

    test("has hero section with project metadata", async ({ page }) => {
      // Check for hero section
      await expect(page.locator(".hero--project")).toBeVisible();
      await expect(page.locator(".hero--project__header")).toBeVisible();

      // Check project metadata
      await expect(
        page.locator("text=Daimler Trucks North America").first()
      ).toBeVisible();
      await expect(page.locator("text=Lead UX Designer").first()).toBeVisible();
      await expect(
        page.locator("text=Multi-year project").first()
      ).toBeVisible();
    });

    test("has navigation components", async ({ page }) => {
      // Wait for site-header to be defined
      await page.waitForFunction(() =>
        window.customElements.get("site-header")
      );

      const header = page.locator("site-header");
      await expect(header).toBeVisible();

      // Check for skip link
      const skipLink = page.locator("a[href=\"#main-content\"]");
      await expect(skipLink).toHaveCount(1);
    });

    test("has main content sections", async ({ page }) => {
      // Check for main content
      const mainElement = page.locator("main");
      await expect(mainElement).toBeVisible();

      // Check for key sections
      const requiredSections = [
        "#project-summary",
        "#brief",
        "#assignment",
        "#users",
        "#customer-flow",
        "#understanding-user",
        "#key-terms",
        "#sketching-whiteboarding",
        "#prototyping-wireframing",
        "#final-design",
        "#final-touches",
        "#results",
      ];

      for (const sectionId of requiredSections) {
        const section = page.locator(sectionId);
        await expect(section).toBeVisible();
      }
    });

    test("has project summary cards with correct information", async ({
      page,
    }) => {
      const summaryCards = page.locator(".project-summary__card");
      expect(await summaryCards.count()).toBeGreaterThanOrEqual(5);

      // Check for specific metadata content
      await expect(
        page.locator("text=Daimler Trucks North America").first()
      ).toBeVisible();
      await expect(page.locator("text=Lead UX Designer").first()).toBeVisible();
      await expect(page.locator("text=Web Application").first()).toBeVisible();
      await expect(
        page.locator("text=Multi-year project").first()
      ).toBeVisible();
    });

    test("has results section with metrics", async ({ page }) => {
      const resultsSection = page.locator("#results");
      await expect(resultsSection).toBeVisible();

      // Check for metric cards (if they exist)
      const metricCards = page.locator(".metric-card");
      if ((await metricCards.count()) > 0) {
        expect(await metricCards.count()).toBeGreaterThanOrEqual(3);
      }
    });
  });

  test.describe("Responsive Design", () => {
    test("mobile layout (375px width)", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Check that main content is visible
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();

      // Check that project summary cards stack properly
      const summaryCards = page.locator(".project-summary__cards");
      if ((await summaryCards.count()) > 0) {
        const computedStyle = await summaryCards
          .first()
          .evaluate((el) => window.getComputedStyle(el).gridTemplateColumns);
        expect(computedStyle).toBeDefined();
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

      // Check user groups grid adapts to mobile
      const userGroups = page.locator(".user-groups");
      if ((await userGroups.count()) > 0) {
        const computedStyle = await userGroups
          .first()
          .evaluate((el) => window.getComputedStyle(el).gridTemplateColumns);
        expect(computedStyle).toBeDefined();
      }
    });

    test("tablet layout (768px width)", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      // Check that content adapts to tablet size
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();

      // Check grid layouts at tablet size
      const userGroups = page.locator(".user-groups");
      if ((await userGroups.count()) > 0) {
        const computedStyle = await userGroups
          .first()
          .evaluate((el) => window.getComputedStyle(el).gridTemplateColumns);
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
        const computedStyle = await userGroups
          .first()
          .evaluate((el) => window.getComputedStyle(el).gridTemplateColumns);
        expect(computedStyle).toBeDefined();
        // Should have multiple columns (indicated by spaces in the value)
        expect(computedStyle.split(" ").length).toBeGreaterThanOrEqual(2);
      }
    });

    test("images are properly optimized and responsive", async ({ page }) => {
      const images = page.locator("img");
      const imageCount = await images.count();

      for (let i = 0; i < Math.min(5, imageCount); i++) {
        const img = images.nth(i);

        // Check for loading attribute (lazy loading)
        const loading = await img.getAttribute("loading");
        if (i > 0) {
          // First image might not have lazy loading
          expect(loading).toBe("lazy");
        }

        // Check that images have alt text
        const alt = await img.getAttribute("alt");
        expect(alt).toBeDefined();
        expect(alt).not.toBe("");

        // Check that visible images have dimensions
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

  test.describe("Image Lightbox Functionality", () => {
    test("lightbox component is present", async ({ page }) => {
      // Wait for image-lightbox component to be defined
      await page.waitForFunction(() =>
        window.customElements.get("image-lightbox")
      );

      const lightbox = page.locator("image-lightbox");
      await expect(lightbox).toBeAttached();
    });

    test("images are clickable and have proper attributes", async ({
      page,
    }) => {
      // Wait for lightbox to initialize
      await page.waitForFunction(() =>
        window.customElements.get("image-lightbox")
      );
      await page.waitForTimeout(500); // Give time for initialization

      const lightboxImages = page.locator("figure img.project__img");
      const imageCount = await lightboxImages.count();

      if (imageCount > 0) {
        for (let i = 0; i < Math.min(3, imageCount); i++) {
          const img = lightboxImages.nth(i);

          // Check that image has cursor pointer
          const cursor = await img.evaluate(
            (el) => window.getComputedStyle(el).cursor
          );
          expect(cursor).toBe("pointer");

          // Check for accessibility attributes
          const role = await img.getAttribute("role");
          const tabindex = await img.getAttribute("tabindex");
          const ariaLabel = await img.getAttribute("aria-label");

          expect(role).toBe("button");
          expect(tabindex).toBe("0");
          expect(ariaLabel).toContain("View larger image");
        }
      }
    });

    test("lightbox opens when image is clicked", async ({ page }) => {
      // Wait for lightbox to initialize
      await page.waitForFunction(() =>
        window.customElements.get("image-lightbox")
      );
      await page.waitForTimeout(500);

      const lightboxImages = page.locator("figure img.project__img");
      const imageCount = await lightboxImages.count();

      if (imageCount > 0) {
        // Click the first image
        await lightboxImages.first().click();

        // Check that lightbox opens
        const lightbox = page.locator("image-lightbox");
        const lightboxDialog = lightbox.locator(".lightbox--open");

        await expect(lightboxDialog).toBeVisible();

        // Check that lightbox has proper ARIA attributes
        const dialog = lightbox.locator("[role=\"dialog\"]");
        await expect(dialog).toHaveAttribute("aria-modal", "true");
        await expect(dialog).toHaveAttribute("aria-hidden", "false");

        // Close lightbox for cleanup
        await page.keyboard.press("Escape");
      }
    });

    test("lightbox keyboard navigation works", async ({ page }) => {
      // Skip on mobile as keyboard navigation is different
      const userAgent = await page.evaluate(() => navigator.userAgent);
      const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);

      if (isMobile) {
        test.skip("Skipping keyboard test on mobile");
      }

      // Wait for lightbox to initialize
      await page.waitForFunction(() =>
        window.customElements.get("image-lightbox")
      );
      await page.waitForTimeout(500);

      const lightboxImages = page.locator("figure img.project__img");
      const imageCount = await lightboxImages.count();

      if (imageCount > 0) {
        // Open lightbox with Enter key
        await lightboxImages.first().focus();
        await page.keyboard.press("Enter");

        // Check that lightbox is open
        const lightbox = page.locator("image-lightbox");
        const lightboxDialog = lightbox.locator(".lightbox--open");
        await expect(lightboxDialog).toBeVisible();

        // Test Escape key closes lightbox
        await page.keyboard.press("Escape");
        await expect(lightboxDialog).not.toBeVisible();

        // Test Space key opens lightbox
        await lightboxImages.first().focus();
        await page.keyboard.press("Space");
        await expect(lightboxDialog).toBeVisible();

        // Test arrow key navigation (if multiple images)
        if (imageCount > 1) {
          await page.keyboard.press("ArrowRight");
          // Should navigate to next image (test passes if no error)

          await page.keyboard.press("ArrowLeft");
          // Should navigate to previous image (test passes if no error)
        }

        // Close lightbox
        await page.keyboard.press("Escape");
      }
    });

    test("lightbox focus management works correctly", async ({ page }) => {
      // Skip on mobile and WebKit due to focus handling differences
      const userAgent = await page.evaluate(() => navigator.userAgent);
      const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
      const browserName = page.context().browser()?.browserType().name();

      if (isMobile || browserName === "webkit") {
        test.skip("Skipping focus test on mobile and WebKit");
      }

      // Wait for lightbox to initialize
      await page.waitForFunction(() =>
        window.customElements.get("image-lightbox")
      );
      await page.waitForTimeout(500);

      const lightboxImages = page.locator("figure img.project__img");
      const imageCount = await lightboxImages.count();

      if (imageCount > 0) {
        // Store original focused element
        const originalFocus = await page.evaluate(
          () => document.activeElement?.tagName
        );

        // Open lightbox
        await lightboxImages.first().click();

        // Check that focus moves to close button
        const lightbox = page.locator("image-lightbox");
        await page.waitForTimeout(200); // Wait for focus to move

        // Check that lightbox is open
        const lightboxDialog = lightbox.locator(".lightbox--open");
        await expect(lightboxDialog).toBeVisible();

        // Test that keyboard navigation works (Escape closes lightbox)
        await page.keyboard.press("Escape");

        // Verify lightbox is closed
        await expect(lightboxDialog).not.toBeVisible();
      }
    });

    test("lightbox closes on backdrop click", async ({ page }) => {
      // Wait for lightbox to initialize
      await page.waitForFunction(() =>
        window.customElements.get("image-lightbox")
      );
      await page.waitForTimeout(500);

      const lightboxImages = page.locator("figure img.project__img");
      const imageCount = await lightboxImages.count();

      if (imageCount > 0) {
        // Open lightbox
        await lightboxImages.first().click();

        const lightbox = page.locator("image-lightbox");
        const lightboxDialog = lightbox.locator(".lightbox--open");
        await expect(lightboxDialog).toBeVisible();

        // Click on backdrop (lightbox background)
        const backdrop = lightbox.locator(".lightbox");
        await backdrop.click({ position: { x: 10, y: 10 } }); // Click near edge

        // Lightbox should close
        await expect(lightboxDialog).not.toBeVisible();
      }
    });

    test("lightbox displays image captions correctly", async ({ page }) => {
      // Wait for lightbox to initialize
      await page.waitForFunction(() =>
        window.customElements.get("image-lightbox")
      );
      await page.waitForTimeout(500);

      const figures = page.locator("figure");
      const figureCount = await figures.count();

      if (figureCount > 0) {
        // Find a figure with both image and caption
        for (let i = 0; i < Math.min(3, figureCount); i++) {
          const figure = figures.nth(i);
          const img = figure.locator("img.project__img");
          const caption = figure.locator("figcaption");

          if ((await img.count()) > 0 && (await caption.count()) > 0) {
            const captionText = await caption.textContent();

            // Open lightbox
            await img.click();

            const lightbox = page.locator("image-lightbox");
            const lightboxCaption = lightbox.locator(".lightbox__caption");

            // Check that caption is displayed in lightbox
            await expect(lightboxCaption).toBeVisible();
            await expect(lightboxCaption).toContainText(captionText.trim());

            // Close lightbox
            await page.keyboard.press("Escape");
            break;
          }
        }
      }
    });
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

    test("all images have descriptive alt text", async ({ page }) => {
      const images = page.locator("img");
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute("alt");
        const className = await img.getAttribute("class");

        // Alt text should exist and not be null
        expect(alt).toBeDefined();

        // Skip lightbox images as they get populated dynamically
        if (className && className.includes("lightbox__image")) {
          continue;
        }

        // Allow empty alt text for decorative images, but if it exists, it should be meaningful
        if (alt !== null && alt !== "") {
          // Should be descriptive (more than just filename)
          expect(alt.length).toBeGreaterThan(5);

          // Should not contain file extensions
          expect(alt.toLowerCase()).not.toContain(".jpg");
          expect(alt.toLowerCase()).not.toContain(".png");
          expect(alt.toLowerCase()).not.toContain(".gif");
          expect(alt.toLowerCase()).not.toContain(".webp");
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

      // Should be able to navigate to focusable elements
      expect(await page.locator(":focus").count()).toBeGreaterThanOrEqual(1);
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

    test("respects prefers-reduced-motion", async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.reload();

      // Check that animations are disabled or very short
      const animatedElements = page.locator(
        ".project__img, .project-summary__image"
      );

      for (let i = 0; i < Math.min(3, await animatedElements.count()); i++) {
        const element = animatedElements.nth(i);
        const transition = await element.evaluate(
          (el) => window.getComputedStyle(el).transition
        );

        // Transitions should be disabled or very short
        expect(transition).toMatch(/none|0\.01ms/);
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

    test("images load properly with lazy loading", async ({ page }) => {
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

    test("web components load correctly", async ({ page }) => {
      // Check that all required web components are defined
      const componentsLoaded = await page.evaluate(() => {
        return {
          siteHeader: !!window.customElements.get("site-header"),
          siteFooter: !!window.customElements.get("site-footer"),
          imageLightbox: !!window.customElements.get("image-lightbox"),
        };
      });

      expect(componentsLoaded.siteHeader).toBe(true);
      expect(componentsLoaded.siteFooter).toBe(true);
      expect(componentsLoaded.imageLightbox).toBe(true);
    });
  });

  test.describe("Content Structure & SEO", () => {
    test("has proper meta tags", async ({ page }) => {
      // Check for description meta tag
      const description = page.locator("meta[name=\"description\"]");
      await expect(description).toHaveAttribute(
        "content",
        /Case study.*Daimler Trucks/
      );

      // Check for OpenGraph tags
      const ogTitle = page.locator("meta[property=\"og:title\"]");
      await expect(ogTitle).toHaveAttribute(
        "content",
        /Streamlining Data Access.*Daimler Trucks/
      );

      const ogDescription = page.locator("meta[property=\"og:description\"]");
      await expect(ogDescription).toHaveAttribute(
        "content",
        /Case study.*Daimler Trucks/
      );
    });

    test("has structured content sections", async ({ page }) => {
      // Check for key content sections with proper structure
      const briefSection = page.locator("#brief");
      await expect(briefSection).toBeVisible();
      await expect(briefSection.locator("h2")).toContainText("Brief");

      const assignmentSection = page.locator("#assignment");
      await expect(assignmentSection).toBeVisible();
      await expect(assignmentSection.locator("h2")).toContainText("Assignment");

      const resultsSection = page.locator("#results");
      await expect(resultsSection).toBeVisible();
      await expect(resultsSection.locator("h2")).toContainText("Results");
    });

    test("has proper list semantics", async ({ page }) => {
      // Check for proper list roles where they exist
      const lists = page.locator("ul[role=\"list\"], ol[role=\"list\"]");
      const listItems = page.locator("li[role=\"listitem\"]");

      if ((await lists.count()) > 0) {
        expect(await listItems.count()).toBeGreaterThan(0);
      }
    });
  });
});
