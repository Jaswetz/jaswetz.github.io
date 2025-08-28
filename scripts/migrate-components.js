#!/usr/bin/env node

/**
 * Component Migration Script
 * Helps migrate existing components to use BaseComponent and new utilities
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ComponentMigrator {
  constructor() {
    this.srcDir = path.join(__dirname, "..", "src");
    this.componentsDir = path.join(this.srcDir, "js", "components");
    this.backupDir = path.join(__dirname, "..", "backup-components");

    this.migrationPatterns = [
      {
        name: "Replace console.log with logger",
        pattern: /console\.(log|warn|error|debug)\(/g,
        replacement: "logger.$1(",
      },
      {
        name: "Add logger import",
        pattern: /^(class \w+ extends HTMLElement)/m,
        replacement: "import logger from '../utils/Logger.js';\n\n$1",
      },
      {
        name: "Replace HTMLElement with BaseComponent",
        pattern: /extends HTMLElement/g,
        replacement: "extends BaseComponent",
      },
      {
        name: "Add BaseComponent import",
        pattern: /^(import logger)/m,
        replacement: "import BaseComponent from './BaseComponent.js';\n$1",
      },
      {
        name: "Replace addEventListener with cleanup version",
        pattern:
          /(\w+)\.addEventListener\((['"`])(\w+)\2,\s*([^,]+)(?:,\s*([^)]+))?\)/g,
        replacement: "this.addEventListenerWithCleanup($1, $2$3$2, $4, $5)",
      },
      {
        name: "Replace window scroll listeners",
        pattern:
          /window\.addEventListener\((['"`])scroll\1,\s*([^,]+)(?:,\s*([^)]+))?\)/g,
        replacement: "this.addScrollListenerWithCleanup($2, $3)",
      },
      {
        name: "Replace setTimeout with cleanup version",
        pattern: /setTimeout\(([^,]+),\s*([^)]+)\)/g,
        replacement: "this.addTimeoutWithCleanup($1, $2)",
      },
      {
        name: "Replace setInterval with cleanup version",
        pattern: /setInterval\(([^,]+),\s*([^)]+)\)/g,
        replacement: "this.addIntervalWithCleanup($1, $2)",
      },
      {
        name: "Replace querySelector with cached version",
        pattern: /document\.querySelectorAll\((['"`])([^'"`]+)\1\)/g,
        replacement: "domCache.query('$2')",
      },
      {
        name: "Replace shadowRoot.querySelector",
        pattern: /this\.shadowRoot\.querySelector(All)?\((['"`])([^'"`]+)\2\)/g,
        replacement: "this.query('$3'$1)",
      },
    ];
  }

  /**
   * Create backup of original files
   */
  createBackup() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    const componentFiles = this.getComponentFiles();

    componentFiles.forEach((filePath) => {
      const relativePath = path.relative(this.componentsDir, filePath);
      const backupPath = path.join(this.backupDir, relativePath);
      const backupDir = path.dirname(backupPath);

      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      fs.copyFileSync(filePath, backupPath);
    });

    console.log(`✅ Backup created in ${this.backupDir}`);
  }

  /**
   * Get all component JavaScript files
   */
  getComponentFiles() {
    const files = [];

    const scanDirectory = (dir) => {
      const items = fs.readdirSync(dir);

      items.forEach((item) => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          scanDirectory(itemPath);
        } else if (item.endsWith(".js") && !item.includes("BaseComponent")) {
          files.push(itemPath);
        }
      });
    };

    if (fs.existsSync(this.componentsDir)) {
      scanDirectory(this.componentsDir);
    }

    return files;
  }

  /**
   * Analyze a component file for migration opportunities
   */
  analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const issues = [];

    // Check for console statements
    const consoleMatches = content.match(/console\.(log|warn|error|debug)/g);
    if (consoleMatches) {
      issues.push(`Found ${consoleMatches.length} console statements`);
    }

    // Check for HTMLElement extension
    if (content.includes("extends HTMLElement")) {
      issues.push("Extends HTMLElement (should use BaseComponent)");
    }

    // Check for manual event listeners
    const eventListenerMatches = content.match(/addEventListener/g);
    if (eventListenerMatches) {
      issues.push(
        `Found ${eventListenerMatches.length} manual event listeners`
      );
    }

    // Check for scroll listeners
    const scrollListenerMatches = content.match(/addEventListener.*scroll/g);
    if (scrollListenerMatches) {
      issues.push(`Found ${scrollListenerMatches.length} scroll listeners`);
    }

    // Check for setTimeout/setInterval
    const timerMatches = content.match(/set(Timeout|Interval)/g);
    if (timerMatches) {
      issues.push(`Found ${timerMatches.length} timers without cleanup`);
    }

    // Check for querySelector calls
    const queryMatches = content.match(/querySelector(All)?/g);
    if (queryMatches) {
      issues.push(`Found ${queryMatches.length} DOM queries (could be cached)`);
    }

    return {
      filePath,
      issues,
      needsMigration: issues.length > 0,
    };
  }

  /**
   * Migrate a single component file
   */
  migrateFile(filePath) {
    let content = fs.readFileSync(filePath, "utf8");
    const originalContent = content;
    let changes = [];

    // Apply migration patterns
    this.migrationPatterns.forEach((pattern) => {
      const matches = content.match(pattern.pattern);
      if (matches) {
        content = content.replace(pattern.pattern, pattern.replacement);
        changes.push(`${pattern.name}: ${matches.length} replacements`);
      }
    });

    // Add necessary imports at the top
    const imports = [];

    if (content.includes("logger.")) {
      imports.push("import logger from '../utils/Logger.js';");
    }

    if (content.includes("BaseComponent")) {
      imports.push("import BaseComponent from './BaseComponent.js';");
    }

    if (content.includes("domCache.")) {
      imports.push("import { domCache } from '../utils/DOMCache.js';");
    }

    if (
      content.includes("scrollManager.") ||
      content.includes("addScrollListenerWithCleanup")
    ) {
      imports.push(
        "import { scrollManager } from '../utils/ScrollManager.js';"
      );
    }

    // Add imports after existing imports or at the top
    if (imports.length > 0) {
      const importSection = imports.join("\n") + "\n\n";
      const existingImports = content.match(/^import.*$/gm);

      if (existingImports) {
        // Add after existing imports
        const lastImportIndex = content.lastIndexOf(
          existingImports[existingImports.length - 1]
        );
        const insertIndex = content.indexOf("\n", lastImportIndex) + 1;
        content =
          content.slice(0, insertIndex) +
          importSection +
          content.slice(insertIndex);
      } else {
        // Add at the top
        content = importSection + content;
      }
    }

    // Replace connectedCallback with init method if extending BaseComponent
    if (content.includes("extends BaseComponent")) {
      content = content.replace(/connectedCallback\(\)\s*{/g, "init() {");

      // Remove manual cleanup from disconnectedCallback
      content = content.replace(
        /disconnectedCallback\(\)\s*{[\s\S]*?}/g,
        "// Cleanup handled automatically by BaseComponent"
      );
    }

    // Write the migrated file
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      return changes;
    }

    return [];
  }

  /**
   * Run migration analysis
   */
  analyze() {
    console.log("🔍 Analyzing components for migration opportunities...\n");

    const componentFiles = this.getComponentFiles();
    const results = componentFiles.map((file) => this.analyzeFile(file));

    const needsMigration = results.filter((r) => r.needsMigration);

    console.log("📊 Analysis Results:");
    console.log(`   Total components: ${results.length}`);
    console.log(`   Need migration: ${needsMigration.length}`);
    console.log(
      `   Already clean: ${results.length - needsMigration.length}\n`
    );

    if (needsMigration.length > 0) {
      console.log("🚨 Components needing migration:\n");

      needsMigration.forEach((result) => {
        const relativePath = path.relative(this.srcDir, result.filePath);
        console.log(`   ${relativePath}:`);
        result.issues.forEach((issue) => {
          console.log(`     - ${issue}`);
        });
        console.log("");
      });
    }

    return results;
  }

  /**
   * Run the migration process
   */
  migrate() {
    console.log("🚀 Starting component migration...\n");

    // Create backup first
    this.createBackup();

    const componentFiles = this.getComponentFiles();
    let totalChanges = 0;

    componentFiles.forEach((filePath) => {
      const relativePath = path.relative(this.srcDir, filePath);
      console.log(`📝 Migrating ${relativePath}...`);

      try {
        const changes = this.migrateFile(filePath);

        if (changes.length > 0) {
          console.log(`   ✅ Applied ${changes.length} changes:`);
          changes.forEach((change) => {
            console.log(`      - ${change}`);
          });
          totalChanges += changes.length;
        } else {
          console.log("   ℹ️  No changes needed");
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }

      console.log("");
    });

    console.log(
      `🎉 Migration complete! Applied ${totalChanges} total changes.`
    );
    console.log(`📁 Backup available in: ${this.backupDir}`);

    if (totalChanges > 0) {
      console.log("\n⚠️  Next steps:");
      console.log("   1. Review the migrated files");
      console.log("   2. Test components manually");
      console.log("   3. Run npm run test to verify");
      console.log("   4. Update any custom logic as needed");
    }
  }

  /**
   * Restore from backup
   */
  restore() {
    if (!fs.existsSync(this.backupDir)) {
      console.log("❌ No backup found to restore from");
      return;
    }

    console.log("🔄 Restoring from backup...");

    const restoreDirectory = (backupPath, targetPath) => {
      const items = fs.readdirSync(backupPath);

      items.forEach((item) => {
        const backupItemPath = path.join(backupPath, item);
        const targetItemPath = path.join(targetPath, item);
        const stat = fs.statSync(backupItemPath);

        if (stat.isDirectory()) {
          if (!fs.existsSync(targetItemPath)) {
            fs.mkdirSync(targetItemPath, { recursive: true });
          }
          restoreDirectory(backupItemPath, targetItemPath);
        } else {
          fs.copyFileSync(backupItemPath, targetItemPath);
        }
      });
    };

    restoreDirectory(this.backupDir, this.componentsDir);
    console.log("✅ Restore complete");
  }
}

// CLI interface
const migrator = new ComponentMigrator();
const command = process.argv[2];

switch (command) {
  case "analyze":
    migrator.analyze();
    break;

  case "migrate":
    migrator.migrate();
    break;

  case "restore":
    migrator.restore();
    break;

  default:
    console.log("Component Migration Tool");
    console.log("");
    console.log("Usage:");
    console.log(
      "  node scripts/migrate-components.js analyze  - Analyze components for migration opportunities"
    );
    console.log(
      "  node scripts/migrate-components.js migrate  - Run the migration process"
    );
    console.log(
      "  node scripts/migrate-components.js restore  - Restore from backup"
    );
    console.log("");
    console.log("Examples:");
    console.log("  npm run migrate:analyze   # Analyze components");
    console.log("  npm run migrate:run       # Run migration");
    console.log("  npm run migrate:restore   # Restore backup");
    break;
}
