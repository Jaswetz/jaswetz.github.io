/**
 * Selector Validation Utilities
 * Provides automated validation for test selectors to prevent test failures
 * due to missing or changed HTML elements.
 */

/**
 * Validates that critical selectors exist on a page
 * @param {Page} page - Playwright page object
 * @param {Array} selectors - Array of selector objects with name and selector
 * @returns {Object} Validation results with missing selectors
 */
export async function validateCriticalSelectors(page, selectors) {
  const results = {
    valid: [],
    missing: [],
    warnings: [],
  };

  for (const selector of selectors) {
    try {
      const element = page.locator(selector.selector);
      const count = await element.count();

      if (count === 0) {
        results.missing.push({
          name: selector.name,
          selector: selector.selector,
          reason: "Selector not found on page",
        });
      } else {
        results.valid.push({
          name: selector.name,
          selector: selector.selector,
          count: count,
        });
      }
    } catch (error) {
      results.warnings.push({
        name: selector.name,
        selector: selector.selector,
        error: error.message,
      });
    }
  }

  return results;
}

/**
 * Critical selectors for project pages
 */
export const PROJECT_CRITICAL_SELECTORS = [
  { name: "Hero Section", selector: ".hero--project" },
  { name: "Hero Header", selector: ".hero--project__header" },
  { name: "Project Label", selector: ".hero--project__label" },
  { name: "Project Role", selector: ".hero--project__role" },
  { name: "Project Timeline", selector: ".hero--project__timeline" },
  { name: "Main Content", selector: "main" },
  { name: "Article", selector: "article" },
  { name: "Site Header", selector: "site-header" },
  { name: "Project Summary", selector: "#project-summary" },
  { name: "Project Summary Cards", selector: ".project-summary__card" },
  { name: "Image Lightbox", selector: "image-lightbox" },
];

/**
 * Critical selectors for motion preference tests
 */
export const MOTION_PREFERENCE_SELECTORS = [
  { name: "Project Images", selector: ".project__img" },
  { name: "Project Summary Images", selector: ".project-summary__image" },
];

/**
 * Validates project page structure before running tests
 * @param {Page} page - Playwright page object
 * @returns {Object} Validation results
 */
export async function validateProjectPageStructure(page) {
  return await validateCriticalSelectors(page, PROJECT_CRITICAL_SELECTORS);
}

/**
 * Validates motion preference selectors exist
 * @param {Page} page - Playwright page object
 * @returns {Object} Validation results
 */
export async function validateMotionPreferenceSelectors(page) {
  return await validateCriticalSelectors(page, MOTION_PREFERENCE_SELECTORS);
}

/**
 * Logs validation results to console with appropriate formatting
 * @param {Object} results - Validation results from validateCriticalSelectors
 * @param {string} testName - Name of the test for logging context
 */
export function logValidationResults(results, testName = "Test") {
  console.log(`\n=== Selector Validation Results for ${testName} ===`);

  if (results.valid.length > 0) {
    console.log(`✅ Valid selectors (${results.valid.length}):`);
    results.valid.forEach((item) => {
      console.log(`  ✓ ${item.name}: ${item.selector} (${item.count} found)`);
    });
  }

  if (results.missing.length > 0) {
    console.log(`❌ Missing selectors (${results.missing.length}):`);
    results.missing.forEach((item) => {
      console.log(`  ✗ ${item.name}: ${item.selector} - ${item.reason}`);
    });
  }

  if (results.warnings.length > 0) {
    console.log(`⚠️  Warnings (${results.warnings.length}):`);
    results.warnings.forEach((item) => {
      console.log(`  ! ${item.name}: ${item.selector} - ${item.error}`);
    });
  }

  console.log("=".repeat(50));
}

/**
 * Throws an error if critical selectors are missing
 * @param {Object} results - Validation results
 * @param {boolean} failOnMissing - Whether to fail the test if selectors are missing
 */
export function assertCriticalSelectors(results, failOnMissing = true) {
  if (failOnMissing && results.missing.length > 0) {
    const missingSelectors = results.missing
      .map((item) => item.name)
      .join(", ");
    throw new Error(
      `Critical selectors missing: ${missingSelectors}. This may indicate HTML structure changes.`
    );
  }
}
