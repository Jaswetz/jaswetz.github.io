#!/usr/bin/env node

/**
 * CSS Bundle Size Monitoring Script
 *
 * Monitors CSS bundle size to prevent regressions during development.
 * Can be integrated into CI/CD pipeline or run locally.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CSS_FILE_PATTERN = 'dist/jaswetz.github.io.*.css'; // Pattern for hashed CSS files
const THRESHOLD_SIZE_KB = 300; // Adjust threshold as needed
const BASELINE_FILE = '.css-baseline.json';

/**
 * Find the main CSS file (handles hashed filenames)
 */
function findCssFile() {
  const distDir = 'dist';
  const prefix = 'jaswetz.github.io.';
  const suffix = '.css';

  if (!fs.existsSync(distDir)) {
    throw new Error(`Directory not found: ${distDir}`);
  }

  const files = fs
    .readdirSync(distDir)
    .filter(file => file.startsWith(prefix) && file.endsWith(suffix))
    .map(file => path.join(distDir, file));

  if (files.length === 0) {
    throw new Error(`No CSS file found matching pattern: ${CSS_FILE_PATTERN}`);
  }

  // Return the largest CSS file (should be the main bundle)
  return files.reduce((largest, current) => {
    const largestSize = fs.statSync(largest).size;
    const currentSize = fs.statSync(current).size;
    return currentSize > largestSize ? current : largest;
  });
}

/**
 * Get file size in KB
 */
function getFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

/**
 * Read baseline size from file
 */
function readBaseline() {
  if (!fs.existsSync(BASELINE_FILE)) {
    return null;
  }

  try {
    const baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));
    return baseline.size;
  } catch (error) {
    console.warn(`Warning: Could not read baseline file: ${error.message}`);
    return null;
  }
}

/**
 * Write baseline size to file
 */
function writeBaseline(size) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const baseline = {
    size: size,
    timestamp: new Date().toISOString(),
    version: packageJson.version,
  };

  fs.writeFileSync(BASELINE_FILE, JSON.stringify(baseline, null, 2));
}

/**
 * Check if current size is within acceptable range
 */
function checkSize(currentSize, baselineSize) {
  const sizeDifference = currentSize - baselineSize;
  const percentChange = ((sizeDifference / baselineSize) * 100).toFixed(2);

  console.log(`📊 CSS Bundle Size Analysis`);
  console.log(`============================`);
  console.log(`Current size: ${currentSize} KB`);
  console.log(`Baseline size: ${baselineSize} KB`);
  console.log(
    `Difference: ${sizeDifference >= 0 ? '+' : ''}${sizeDifference} KB (${percentChange}%)`
  );
  console.log('');

  if (Math.abs(sizeDifference) > 50) {
    // More than 50KB difference triggers warning
    console.warn(`⚠️  Significant CSS size change detected!`);
    console.warn(`This may indicate:`);
    console.warn(`   • New features requiring styling`);
    console.warn(`   • CSS optimization opportunities`);
    console.warn(`   • CSS bundle changes`);
    console.log('');
  }

  if (currentSize > THRESHOLD_SIZE_KB) {
    console.error(`❌ CSS bundle exceeds threshold of ${THRESHOLD_SIZE_KB} KB`);
    process.exit(1);
  }

  if (Math.abs(sizeDifference) > 100) {
    // More than 100KB difference fails CI
    console.error(`❌ CSS bundle size change is too large!`);
    console.error(`Consider optimizing or updating baseline before deploying.`);
    process.exit(1);
  }

  console.log(`✅ CSS bundle size is within acceptable range`);
}

/**
 * Main function
 */
function main() {
  try {
    const cssFilePath = findCssFile();
    const cssSize = parseFloat(getFileSize(cssFilePath));
    const baselineSize = readBaseline();

    console.log(`🔍 Checking CSS bundle size for: ${cssFilePath}`);
    console.log('');

    if (!baselineSize) {
      console.log(
        `📝 No baseline found. Creating baseline with current size: ${cssSize} KB`
      );
      writeBaseline(cssSize);
      console.log(`✅ Baseline created successfully`);
      return;
    }

    checkSize(cssSize, baselineSize);

    // Update baseline if explicitly requested
    if (process.argv.includes('--update-baseline')) {
      writeBaseline(cssSize);
      console.log(`📝 Baseline updated to ${cssSize} KB`);
    }
  } catch (error) {
    console.error(`❌ Error checking CSS bundle size: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { findCssFile, getFileSize, readBaseline, writeBaseline, checkSize };
