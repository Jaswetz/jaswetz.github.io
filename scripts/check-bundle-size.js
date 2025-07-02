#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIMITS = {
  "dist/**/*.js": 50 * 1024, // 50KB per JS file
  "dist/**/*.css": 100 * 1024, // 100KB per CSS file (design systems need more space)
};

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (err) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function findFiles(dir, pattern) {
  const files = [];

  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directory ${dir} does not exist`);
    return files;
  }

  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (pattern.test(item)) {
        files.push(fullPath);
      }
    }
  }

  walkDir(dir);
  return files;
}

function checkBundleSize() {
  console.log("📦 Checking bundle sizes...\n");

  const projectRoot = path.resolve(__dirname, "..");
  const distDir = path.join(projectRoot, "dist");

  let hasErrors = false;

  // Check JavaScript files
  const jsFiles = findFiles(distDir, /\.js$/);
  const jsLimit = LIMITS["dist/**/*.js"];

  console.log("JavaScript files:");
  if (jsFiles.length === 0) {
    console.log("  No JS files found");
  } else {
    let totalJsSize = 0;
    for (const file of jsFiles) {
      const size = getFileSize(file);
      totalJsSize += size;
      const relativePath = path.relative(projectRoot, file);
      console.log(`  ${relativePath}: ${formatBytes(size)}`);
    }

    console.log(
      `  Total JS size: ${formatBytes(totalJsSize)} (limit: ${formatBytes(
        jsLimit
      )})`
    );
    if (totalJsSize > jsLimit) {
      console.log("  ❌ JS bundle size exceeds limit!");
      hasErrors = true;
    } else {
      console.log("  ✅ JS bundle size OK");
    }
  }

  console.log();

  // Check CSS files
  const cssFiles = findFiles(distDir, /\.css$/);
  const cssLimit = LIMITS["dist/**/*.css"];

  console.log("CSS files:");
  if (cssFiles.length === 0) {
    console.log("  No CSS files found");
  } else {
    let totalCssSize = 0;
    for (const file of cssFiles) {
      const size = getFileSize(file);
      totalCssSize += size;
      const relativePath = path.relative(projectRoot, file);
      console.log(`  ${relativePath}: ${formatBytes(size)}`);
    }

    console.log(
      `  Total CSS size: ${formatBytes(totalCssSize)} (limit: ${formatBytes(
        cssLimit
      )})`
    );
    if (totalCssSize > cssLimit) {
      console.log("  ❌ CSS bundle size exceeds limit!");
      hasErrors = true;
    } else {
      console.log("  ✅ CSS bundle size OK");
    }
  }

  if (hasErrors) {
    console.log("\n❌ Bundle size check failed!");
    process.exit(1);
  } else {
    console.log("\n✅ All bundle sizes within limits");
  }
}

checkBundleSize();
