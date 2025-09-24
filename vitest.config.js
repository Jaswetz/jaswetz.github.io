/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom', // Better for Web Components than jsdom
    globals: true,
    setupFiles: ['./test-setup.js'],
    include: [
      'tests/unit/**/*.test.js', // Only include .test.js files for Vitest
      'tests/unit/**/*.test.mjs', // Include .test.mjs files
      'tests/performance-monitoring.test.js', // Include performance monitoring tests
    ],
    exclude: [
      '**/*.spec.js', // Exclude ALL Playwright .spec.js files
      '**/*integration*.*', // Exclude integration tests
      '**/*e2e*.*', // Exclude E2E tests
      '**/*playwright*.*', // Exclude any Playwright-specific files
      'node_modules/**',
      'dist/**',
      'dev-build/**',
      '.parcel-cache/**',
      'tests/selector-validation.js', // Exclude utility files
      'tests/sidebar-navigation-test.js', // Exclude non-test files
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'dev-build/',
        'scripts/',
        'docs/',
        '**/*.config.js',
        '**/*.config.mjs',
        '**/*.d.ts',
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
      '@': '/src',
    },
  },
});
