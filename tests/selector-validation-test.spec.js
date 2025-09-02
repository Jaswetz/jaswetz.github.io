import { test, expect } from "@playwright/test";
import {
  validateProjectPageStructure,
  validateMotionPreferenceSelectors,
  logValidationResults,
  assertCriticalSelectors,
} from "./selector-validation.js";

test.describe("Selector Validation Tests", () => {
  test("validate Daimler case study selectors", async ({ page }) => {
    await page.goto("/projects/project-daimler-dcd.html");
    await page.waitForLoadState("networkidle");

    // Validate critical selectors exist
    const validationResults = await validateProjectPageStructure(page);
    logValidationResults(validationResults, "Daimler Case Study Validation");
    assertCriticalSelectors(validationResults, true);
  });

  test("validate motion preference selectors", async ({ page }) => {
    await page.goto("/projects/project-daimler-dcd.html");
    await page.waitForLoadState("networkidle");

    // Validate motion preference selectors exist
    const motionValidation = await validateMotionPreferenceSelectors(page);
    logValidationResults(motionValidation, "Motion Preference Validation");
    assertCriticalSelectors(motionValidation, true);
  });

  test("validate Intel LFC case study selectors", async ({ page }) => {
    await page.goto("/projects/project-intel-lfc.html");
    await page.waitForLoadState("networkidle");

    // Validate critical selectors exist
    const validationResults = await validateProjectPageStructure(page);
    logValidationResults(validationResults, "Intel LFC Validation");
    assertCriticalSelectors(validationResults, true);
  });

  test("validate Autodesk DI case study selectors", async ({ page }) => {
    await page.goto("/projects/project-autodesk-di.html");
    await page.waitForLoadState("networkidle");

    // Validate critical selectors exist
    const validationResults = await validateProjectPageStructure(page);
    logValidationResults(validationResults, "Autodesk DI Validation");
    assertCriticalSelectors(validationResults, true);
  });
});
