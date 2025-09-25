#!/usr/bin/env node

/**
 * Test Selector Update Automation Script
 *
 * This script helps automate the process of updating test selectors
 * when HTML structure changes. It scans HTML files and generates
 * updated selector patterns for tests.
 *
 * Usage:
 *   node scripts/update-test-selectors.js [options]
 *
 * Options:
 *   --project <name>    Scan specific project page
 *   --all               Scan all project pages
 *   --output <file>     Output file for updated selectors
 *   --validate          Validate current selectors against HTML
 */

import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

// Configuration
const PROJECTS_DIR = path.join(process.cwd(), "src", "projects");
const TESTS_DIR = path.join(process.cwd(), "tests");

/**
 * Extract selectors from HTML content
 */
function extractSelectorsFromHTML(htmlContent, filename) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const selectors = {
    filename,
    hero: {
      section: ".hero--project",
      header: ".hero--project__header",
      label: ".hero--project__label",
      role: ".hero--project__role",
      timeline: ".hero--project__timeline",
    },
    content: {
      main: "main",
      article: "article",
      sections: [],
    },
    components: {
      siteHeader: "site-header",
      imageLightbox: "image-lightbox",
    },
    metadata: {},
  };

  // Extract section IDs
  const sections = document.querySelectorAll("section[id]");
  selectors.content.sections = Array.from(sections).map((section) => ({
    id: section.id,
    tag: section.tagName.toLowerCase(),
  }));

  // Extract project metadata
  const heroSection = document.querySelector(".hero--project");
  if (heroSection) {
    const label = heroSection.querySelector(".hero--project__label");
    const header = heroSection.querySelector(".hero--project__header");
    const role = heroSection.querySelector(".hero--project__role");
    const timeline = heroSection.querySelector(".hero--project__timeline");

    selectors.metadata = {
      client: label ? label.textContent.trim() : "",
      title: header ? header.textContent.trim() : "",
      role: role ? role.textContent.trim() : "",
      timeline: timeline ? timeline.textContent.trim() : "",
    };
  }

  return selectors;
}

/**
 * Generate test selector patterns
 */
function generateTestSelectors(selectors) {
  const testSelectors = {
    heroSection: `await expect(page.locator("${selectors.hero.section}")).toBeVisible();`,
    heroHeader: `await expect(page.locator("${selectors.hero.header}")).toBeVisible();`,
    projectMetadata: [],
    contentSections: [],
  };

  // Generate metadata selectors
  if (selectors.metadata.client) {
    testSelectors.projectMetadata.push(
      `await expect(page.locator("text=${selectors.metadata.client}").first()).toBeVisible();`
    );
  }
  if (selectors.metadata.role) {
    testSelectors.projectMetadata.push(
      `await expect(page.locator("text=${selectors.metadata.role}").first()).toBeVisible();`
    );
  }
  if (selectors.metadata.timeline) {
    testSelectors.projectMetadata.push(
      `await expect(page.locator("text=${selectors.metadata.timeline}").first()).toBeVisible();`
    );
  }

  // Generate section selectors
  selectors.content.sections.forEach((section) => {
    testSelectors.contentSections.push(
      `await expect(page.locator("#${section.id}")).toBeVisible();`
    );
  });

  return testSelectors;
}

/**
 * Validate selectors against HTML
 */
function validateSelectors(selectors, htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const results = {
    valid: [],
    invalid: [],
    suggestions: [],
  };

  // Validate hero selectors
  Object.entries(selectors.hero).forEach(([name, selector]) => {
    if (selector && document.querySelector(selector)) {
      results.valid.push({ name, selector });
    } else {
      results.invalid.push({ name, selector });
      results.suggestions.push({
        name,
        suggestion: generateAlternativeSelector(name, document),
      });
    }
  });

  return results;
}

/**
 * Generate alternative selector suggestions
 */
function generateAlternativeSelector(name, document) {
  switch (name) {
    case "section":
      const heroSection = document.querySelector("[class*=\"hero\"]");
      return heroSection
        ? heroSection.className.split(" ").find((cls) => cls.includes("hero"))
        : ".hero";
    case "header":
      const header = document.querySelector("h1");
      return header ? "h1" : "[class*=\"header\"]";
    case "label":
      const label = document.querySelector("[class*=\"label\"]");
      return label
        ? "." + label.className.split(" ").find((cls) => cls.includes("label"))
        : "[class*=\"label\"]";
    case "role":
      const role = document.querySelector("[class*=\"role\"]");
      return role
        ? "." + role.className.split(" ").find((cls) => cls.includes("role"))
        : "[class*=\"role\"]";
    case "timeline":
      const timeline = document.querySelector("[class*=\"timeline\"]");
      return timeline
        ? "." +
            timeline.className
              .split(" ")
              .find((cls) => cls.includes("timeline"))
        : "[class*=\"timeline\"]";
    default:
      return `[class*="${name}"]`;
  }
}

