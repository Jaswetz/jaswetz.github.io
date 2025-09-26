#!/usr/bin/env node

/**
 * Bundle Size Monitor
 *
 * Automated bundle size tracking and regression detection
 * Part of the Portfolio Refactoring and Optimization project
 *
 * Features:
 * - Track JavaScript and CSS bundle sizes over time
 * - Detect size regressions and improvements
 * - Generate detailed reports with file-level analysis
 * - CI/CD integration with configurable thresholds
 * - Historical data tracking and trending analysis
 */

import { execSync } from 'child_process';
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

class BundleSizeMonitor {
  constructor(options = {}) {
    this.distDir = options.distDir || join(projectRoot, 'dist');
    this.outputDir = options.outputDir || join(projectRoot, 'bundle-reports');
    this.historyFile = join(this.outputDir, 'bundle-history.json');
    this.configFile = join(projectRoot, 'bundlesize.json');

    // Default size budgets (in bytes)
    this.budgets = {
      js: 600 * 1024, // 600KB (realistic for portfolio with analytics)
      css: 300 * 1024, // 300KB (includes all CSS files)
      total: 1000 * 1024, // 1000KB (total bundle budget)
    };

    // Regression thresholds
    this.regressionThresholds = {
      warning: 0.05, // 5% size increase
      error: 0.15, // 15% size increase
      critical: 0.25, // 25% size increase
    };

    this.ensureDirectories();
    this.loadConfig();
  }

  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Load bundle size configuration
   */
  loadConfig() {
    if (existsSync(this.configFile)) {
      try {
        const config = JSON.parse(readFileSync(this.configFile, 'utf8'));

        // Parse bundlesize.json format
        if (config.files) {
          config.files.forEach(file => {
            const sizeStr = file.maxSize;
            const sizeBytes = this.parseSize(sizeStr);

            if (file.path.includes('*.js')) {
              this.budgets.js = sizeBytes;
            } else if (file.path.includes('*.css')) {
              this.budgets.css = sizeBytes;
            }
          });
        }
      } catch (error) {
        console.warn('⚠️  Failed to load bundle size config:', error.message);
      }
    }
  }

  /**
   * Parse human-readable size string to bytes
   */
  parseSize(sizeStr) {
    const units = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
    };

