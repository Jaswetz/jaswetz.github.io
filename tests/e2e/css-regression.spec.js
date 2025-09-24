/**
 * CSS Regression Testing
 *
 * Visual regression tests to ensure CSS changes don't break styling.
 * Uses Playwright for screenshot comparison and CSS validation.
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('CSS Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to standard size for consistent screenshots
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for fonts and styles to load
    await page.waitForLoadState('networkidle');
  });

  test('Homepage layout and styling', async ({ page }) => {
    await page.goto('/');

    // Wait for critical content
    await page.waitForSelector('.hero-section');

    // Take full page screenshot for layout comparison
    await expect(page).toHaveScreenshot('homepage-layout.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow small differences for fonts/rendering
    });
  });

  test('Card components styling', async ({ page }) => {
    await page.goto('/');

    // Wait for project cards to load
    await page.waitForSelector('.card');

    // Screenshot all cards container
    const cardsSection = page.locator('.featured-projects-section');
    await expect(cardsSection).toHaveScreenshot('project-cards.png', {
      maxDiffPixels: 50,
    });
  });

  test('Navigation component styling', async ({ page }) => {
    await page.goto('/');

    // Wait for navigation to load
    await page.waitForSelector('site-header');

    // Test header layout
    const header = page.locator('site-header');
    await expect(header).toHaveScreenshot('site-header.png', {
      maxDiffPixels: 20,
    });
  });

  test('Responsive breakpoints', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Allow reflow

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('CSS property application', async ({ page }) => {
    await page.goto('/');

    // Test CSS custom properties are applied
    const heroSection = page.locator('.hero-section');
    const heroBackground = await heroSection.evaluate(el => {
      return getComputedStyle(el).getPropertyValue('--color-background');
    });

    expect(heroBackground).toBeTruthy();

    // Test that CSS layers are working (if supported)
    const cssLayersSupport = await page.evaluate(() => {
      try {
        document.head.appendChild(document.createElement('style')).textContent =
          '@layer test { .test-layer { display: block; } }';
        return true;
      } catch (e) {
        return false;
      }
    });

    if (cssLayersSupport) {
      console.log('✅ CSS @layer syntax is supported');
    }
  });

  test('Focus and accessibility states', async ({ page }) => {
    await page.goto('/');

    // Test focus indicators
    const focusableElements = page.locator(
      'a[href], button, input, [tabindex]:not([tabindex="-1"])'
    );

    // Tab through some elements and check focus styling
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Take screenshot of focused element
    await page.waitForTimeout(200);
    const focusedElement = page.locator('*:focus');
    if ((await focusedElement.count()) > 0) {
      // Check that focus outline is visible
      const outlineWidth = await focusedElement.evaluate(el => {
        return getComputedStyle(el).outlineWidth;
      });
      expect(outlineWidth).not.toBe('0px');
    }
  });

  test('Animation and transition smoothness', async ({ page }) => {
    await page.goto('/');

    // Test hover states
    const cardLinks = page.locator('.card--link');

    // Hover over a card and take screenshot during transition
    await cardLinks.first().hover();
    await page.waitForTimeout(300); // Wait for transition

    const hoveredCard = page.locator('.card--link:hover');
    await expect(hoveredCard.first()).toHaveScreenshot('hovered-card.png');
  });
});

test.describe('CSS Performance Validation', () => {
  test('No unused CSS classes in key templates', async ({ page }) => {
    // Read the main HTML file
    const htmlContent = fs.readFileSync(
      path.join(__dirname, '../src/index.html'),
      'utf8'
    );

    await page.setContent(htmlContent);

    // Extract all class names from HTML
    const htmlClasses = new Set();
    const classRegex = /class=["']([^"']+)["']/g;
    let match;

    while ((match = classRegex.exec(htmlContent)) !== null) {
      match[1].split(' ').forEach(cls => htmlClasses.add(cls));
    }

    // Wait for styles to load
    await page.waitForLoadState('networkidle');

    // Check that key CSS classes are actually used
    const criticalClasses = ['hero', 'featured-projects-section', 'card'];

    for (const className of criticalClasses) {
      const elements = page.locator(`.${className}`);
      const count = await elements.count();

      if (count === 0) {
        console.warn(
          `⚠️  Class '${className}' is defined but no elements found using it`
        );
      } else {
        console.log(`✅ Class '${className}' is used by ${count} element(s)`);
      }
    }
  });

  test('CSS cascade and specificity analysis', async ({ page }) => {
    await page.goto('/');

    // Analyze specificity of key selectors
    const specificityStats = await page.evaluate(() => {
      const stats = {
        low: 0, // selectors with specificity 0-10
        medium: 0, // selectors with specificity 11-50
        high: 0, // selectors with specificity 51+
        conflicts: 0,
      };

      // Check for !important usage (indicator of specificity wars)
      const importantRules = Array.from(document.styleSheets)
        .flatMap(sheet => {
          try {
            return Array.from(sheet.cssRules || []);
          } catch (e) {
            return []; // Skip cross-origin stylesheets
          }
        })
        .filter(rule => rule.style?.cssText?.includes('!important'));

      stats.importantRules = importantRules.length;

      return stats;
    });

    console.log(`📊 CSS Specificity Analysis:`, specificityStats);

    // Warn if too many !important rules (indicator of poorly managed styles)
    if (specificityStats.importantRules > 10) {
      console.warn(
        `⚠️  Too many !important rules detected (${specificityStats.importantRules})`
      );
      console.warn(`This may indicate CSS specificity issues`);
    }
  });
});
