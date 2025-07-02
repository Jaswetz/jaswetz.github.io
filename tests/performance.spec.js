import { test, expect } from "@playwright/test";

test.describe("Performance Tests", () => {
  test("page loads within acceptable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });

  test("images are optimized", async ({ page }) => {
    await page.goto("/");

    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute("src");

      if (src) {
        // Check that images have proper extensions
        const hasOptimizedFormat = /\.(webp|avif|jpg|jpeg|png)$/i.test(src);
        expect(hasOptimizedFormat).toBe(true);
      }
    }
  });

  test("no console errors", async ({ page }) => {
    const consoleErrors = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Allow some time for any delayed errors
    await page.waitForTimeout(2000);

    expect(consoleErrors).toHaveLength(0);
  });

  test("no 404 errors", async ({ page }) => {
    const failedRequests = [];

    page.on("response", (response) => {
      if (response.status() === 404) {
        failedRequests.push(response.url());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(failedRequests).toHaveLength(0);
  });
});
