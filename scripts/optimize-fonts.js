#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

console.log("🔤 Analyzing font usage and generating optimizations...\n");

function analyzeFontUsage() {
  console.log("📊 Current font configuration:");

  const fonts = {
    Laila: {
      usage: "Headings",
      weights: ["400", "600"],
      googleFonts: true,
      preload: true,
      fallback: "\"Times New Roman\", \"Georgia\", \"Baskerville\", serif",
    },
    "Gentium Plus": {
      usage: "Body text",
      weights: ["400", "700"],
      googleFonts: true,
      preload: true,
      fallback: "\"Times New Roman\", \"Georgia\", \"Baskerville\", serif",
    },
    "PT Sans": {
      usage: "UI elements",
      weights: ["400", "700"],
      googleFonts: true,
      preload: false,
      fallback:
        "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Helvetica Neue\", Arial, sans-serif",
    },
  };

  Object.entries(fonts).forEach(([fontName, config]) => {
    console.log(`  ${fontName}:`);
    console.log(`    Usage: ${config.usage}`);
    console.log(`    Weights: ${config.weights.join(", ")}`);
    console.log(`    Should preload: ${config.preload}`);
    console.log(`    Fallback: ${config.fallback}`);
    console.log("");
  });

  return fonts;
}

function generateFontOptimizations(fonts) {
  console.log("⚡ Font optimization recommendations:");
  console.log("");

  // Generate Google Fonts URL with display=swap
  const googleFontsUrl = generateOptimizedGoogleFontsUrl(fonts);
  console.log("1. 🌐 Optimized Google Fonts URL:");
  console.log(`   ${googleFontsUrl}`);
  console.log("");

  // Generate preload links
  console.log("2. ⚡ Font preload links for critical fonts:");
  Object.entries(fonts).forEach(([fontName, config]) => {
    if (config.preload) {
      const safeFontName = fontName.replace(/ /g, "+");
      config.weights.forEach((weight) => {
        console.log(
          `   <link rel="preload" href="https://fonts.gstatic.com/s/${safeFontName.toLowerCase()}/v1/${safeFontName}-${weight}.woff2" as="font" type="font/woff2" crossorigin>`
        );
      });
    }
  });
  console.log("");

  // Generate CSS with font-display
  console.log("3. 📝 CSS font-face declarations with font-display:");
  console.log("   Add font-display: swap; to all @font-face rules");
  console.log("");

  // Generate subset recommendations
  console.log("4. ✂️  Font subsetting recommendations:");
  console.log("   - Use Google Fonts text parameter for custom character sets");
  console.log("   - Consider latin-ext subset for European characters");
  console.log("   - Remove unused weights and styles");
  console.log("");

  return {
    googleFontsUrl,
    preloadLinks: generatePreloadLinks(fonts),
  };
}

function generateOptimizedGoogleFontsUrl(fonts) {
  const fontRequests = [];

  Object.entries(fonts).forEach(([fontName, config]) => {
    if (config.googleFonts) {
      const safeName = fontName.replace(/ /g, "+");
      const weights = config.weights.join(";");
      fontRequests.push(`${safeName}:wght@${weights}`);
    }
  });

  return `https://fonts.googleapis.com/css2?${fontRequests
    .map((f) => `family=${f}`)
    .join("&")}&display=swap`;
}

function generatePreloadLinks(fonts) {
  const links = [];
  Object.entries(fonts).forEach(([fontName, config]) => {
    if (config.preload && config.googleFonts) {
      const safeName = fontName.replace(/ /g, "+");
      config.weights.forEach((weight) => {
        links.push({
          fontName,
          weight,
          href: `https://fonts.gstatic.com/s/${safeName.toLowerCase()}/v1/${safeName}-${weight}.woff2`,
        });
      });
    }
  });
  return links;
}

function generateFontLoadingStrategy() {
  console.log("5. 🚀 Font loading strategy:");
  console.log("   a) Preload critical fonts (headings, body text)");
  console.log("   b) Use font-display: swap for non-critical fonts");
  console.log("   c) Implement fallback font matching");
  console.log(
    "   d) Consider using a font loading library like Web Font Loader"
  );
  console.log("");

  console.log("6. 📱 Performance recommendations:");
  console.log("   - Limit to 2-3 font families maximum");
  console.log("   - Use system fonts as fallbacks");
  console.log("   - Implement font loading events for progressive enhancement");
  console.log("   - Consider using preconnect for Google Fonts domain");
  console.log("");
}

function createFontOptimizationReport() {
  const reportPath = path.join(projectRoot, "FONT_OPTIMIZATION_REPORT.md");

  const report = `# Font Optimization Report

## Current Font Stack

### Primary Fonts
- **Laila** (Headings) - Google Fonts
- **Gentium Plus** (Body) - Google Fonts  
- **PT Sans** (UI) - Google Fonts

## Optimization Checklist

### ✅ Completed
- [x] Font fallback stacks defined
- [x] CSS custom properties for font families

### 🔲 To Implement
- [ ] Add font preload links for critical fonts
- [ ] Implement font-display: swap
- [ ] Add preconnect for Google Fonts
- [ ] Optimize Google Fonts URL with specific weights
- [ ] Consider font subsetting for smaller file sizes
- [ ] Implement font loading events
- [ ] Add responsive font sizes

## Implementation Steps

### 1. Update HTML \`<head>\`
\`\`\`html
<!-- Preconnect to Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload critical fonts -->
<link rel="preload" href="https://fonts.gstatic.com/s/laila/v1/Laila-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="https://fonts.gstatic.com/s/gentiumplus/v1/GentiumPlus-Regular.woff2" as="font" type="font/woff2" crossorigin>

<!-- Optimized Google Fonts CSS -->
<link href="https://fonts.googleapis.com/css2?family=Gentium+Plus:wght@400;700&family=Laila:wght@400;600&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet">
\`\`\`

### 2. Update CSS
\`\`\`css
/* Add font-display to any local @font-face rules */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}
\`\`\`

### 3. Performance Impact
- **Before**: Multiple render-blocking font requests
- **After**: Non-blocking font loading with system font fallbacks
- **Expected improvement**: 200-500ms faster First Contentful Paint

## Next Steps
1. Implement preload links in HTML
2. Add preconnect for Google Fonts
3. Test font loading performance
4. Consider implementing font loading JavaScript for better control
`;

  fs.writeFileSync(reportPath, report);
  console.log(`📋 Font optimization report saved to: ${reportPath}`);
}

// Run the analysis
const fonts = analyzeFontUsage();
generateFontOptimizations(fonts);
generateFontLoadingStrategy();
createFontOptimizationReport();

console.log("✨ Font optimization analysis complete!");
console.log(
  "💡 Check FONT_OPTIMIZATION_REPORT.md for detailed implementation steps."
);