/**
 * Main execution function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "--project":
      const projectName = args[1];
      if (!projectName) {
        console.error("Please specify a project name: --project <name>");
        process.exit(1);
      }
      await processProject(projectName);
      break;

    case "--all":
      await processAllProjects();
      break;

    case "--validate":
      const validateProject = args[1] || "daimler-dcd";
      await validateProjectSelectors(validateProject);
      break;

    default:
      console.log(`
Test Selector Update Automation

Usage:
  node scripts/update-test-selectors.js [command] [options]

Commands:
  --project <name>    Process specific project (e.g., daimler-dcd)
  --all               Process all projects
  --validate [name]   Validate selectors for project (default: daimler-dcd)

Examples:
  node scripts/update-test-selectors.js --project daimler-dcd
  node scripts/update-test-selectors.js --all
  node scripts/update-test-selectors.js --validate
      `);
  }
}

/**
 * Process a specific project
 */
async function processProject(projectName) {
  const projectFile = path.join(PROJECTS_DIR, `project-${projectName}.html`);

  if (!fs.existsSync(projectFile)) {
    console.error(`Project file not found: ${projectFile}`);
    process.exit(1);
  }

  const htmlContent = fs.readFileSync(projectFile, "utf8");
  const selectors = extractSelectorsFromHTML(
    htmlContent,
    `project-${projectName}.html`
  );
  const testSelectors = generateTestSelectors(selectors);

  console.log(`\n=== Selectors for ${projectName} ===`);
  console.log("\nHero Section:");
  console.log(testSelectors.heroSection);
  console.log(testSelectors.heroHeader);

  console.log("\nProject Metadata:");
  testSelectors.projectMetadata.forEach((selector) => console.log(selector));

  console.log("\nContent Sections:");
  testSelectors.contentSections.forEach((selector) => console.log(selector));

  // Save to file
  const outputFile = path.join(TESTS_DIR, `selectors-${projectName}.json`);
  fs.writeFileSync(
    outputFile,
    JSON.stringify({ selectors, testSelectors }, null, 2)
  );
  console.log(`\nSelectors saved to: ${outputFile}`);
}

/**
 * Process all projects
 */
async function processAllProjects() {
  const projectFiles = fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.startsWith("project-") && file.endsWith(".html"));

  console.log(`Processing ${projectFiles.length} project files...`);

  for (const file of projectFiles) {
    const projectName = file.replace("project-", "").replace(".html", "");
    await processProject(projectName);
  }
}

/**
 * Validate selectors for a project
 */
async function validateProjectSelectors(projectName) {
  const projectFile = path.join(PROJECTS_DIR, `project-${projectName}.html`);

  if (!fs.existsSync(projectFile)) {
    console.error(`Project file not found: ${projectFile}`);
    process.exit(1);
  }

  const htmlContent = fs.readFileSync(projectFile, "utf8");

  // Load current test selectors (simplified version)
  const currentSelectors = {
    hero: {
      section: ".hero--project",
      header: ".hero--project__header",
      label: ".hero--project__label",
      role: ".hero--project__role",
      timeline: ".hero--project__timeline",
    },
  };

  const validationResults = validateSelectors(currentSelectors, htmlContent);

  console.log(`\n=== Selector Validation for ${projectName} ===`);

  console.log("\nValid selectors:");
  validationResults.valid.forEach((item) => {
    console.log(`  ✅ ${item.name}: ${item.selector}`);
  });

  if (validationResults.invalid.length > 0) {
    console.log("\nInvalid selectors:");
    validationResults.invalid.forEach((item) => {
      console.log(`  ❌ ${item.name}: ${item.selector}`);
    });

    console.log("\nSuggestions:");
    validationResults.suggestions.forEach((item) => {
      console.log(`  💡 ${item.name}: ${item.suggestion}`);
    });
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { extractSelectorsFromHTML, generateTestSelectors, validateSelectors };
