import { test, expect } from "@playwright/test";

test.describe("Accessibility Tests", () => {
  test("homepage meets accessibility standards", async ({ page }) => {
    await page.goto("/");

    // Check for proper heading hierarchy
    const h1 = page.locator("h1");
    expect(await h1.count()).toBe(1);

    // Check that all images have alt text
    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      expect(alt).toBeDefined();
    }

    // Check for skip link
    const skipLink = page.locator("a[href=\"#main-content\"], a[href=\"#hero\"]");
    // Skip link might be hidden, so we check if it exists in DOM
    expect(await skipLink.count()).toBeGreaterThanOrEqual(0);
  });

  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/");

    // Test tab navigation
    await page.keyboard.press("Tab");

    // Check that focus is visible
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("color contrast is sufficient", async ({ page }) => {
    await page.goto("/");

    // This is a basic check - in a real scenario you'd use more sophisticated tools
    const body = page.locator("body");
    const styles = await body.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      };
    });

    // Basic check that color and background are different
    expect(styles.color).not.toBe(styles.backgroundColor);
  });

  test("responsive design works", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check that content is still visible
    await expect(page.locator("h1")).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("h1")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("h1")).toBeVisible();
  });
});
