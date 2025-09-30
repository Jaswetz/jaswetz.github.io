#!/usr/bin/env node

/**
 * Font Loading Optimization Script
 * Updates all HTML files with optimized font loading
 */

import fs from "fs";
import path from "path";
import { glob } from "glob";

// Font optimization template
const fontOptimizationTemplate = `    <!-- Font optimization -->
    <!-- Preconnect to Google Fonts for faster loading -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Preload critical font files for better performance -->
    <link
      rel="preload"
      href="https://fonts.gstatic.com/s/gentiumplus/v6/Iura6YBj_oCad4hzLCCbvw.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="https://fonts.gstatic.com/s/laila/v13/LYjMdG_8nE8jDIRdiidIrEIu.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="https://fonts.gstatic.com/s/ptsans/v17/jizaRExUiTo99u79D0KExcOPIDU.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />

    <!-- Preload Google Fonts CSS for better performance -->
    <link
      rel="preload"
      href="https://fonts.googleapis.com/css2?family=Gentium+Plus:wght@400;700&family=Laila:wght@400;600&family=PT+Sans:wght@400;700&display=swap"
      as="style"
      onload="this.onload=null;this.rel='stylesheet'"
    />
    <noscript>
      <link
        href="https://fonts.googleapis.com/css2?family=Gentium+Plus:wght@400;700&family=Laila:wght@400;600&family=PT+Sans:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </noscript>

    <!-- Fallback for browsers that don't support preload -->
    <link
      href="https://fonts.googleapis.com/css2?family=Gentium+Plus:wght@400;700&family=Laila:wght@400;600&family=PT+Sans:wght@400;700&display=swap"
      rel="stylesheet"
      media="print"
      onload="this.media='all'"
    />`;

async function optimizeFontLoading() {
  console.log("🔤 Optimizing font loading across all HTML files...");

  // Find all HTML files
  const htmlFiles = await glob("src/**/*.html");
  let updatedFiles = 0;

  htmlFiles.forEach((filePath) => {
    try {
      let content = fs.readFileSync(filePath, "utf8");
      let updated = false;

      // Remove old font loading patterns
      const oldPatterns = [
        /<!-- Font optimization -->[\s\S]*?<\/noscript>/g,
        /<!-- Preconnect to Google Fonts[\s\S]*?rel="stylesheet"\s*\/>/g,
        /<!-- Preload Google Fonts[\s\S]*?rel="stylesheet"\s*\/>/g,
        /<link[^>]*fonts\.googleapis\.com[^>]*>/g,
        /<link[^>]*fonts\.gstatic\.com[^>]*>/g,
      ];

      oldPatterns.forEach((pattern) => {
        if (pattern.test(content)) {
          content = content.replace(pattern, "");
          updated = true;
        }
      });

      // Insert new font optimization before CSS imports
      const cssImportRegex = /<link[^>]*rel="stylesheet"[^>]*href="[^"]*\.css"/;
      const cssImportMatch = content.match(cssImportRegex);

      if (cssImportMatch) {
        const insertPosition = content.indexOf(cssImportMatch[0]);
        content =
          content.slice(0, insertPosition) +
          fontOptimizationTemplate +
          "\n\n    " +
          content.slice(insertPosition);
        updated = true;
      } else {
        // Fallback: insert before closing </head>
        const headCloseRegex = /<\/head>/;
        if (headCloseRegex.test(content)) {
          content = content.replace(
            headCloseRegex,
            `${fontOptimizationTemplate}\n  </head>`
          );
          updated = true;
        }
      }

      if (updated) {
        fs.writeFileSync(filePath, content);
        updatedFiles++;
        console.log(`✅ Updated: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  });

  console.log(`\n🎉 Font loading optimization complete!`);
  console.log(`📊 Updated ${updatedFiles} HTML files`);

  if (updatedFiles > 0) {
    console.log("\n📋 Changes made:");
    console.log(
      "  • Added font-display: swap for better perceived performance"
    );
    console.log(
      "  • Preloaded critical font files (Gentium Plus, Laila, PT Sans)"
    );
    console.log("  • Implemented progressive enhancement with fallbacks");
    console.log("  • Added noscript fallback for accessibility");
  }
}

// Run the optimization
optimizeFontLoading().catch(console.error);