    const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i);
    if (!match) {
      throw new Error(`Invalid size format: ${sizeStr}`);
    }

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    return Math.round(value * units[unit]);
  }

  /**
   * Format bytes in human-readable format
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
    );
  }

  /**
   * Get file hash for content comparison
   */
  getFileHash(filePath) {
    const content = readFileSync(filePath);
    return createHash('md5').update(content).digest('hex');
  }

  /**
   * Analyze bundle files in dist directory
   */
  analyzeBundleFiles() {
    if (!existsSync(this.distDir)) {
      throw new Error(`Distribution directory not found: ${this.distDir}`);
    }

    const files = this.getDistFiles();
    const analysis = {
      timestamp: new Date().toISOString(),
      git: this.getGitInfo(),
      files: {},
      totals: {
        js: 0,
        css: 0,
        other: 0,
        total: 0,
      },
      counts: {
        js: 0,
        css: 0,
        other: 0,
        total: 0,
      },
    };

    files.forEach(file => {
      const filePath = join(this.distDir, file);
      const stats = statSync(filePath);
      const ext = extname(file).toLowerCase();

      let category = 'other';
      if (['.js', '.mjs'].includes(ext)) {
        category = 'js';
      } else if (ext === '.css') {
        category = 'css';
      }

      const fileInfo = {
        path: file,
        size: stats.size,
        category,
        hash: this.getFileHash(filePath),
        modified: stats.mtime.toISOString(),
      };

      analysis.files[file] = fileInfo;
      analysis.totals[category] += stats.size;
      analysis.totals.total += stats.size;
      analysis.counts[category]++;
      analysis.counts.total++;
    });

    return analysis;
  }

  /**
   * Get all relevant files from dist directory
   */
  getDistFiles() {
    const files = [];

    const traverse = (dir, prefix = '') => {
      const items = readdirSync(join(this.distDir, prefix));

      items.forEach(item => {
        const itemPath = prefix ? join(prefix, item) : item;
        const fullPath = join(this.distDir, itemPath);
        const stats = statSync(fullPath);

        if (stats.isDirectory()) {
          traverse(dir, itemPath);
        } else {
          // Include JS, CSS, and other relevant assets
          const ext = extname(item).toLowerCase();
          if (['.js', '.css', '.mjs', '.map'].includes(ext)) {
            files.push(itemPath);
          }
        }
      });
    };

    traverse(this.distDir);
    return files.sort();
  }

  /**
   * Get current git information
   */
  getGitInfo() {
    try {
      const commit = execSync('git rev-parse HEAD', {
        encoding: 'utf8',
      }).trim();
      const branch = execSync('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf8',
      }).trim();
      const message = execSync('git log -1 --pretty=%s', {
        encoding: 'utf8',
      }).trim();

      return { commit, branch, message };
    } catch (error) {
      return { commit: 'unknown', branch: 'unknown', message: 'unknown' };
    }
  }

  /**
   * Load historical bundle data
   */
  loadHistory() {
    if (!existsSync(this.historyFile)) {
      return [];
    }

    try {
      return JSON.parse(readFileSync(this.historyFile, 'utf8'));
    } catch (error) {
      console.warn('⚠️  Failed to load bundle history:', error.message);
      return [];
    }
  }

  /**
   * Save bundle analysis to history
   */
  saveToHistory(analysis) {
    const history = this.loadHistory();
    history.push(analysis);

    // Keep only last 100 entries
    const trimmedHistory = history.slice(-100);

    writeFileSync(this.historyFile, JSON.stringify(trimmedHistory, null, 2));
  }

  /**
   * Compare current analysis with historical data
   */
  compareWithHistory(currentAnalysis, history) {
    if (history.length === 0) {
      return {
        isFirstRun: true,
        regressions: [],
        improvements: [],
      };
    }

    const baseline = this.calculateBaseline(history.slice(-5)); // Use last 5 runs
    const comparison = {
      isFirstRun: false,
      regressions: [],
      improvements: [],
      baseline,
    };

    // Compare totals
    ['js', 'css', 'total'].forEach(category => {
      const current = currentAnalysis.totals[category];
      const baselineValue = baseline.totals[category];

      if (baselineValue && current > baselineValue) {
        const increase = (current - baselineValue) / baselineValue;
        const severity = this.getSeverityLevel(increase);

        if (increase > this.regressionThresholds.warning) {
          comparison.regressions.push({
            type: 'total',
            category,
            current,
            baseline: baselineValue,
            increase,
            increasePercent: (increase * 100).toFixed(1),
            severity,
            impact: this.formatBytes(current - baselineValue),
          });
        }
      } else if (baselineValue && current < baselineValue) {
        const decrease = (baselineValue - current) / baselineValue;
        comparison.improvements.push({
          type: 'total',
          category,
          current,
          baseline: baselineValue,
          decrease,
          decreasePercent: (decrease * 100).toFixed(1),
          impact: this.formatBytes(baselineValue - current),
        });
      }
    });

    // Compare individual files
    Object.entries(currentAnalysis.files).forEach(([fileName, fileInfo]) => {
      const baselineFile = baseline.files[fileName];

      if (baselineFile && fileInfo.size > baselineFile.size) {
        const increase =
          (fileInfo.size - baselineFile.size) / baselineFile.size;

        if (increase > this.regressionThresholds.warning) {
          comparison.regressions.push({
            type: 'file',
            file: fileName,
            current: fileInfo.size,
            baseline: baselineFile.size,
            increase,
            increasePercent: (increase * 100).toFixed(1),
            severity: this.getSeverityLevel(increase),
            impact: this.formatBytes(fileInfo.size - baselineFile.size),
          });
        }
      }
    });

    return comparison;
  }

  /**
   * Calculate baseline from historical data
   */
  calculateBaseline(history) {
    if (history.length === 0) return null;

    const baseline = {
      totals: { js: 0, css: 0, other: 0, total: 0 },
      files: {},
    };

    // Calculate median values for totals
    ['js', 'css', 'other', 'total'].forEach(category => {
      const values = history
        .map(entry => entry.totals[category])
        .filter(value => value > 0)
        .sort((a, b) => a - b);

      if (values.length > 0) {
        const mid = Math.floor(values.length / 2);
        baseline.totals[category] =
          values.length % 2 === 0
            ? (values[mid - 1] + values[mid]) / 2
            : values[mid];
      }
    });

    // Calculate baseline for individual files
    const allFiles = new Set();
    history.forEach(entry => {
      Object.keys(entry.files).forEach(file => allFiles.add(file));
    });

    allFiles.forEach(fileName => {
      const fileSizes = history
        .map(entry => entry.files[fileName]?.size)
        .filter(size => size !== undefined)
        .sort((a, b) => a - b);

      if (fileSizes.length > 0) {
        const mid = Math.floor(fileSizes.length / 2);
        baseline.files[fileName] = {
          size:
            fileSizes.length % 2 === 0
              ? (fileSizes[mid - 1] + fileSizes[mid]) / 2
              : fileSizes[mid],
        };
      }
    });

    return baseline;
  }

  /**
   * Get severity level based on size increase
   */
  getSeverityLevel(increase) {
    if (increase >= this.regressionThresholds.critical) return 'critical';
    if (increase >= this.regressionThresholds.error) return 'error';
    if (increase >= this.regressionThresholds.warning) return 'warning';
    return 'info';
  }

  /**
   * Validate against size budgets
   */
  validateBudgets(analysis) {
    const violations = [];

    // Check total budgets
    Object.entries(this.budgets).forEach(([category, budget]) => {
      const actual = analysis.totals[category];

      if (actual && actual > budget) {
        violations.push({
          type: 'budget',
          category,
          actual,
          budget,
          excess: actual - budget,
          excessPercent: (((actual - budget) / budget) * 100).toFixed(1),
          severity:
            actual > budget * 1.5
              ? 'critical'
              : actual > budget * 1.2
                ? 'error'
                : 'warning',
        });
      }
    });

    return violations;
  }

  /**
   * Generate detailed report
   */
  generateReport(analysis, comparison, violations) {
    console.log('\n📦 Bundle Size Analysis Report');
    console.log('='.repeat(60));

    // Current sizes
    console.log('\n📊 Current Bundle Sizes:');
    console.log(
      `  JavaScript: ${this.formatBytes(analysis.totals.js)} (${analysis.counts.js} files)`
    );
    console.log(
      `  CSS: ${this.formatBytes(analysis.totals.css)} (${analysis.counts.css} files)`
    );
    console.log(
      `  Other: ${this.formatBytes(analysis.totals.other)} (${analysis.counts.other} files)`
    );
    console.log(
      `  Total: ${this.formatBytes(analysis.totals.total)} (${analysis.counts.total} files)`
    );

    // Budget validation
    console.log('\n🎯 Budget Validation:');
    console.log(
      `  JS Budget: ${this.formatBytes(analysis.totals.js)} / ${this.formatBytes(this.budgets.js)} ${this.getStatusIcon(analysis.totals.js, this.budgets.js)}`
    );
    console.log(
      `  CSS Budget: ${this.formatBytes(analysis.totals.css)} / ${this.formatBytes(this.budgets.css)} ${this.getStatusIcon(analysis.totals.css, this.budgets.css)}`
    );

    // Budget violations
    if (violations.length > 0) {
      console.log('\n🚨 Budget Violations:');
      violations.forEach(violation => {
        const icon =
          violation.severity === 'critical'
            ? '🔴'
            : violation.severity === 'error'
              ? '🟠'
              : '🟡';
        console.log(
          `  ${icon} ${violation.category.toUpperCase()}: ${this.formatBytes(violation.actual)} exceeds budget by ${this.formatBytes(violation.excess)} (+${violation.excessPercent}%)`
        );
      });
    }

    // Comparison with history
    if (!comparison.isFirstRun) {
      if (comparison.regressions.length > 0) {
        console.log('\n📈 Size Regressions:');
        comparison.regressions.forEach(regression => {
          const icon =
            regression.severity === 'critical'
              ? '🔴'
              : regression.severity === 'error'
                ? '🟠'
                : '🟡';
          const type =
            regression.type === 'total'
              ? regression.category.toUpperCase()
              : regression.file;
          console.log(
            `  ${icon} ${type}: +${regression.impact} (+${regression.increasePercent}%)`
          );
        });
      }

      if (comparison.improvements.length > 0) {
        console.log('\n📉 Size Improvements:');
        comparison.improvements.forEach(improvement => {
          const type =
            improvement.type === 'total'
              ? improvement.category.toUpperCase()
              : improvement.file;
          console.log(
            `  ✅ ${type}: -${improvement.impact} (-${improvement.decreasePercent}%)`
          );
        });
      }
    }

    // Largest files
    console.log('\n📋 Largest Files:');
    const sortedFiles = Object.entries(analysis.files)
      .sort(([, a], [, b]) => b.size - a.size)
      .slice(0, 10);

    sortedFiles.forEach(([fileName, fileInfo]) => {
      console.log(
        `  ${this.formatBytes(fileInfo.size).padEnd(10)} ${fileName}`
      );
    });

    // Summary
    const hasIssues =
      violations.length > 0 || comparison.regressions.length > 0;
    const criticalIssues = [...violations, ...comparison.regressions].filter(
      issue => issue.severity === 'critical'
    ).length;

    console.log('\n📋 Summary:');
    if (hasIssues) {
      console.log(`  ❌ Bundle size check failed`);
      console.log(`  🚨 ${violations.length} budget violations`);
      console.log(`  📈 ${comparison.regressions.length} size regressions`);
      if (criticalIssues > 0) {
        console.log(
          `  🔴 ${criticalIssues} critical issues requiring immediate attention`
        );
      }
    } else {
      console.log('  ✅ All bundle size checks passed');
      if (!comparison.isFirstRun) {
        console.log('  🎉 No budget violations or size regressions detected');
      }
    }

    return hasIssues;
  }

  /**
   * Get status icon for comparison
   */
  getStatusIcon(actual, budget) {
    return actual <= budget ? '✅' : '❌';
  }

  /**
   * Export results for CI/CD integration
   */
  exportResults(analysis, comparison, violations, format = 'json') {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `bundle-analysis-${timestamp}.${format}`;
    const filepath = join(this.outputDir, filename);

    const exportData = {
      timestamp: analysis.timestamp,
      git: analysis.git,
      sizes: analysis.totals,
      budgets: this.budgets,
      violations,
      regressions: comparison.regressions || [],
      improvements: comparison.improvements || [],
      summary: {
        passed:
          violations.length === 0 &&
          (comparison.regressions || []).length === 0,
        budgetViolations: violations.length,
        regressions: (comparison.regressions || []).length,
        improvements: (comparison.improvements || []).length,
      },
    };

    if (format === 'json') {
      writeFileSync(filepath, JSON.stringify(exportData, null, 2));
    } else if (format === 'junit') {
      const junit = this.generateJUnitXML(exportData);
      writeFileSync(filepath.replace('.junit', '.xml'), junit);
    }

    console.log(`📄 Results exported to: ${filepath}`);
    return filepath;
  }

  /**
   * Generate JUnit XML for CI/CD integration
   */
  generateJUnitXML(data) {
    const totalTests = Object.keys(this.budgets).length;
    const failures = data.violations.length;

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<testsuite name="Bundle Size Tests" tests="${totalTests}" failures="${failures}" time="0">\n`;

    // Test cases for each budget
    Object.entries(this.budgets).forEach(([category, budget]) => {
      const violation = data.violations.find(v => v.category === category);
      const actual = data.sizes[category] || 0;

      xml += `  <testcase name="${category}_bundle_size" classname="BundleSizeTests">\n`;

      if (violation) {
        xml += `    <failure message="Bundle size exceeds budget" type="BudgetViolation">\n`;
        xml += `      ${category.toUpperCase()} bundle size (${this.formatBytes(actual)}) exceeds budget (${this.formatBytes(budget)})\n`;
        xml += `      Excess: ${this.formatBytes(violation.excess)} (+${violation.excessPercent}%)\n`;
        xml += `      Severity: ${violation.severity}\n`;
        xml += `    </failure>\n`;
      }

      xml += '  </testcase>\n';
    });

    xml += '</testsuite>';
    return xml;
  }

  /**
   * Main analysis function
   */
  async run(options = {}) {
    try {
      console.log('📦 Starting bundle size analysis...\n');

      // Analyze current bundle
      const analysis = this.analyzeBundleFiles();

      // Load and compare with history
      const history = this.loadHistory();
      const comparison = this.compareWithHistory(analysis, history);

      // Validate budgets
      const violations = this.validateBudgets(analysis);

      // Generate report
      const hasIssues = this.generateReport(analysis, comparison, violations);

      // Save to history
      this.saveToHistory(analysis);

      // Export results if requested
      if (options.export) {
        this.exportResults(analysis, comparison, violations, options.format);
      }

      // Exit with appropriate code for CI/CD
      if (options.ci && hasIssues) {
        const criticalIssues = [
          ...violations,
          ...(comparison.regressions || []),
        ].filter(issue => issue.severity === 'critical').length;

        if (criticalIssues > 0) {
          console.log(
            '\n🔴 Critical bundle size issues detected. Failing CI build.'
          );
          process.exit(1);
        } else {
          console.log(
            '\n🟡 Bundle size warnings detected but not failing CI build.'
          );
        }
      }

      return {
        analysis,
        comparison,
        violations,
        passed: !hasIssues,
      };
    } catch (error) {
      console.error('❌ Bundle size analysis failed:', error.message);
      if (options.ci) {
        process.exit(1);
      }
      throw error;
    }
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = {
    ci: args.includes('--ci'),
    export: args.includes('--export'),
    format: args.includes('--junit') ? 'junit' : 'json',
  };

  const monitor = new BundleSizeMonitor();
  monitor.run(options).catch(error => {
    console.error('Bundle size monitoring failed:', error);
    process.exit(1);
  });
}

export default BundleSizeMonitor;
