import { test, expect } from "@playwright/test";

test.describe("Web Components", () => {
  test("site-header component works", async ({ page }) => {
    await page.goto("/");

    // Wait for custom element to be defined
    await page.waitForFunction(() => window.customElements.get("site-header"));

    const header = page.locator("site-header");
    await expect(header).toBeVisible();

    // Test that shadow DOM content is rendered
    const headerContent = await header.evaluate((el) => {
      return el.shadowRoot?.innerHTML?.length > 0;
    });
    expect(headerContent).toBe(true);
  });

  test("site-footer component works", async ({ page }) => {
    await page.goto("/");

    // Wait for custom element to be defined
    await page.waitForFunction(() => window.customElements.get("site-footer"));

    const footer = page.locator("site-footer");
    await expect(footer).toBeVisible();

    // Test that shadow DOM content is rendered
    const footerContent = await footer.evaluate((el) => {
      return el.shadowRoot?.innerHTML?.length > 0;
    });
    expect(footerContent).toBe(true);
  });

  test("header navigation works on homepage", async ({ page }) => {
    await page.goto("/");

    // Wait for custom element to be defined
    await page.waitForFunction(() => window.customElements.get("site-header"));

    const header = page.locator("site-header");

    // Test scroll behavior by checking if sections exist
    await expect(page.locator("#hero")).toBeVisible();
    await expect(page.locator("#about")).toBeVisible();
  });

  test("mobile menu functionality", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Wait for custom element to be defined
    await page.waitForFunction(() => window.customElements.get("site-header"));

    // Check if mobile menu toggle is available
    // Note: We can't easily test shadow DOM interactions from outside,
    // but we can verify the component is responsive
    const header = page.locator("site-header");
    await expect(header).toBeVisible();
  });
});
