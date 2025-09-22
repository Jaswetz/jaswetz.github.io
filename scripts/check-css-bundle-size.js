#!/usr/bin/env node

/**
 * CSS Bundle Size Monitoring Script
 *
 * Monitors CSS bundle size to prevent regressions during development.
 * Can be integrated into CI/CD pipeline or run locally.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CSS_FILE_PATH = 'dist/index.css'; // Adjust based on your build output
const THRESHOLD_SIZE_KB = 300; // Adjust threshold as needed
const BASELINE_FILE = '.css-baseline.json';

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
  const baseline = {
    size: size,
    timestamp: new Date().toISOString(),
    version: require('../package.json').version,
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
    const cssSize = parseFloat(getFileSize(CSS_FILE_PATH));
    const baselineSize = readBaseline();

    console.log(`🔍 Checking CSS bundle size...`);
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
if (require.main === module) {
  main();
}

module.exports = {
  getFileSize,
  readBaseline,
  writeBaseline,
  checkSize,
};
