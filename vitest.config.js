/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom", // Better for Web Components than jsdom
    globals: true,
    setupFiles: ["./test-setup.js"],
    include: ["tests/**/*.test.{js,mjs}"], // Only include .test.js files
    exclude: [
      "**/*.spec.js", // Exclude ALL Playwright .spec.js files
      "**/analytics.test.js", // Specifically exclude Playwright analytics test
      "**/*integration*.*", // Exclude integration tests
      "**/*e2e*.*", // Exclude E2E tests
      "node_modules/**",
      "dist/**",
      "dev-build/**",
      ".parcel-cache/**",
      "tests/analytics.test.js", // Explicitly exclude this Playwright file
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
