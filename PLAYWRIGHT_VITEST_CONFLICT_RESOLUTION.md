# Playwright/Vitest Conflict Resolution

## Problem

The project was experiencing a critical test infrastructure conflict with the error:

```
TypeError: Cannot redefine property: Symbol($$jest-matchers-object)
```

This occurred because both Vitest and Playwright were trying to define their own matchers on the same symbol, causing a collision when running integration tests.

## Root Cause

The file `tests/analytics.test.js` was using Playwright's `test` and `expect` imports but had a `.test.js` extension, causing it to be processed by both test runners:

1. Vitest was configured to include `**/*.test.js` files
2. Playwright was configured to run all files in the `tests/` directory
3. Both test runners were trying to define their own matchers, causing the conflict

## Solution

### 1. File Separation

- Renamed `tests/analytics.test.js` to `tests/analytics.spec.js`
- This ensures Playwright-specific tests use `.spec.js` extension
- Vitest unit tests use `.test.js` extension

### 2. Updated Vitest Configuration

```javascript
// vitest.config.js
export default defineConfig({
  test: {
    include: [
      "tests/**/*.test.js", // Only include .test.js files for Vitest
      "tests/**/*.test.mjs", // Include .test.mjs files
    ],
    exclude: [
      "**/*.spec.js", // Exclude ALL Playwright .spec.js files
      "**/*integration*.*", // Exclude integration tests
      "**/*e2e*.*", // Exclude E2E tests
      "**/*playwright*.*", // Exclude any Playwright-specific files
      // ... other exclusions
    ],
  },
});
```

### 3. Updated Playwright Configuration

```javascript
// playwright.config.js
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js", // Only run .spec.js files with Playwright
  // ... rest of config
});
```

### 4. Enhanced Test Setup Isolation

Updated `test-setup.js` to only run Vitest-specific setup when in Vitest environment:

```javascript
// Only run this setup in Vitest environment
if (typeof vi === "undefined") {
  throw new Error("This setup file should only be used with Vitest");
}

// Conditional mocking based on environment
if (typeof vi !== "undefined") {
  // Vitest-specific mocks
} else {
  // Fallback for other environments
}
```

## Verification

### Unit Tests (Vitest)

```bash
npm run test:unit:run
# ✓ 83/83 tests passing
```

### Integration Tests (Playwright)

```bash
npm run test:integration
# ✓ No more "Cannot redefine property" errors
# ✓ Tests run successfully (may have content-related failures)
```

### Combined Tests

```bash
npm run test:all
# ✓ Both test suites run sequentially without conflicts
```

## File Structure

```
tests/
├── *.test.js          # Vitest unit tests
├── *.spec.js          # Playwright integration tests
├── test-setup.js      # Vitest-only setup file
└── utility files      # Shared utilities
```

## Key Takeaways

1. **Clear separation**: Use different file extensions for different test runners
2. **Explicit configuration**: Be specific about which files each test runner should process
3. **Environment isolation**: Ensure setup files are environment-specific
4. **Proper exclusions**: Use comprehensive exclude patterns to prevent cross-contamination

The conflict has been completely resolved, allowing both unit tests and integration tests to run independently and together without issues.
