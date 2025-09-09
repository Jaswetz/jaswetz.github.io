/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom", // Better for Web Components than jsdom
    globals: true,
    setupFiles: ["./test-setup.js"],
    include: [
      "tests/**/*.test.js", // Only include .test.js files for Vitest
      "tests/**/*.test.mjs", // Include .test.mjs files
    ],
    exclude: [
      "**/*.spec.js", // Exclude ALL Playwright .spec.js files
      "**/*integration*.*", // Exclude integration tests
      "**/*e2e*.*", // Exclude E2E tests
      "**/*playwright*.*", // Exclude any Playwright-specific files
      "node_modules/**",
      "dist/**",
      "dev-build/**",
      ".parcel-cache/**",
      "tests/selector-validation.js", // Exclude utility files
      "tests/sidebar-navigation-test.js", // Exclude non-test files
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: [
        "node_modules/",
        "dist/",
        "dev-build/",
        "scripts/",
        "docs/",
        "**/*.config.js",
        "**/*.config.mjs",
        "**/*.d.ts",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
