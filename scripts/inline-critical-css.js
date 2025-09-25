import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractCriticalCSS() {
  try {
    const distDir = path.join(__dirname, '..', 'dist');
    const htmlFile = path.join(distDir, 'index.html');

    // Check if dist directory exists
    try {
      await fs.access(distDir);
    } catch (error) {
      console.error(
        '❌ Build files not found. Please run "npm run build" first.'
      );
      process.exit(1);
    }

    // Find CSS files in dist
    const distFiles = await fs.readdir(distDir);
    const cssFiles = distFiles.filter(file => file.endsWith('.css'));

    if (cssFiles.length === 0) {
      console.error('❌ No CSS file found in dist directory');
      process.exit(1);
    }

    console.log('🎨 Found CSS files:', cssFiles.join(', '));

    // Read the HTML file
    let htmlContent = await fs.readFile(htmlFile, 'utf-8');

    // Extract critical CSS rules manually (simple approach)
    const criticalSelectors = [
      // Above the fold elements
      'html',
      'body',
      'main',
      '.hero',
      '.hero-section',
      '.logo-2d',
      '.site-header',
      '.skip-link',
      '.sr-only',
      '.visually-hidden',
      // Typography basics
      'h1',
      'h2',
      'p',
      // Layout essentials
      '.container',
      '.grid',
      '.flex',
      // Critical utilities
      '.hidden',
      '.block',
      '.inline',
    ];

    // Read the main CSS file (usually the largest one)
    const mainCssFile =
      cssFiles.find(file => file.includes('jaswetz')) || cssFiles[0];
    const cssPath = path.join(distDir, mainCssFile);
    const cssContent = await fs.readFile(cssPath, 'utf-8');

    // Simple critical CSS extraction
    const criticalCSS = extractCriticalRules(cssContent, criticalSelectors);

    if (criticalCSS.length > 0) {
      // Inline critical CSS
      const criticalStyleTag = `<style data-critical-css>\n${criticalCSS}\n</style>`;

      // Insert critical CSS before the first stylesheet link
      const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*>/i;
      const linkMatch = htmlContent.match(linkRegex);

      if (linkMatch) {
        htmlContent = htmlContent.replace(
          linkRegex,
          `${criticalStyleTag}\n${linkMatch[0]}`
        );

        // Write the updated HTML
        await fs.writeFile(htmlFile, htmlContent);

        console.log('✅ Critical CSS inlined successfully');
        console.log(
          `📏 Critical CSS size: ${(criticalCSS.length / 1024).toFixed(2)}KB`
        );
        console.log(`🔗 Original CSS file preserved: ${mainCssFile}`);

        // Optional: Create non-critical CSS file
        const nonCriticalCSS = removeCriticalRules(
          cssContent,
          criticalSelectors
        );
        const nonCriticalPath = path.join(
          distDir,
          `non-critical-${mainCssFile}`
        );
        await fs.writeFile(nonCriticalPath, nonCriticalCSS);
        console.log(`📦 Non-critical CSS saved: non-critical-${mainCssFile}`);
      } else {
        console.warn('⚠️  No stylesheet link found in HTML file');
      }
    } else {
      console.warn('⚠️  No critical CSS rules found');
    }
  } catch (error) {
    console.error('❌ Error processing critical CSS:', error.message);
    process.exit(1);
  }
}

function extractCriticalRules(cssContent, selectors) {
  const criticalRules = [];
  const lines = cssContent.split('\n');
  let currentRule = '';
  let inRule = false;
  let braceCount = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check for CSS layer imports or comments
    if (trimmedLine.startsWith('@import') || trimmedLine.startsWith('/*')) {
      if (!inRule) {
        criticalRules.push(line);
      }
      continue;
    }

    // Track braces to know when we're inside a rule
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    braceCount += openBraces - closeBraces;

    currentRule += line + '\n';

    // Check if this rule contains critical selectors
    if (!inRule && (braceCount > 0 || trimmedLine.includes('{'))) {
      const isCritical = selectors.some(selector => {
        const regex = new RegExp(
          `\\b${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
          'i'
        );
        return regex.test(currentRule);
      });

      if (isCritical) {
        inRule = true;
      }
    }

    // End of rule
    if (braceCount === 0 && currentRule.includes('}')) {
      if (inRule) {
        criticalRules.push(currentRule.trim());
      }
      currentRule = '';
      inRule = false;
    }
  }

  return criticalRules.join('\n');
}

function removeCriticalRules(cssContent, selectors) {
  // This is a simplified version - in a real implementation you'd want more sophisticated parsing
  return cssContent; // For now, just return the original CSS
}

// Run the extraction
extractCriticalCSS();
