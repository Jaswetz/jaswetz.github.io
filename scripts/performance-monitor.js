#!/usr/bin/env node

/**
 * Performance Monitor
 *
 * Automated Core Web Vitals monitoring and performance regression testing
 * Part of the Portfolio Refactoring and Optimization project
 *
 * Features:
 * - Core Web Vitals measurement (LCP, FID, CLS, FCP, TTFB)
 * - Bundle size tracking and regression detection
 * - Performance budget validation
 * - CI/CD integration support
 * - Historical performance data tracking
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

class PerformanceMonitor {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:8080';
    this.outputDir =
      options.outputDir || join(projectRoot, 'performance-reports');
    this.configFile = join(projectRoot, 'performance-budget.json');
    this.historyFile = join(this.outputDir, 'performance-history.json');

    // Performance budgets (Core Web Vitals thresholds)
    this.budgets = {
      // Core Web Vitals
      lcp: 2500, // Largest Contentful Paint (ms) - Good: < 2.5s
      fid: 100, // First Input Delay (ms) - Good: < 100ms
      cls: 0.1, // Cumulative Layout Shift - Good: < 0.1
      fcp: 1800, // First Contentful Paint (ms) - Good: < 1.8s
      ttfb: 800, // Time to First Byte (ms) - Good: < 800ms

      // Bundle size budgets
      jsBundle: 30 * 1024, // 30KB JavaScript budget
      cssBundle: 70 * 1024, // 70KB CSS budget

      // Additional metrics
      speedIndex: 3400, // Speed Index - Good: < 3.4s
      tbt: 200, // Total Blocking Time - Good: < 200ms
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
   * Load performance configuration if exists
   */
  loadConfig() {
    if (existsSync(this.configFile)) {
      try {
        const config = JSON.parse(readFileSync(this.configFile, 'utf8'));
        this.budgets = { ...this.budgets, ...config.budgets };
      } catch (error) {
        console.warn('⚠️  Failed to load performance config:', error.message);
      }
    }
  }

  /**
   * Run Lighthouse audit and extract Core Web Vitals
   */
  async runLighthouseAudit() {
    console.log('🚀 Running Lighthouse audit...');

    const timestamp = new Date().toISOString();
    const reportFile = join(
      this.outputDir,
      `lighthouse-${timestamp.replace(/:/g, '-')}.json`
    );

    try {
      // Run Lighthouse with performance-focused configuration
      const lighthouseCmd = [
        'npx lighthouse',
        `"${this.baseUrl}"`,
        '--only-categories=performance',
        '--output=json',
        `--output-path="${reportFile}"`,
        '--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"',
        '--throttling-method=simulate',
        '--form-factor=desktop',
        '--screenEmulation.disabled',
        '--quiet',
      ].join(' ');

      execSync(lighthouseCmd, { stdio: 'pipe' });

      const report = JSON.parse(readFileSync(reportFile, 'utf8'));
      return this.extractCoreWebVitals(report);
    } catch (error) {
      console.error('❌ Lighthouse audit failed:', error.message);
      throw error;
    }
  }

  /**
   * Extract Core Web Vitals from Lighthouse report
   */
  extractCoreWebVitals(report) {
    const audits = report.audits;

    return {
      timestamp: new Date().toISOString(),
      url: report.finalUrl,
      metrics: {
        // Core Web Vitals
        lcp: audits['largest-contentful-paint']?.numericValue || null,
        fid: audits['max-potential-fid']?.numericValue || null, // FID approximation
        cls: audits['cumulative-layout-shift']?.numericValue || null,

        // Additional important metrics
        fcp: audits['first-contentful-paint']?.numericValue || null,
        ttfb: audits['server-response-time']?.numericValue || null,
        speedIndex: audits['speed-index']?.numericValue || null,
        tbt: audits['total-blocking-time']?.numericValue || null,

        // Performance score
        performanceScore: report.categories.performance?.score * 100 || null,
      },
      budgetViolations: [],
    };
  }

  /**
   * Measure bundle sizes
   */
  measureBundleSizes() {
    console.log('📦 Measuring bundle sizes...');

    const distDir = join(projectRoot, 'dist');
    if (!existsSync(distDir)) {
      throw new Error('Distribution directory not found. Run build first.');
    }

    try {
      // Get JavaScript bundle size
      const jsBundles = execSync('find dist -name "*.js" -type f', {
        encoding: 'utf8',
      })
        .trim()
        .split('\n')
        .filter(Boolean);

      // Get CSS bundle size
      const cssBundles = execSync('find dist -name "*.css" -type f', {
        encoding: 'utf8',
      })
        .trim()
        .split('\n')
        .filter(Boolean);

      const jsSize = jsBundles.reduce((total, file) => {
        // Cross-platform file size detection
        const statCmd =
          process.platform === 'darwin'
            ? `stat -f%z "${file}"`
            : `stat -c%s "${file}"`;
        const stats = execSync(statCmd, { encoding: 'utf8' });
        return total + parseInt(stats.trim(), 10);
      }, 0);

      const cssSize = cssBundles.reduce((total, file) => {
        // Cross-platform file size detection
        const statCmd =
          process.platform === 'darwin'
            ? `stat -f%z "${file}"`
            : `stat -c%s "${file}"`;
        const stats = execSync(statCmd, { encoding: 'utf8' });
        return total + parseInt(stats.trim(), 10);
      }, 0);

      return {
        jsBundle: jsSize,
        cssBundle: cssSize,
        totalSize: jsSize + cssSize,
        files: {
          js: jsBundles,
          css: cssBundles,
        },
      };
    } catch (error) {
      console.error('❌ Bundle size measurement failed:', error.message);
      throw error;
    }
  }

  /**
   * Validate performance against budgets
   */
  validateBudgets(metrics, bundleSizes) {
    const violations = [];

    // Check Core Web Vitals budgets
    Object.entries(this.budgets).forEach(([metric, budget]) => {
      if (metric.includes('Bundle')) {
        // Handle bundle size budgets
        const bundleType = metric.replace('Bundle', '').toLowerCase();
        const actualSize = bundleSizes[`${bundleType}Bundle`];

        if (actualSize && actualSize > budget) {
          violations.push({
            metric,
            actual: actualSize,
            budget,
            impact: 'high',
            message: `${metric} (${this.formatBytes(actualSize)}) exceeds budget (${this.formatBytes(budget)})`,
          });
        }
      } else if (metrics[metric] !== null && metrics[metric] > budget) {
        // Handle performance metric budgets
        const impact = this.getImpactLevel(metric, metrics[metric], budget);
        violations.push({
          metric,
          actual: metrics[metric],
          budget,
          impact,
          message: `${metric.toUpperCase()} (${metrics[metric].toFixed(2)}${this.getUnit(metric)}) exceeds budget (${budget}${this.getUnit(metric)})`,
        });
      }
    });

    return violations;
  }

  /**
   * Get impact level based on how much budget is exceeded
   */
  getImpactLevel(metric, actual, budget) {
    const ratio = actual / budget;

    if (ratio > 2) return 'critical';
    if (ratio > 1.5) return 'high';
    if (ratio > 1.2) return 'medium';
    return 'low';
  }

  /**
   * Get appropriate unit for metric
   */
  getUnit(metric) {
    if (['lcp', 'fid', 'fcp', 'ttfb', 'speedIndex', 'tbt'].includes(metric)) {
      return 'ms';
    }
    if (metric === 'cls') {
      return '';
    }
    return '';
  }

  /**
   * Format bytes in human-readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Load performance history
   */
  loadHistory() {
    if (!existsSync(this.historyFile)) {
      return [];
    }

    try {
      return JSON.parse(readFileSync(this.historyFile, 'utf8'));
    } catch (error) {
      console.warn('⚠️  Failed to load performance history:', error.message);
      return [];
    }
  }

  /**
   * Save performance data to history
   */
  saveToHistory(data) {
    const history = this.loadHistory();
    history.push(data);

    // Keep only last 100 entries
    const trimmedHistory = history.slice(-100);

    writeFileSync(this.historyFile, JSON.stringify(trimmedHistory, null, 2));
  }

  /**
   * Detect performance regressions
   */
  detectRegressions(currentMetrics, history) {
    if (history.length < 2) {
      return []; // Need at least 2 data points for comparison
    }

    const regressions = [];
    const baseline = this.calculateBaseline(history.slice(-10)); // Use last 10 runs as baseline

    // Check for significant regressions (> 10% worse than baseline)
    Object.entries(currentMetrics).forEach(([metric, currentValue]) => {
      if (currentValue === null || !baseline[metric]) return;

      const baselineValue = baseline[metric];
      const regressionThreshold = baselineValue * 1.1; // 10% regression threshold

      if (currentValue > regressionThreshold) {
        const regressionPercent = (
          ((currentValue - baselineValue) / baselineValue) *
          100
        ).toFixed(1);
        regressions.push({
          metric,
          current: currentValue,
          baseline: baselineValue,
          regression: `${regressionPercent}%`,
          severity: regressionPercent > 25 ? 'high' : 'medium',
        });
      }
    });

    return regressions;
  }

  /**
   * Calculate baseline from historical data
   */
  calculateBaseline(history) {
    if (history.length === 0) return {};

    const baseline = {};
    const metrics = Object.keys(history[0].metrics || {});

    metrics.forEach(metric => {
      const values = history
        .map(entry => entry.metrics[metric])
        .filter(value => value !== null && !isNaN(value));

      if (values.length > 0) {
        // Use median as baseline to avoid outliers
        values.sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        baseline[metric] =
          values.length % 2 === 0
            ? (values[mid - 1] + values[mid]) / 2
            : values[mid];
      }
    });

    return baseline;
  }

  /**
   * Generate performance report
   */
  generateReport(data) {
    const { metrics, bundleSizes, violations, regressions } = data;

    console.log('\n📊 Performance Report');
    console.log('='.repeat(50));

    // Core Web Vitals
    console.log('\n🎯 Core Web Vitals:');
    console.log(
      `  LCP: ${metrics.lcp?.toFixed(0) || 'N/A'}ms (budget: ${this.budgets.lcp}ms) ${this.getStatusIcon(metrics.lcp, this.budgets.lcp)}`
    );
    console.log(
      `  FID: ${metrics.fid?.toFixed(0) || 'N/A'}ms (budget: ${this.budgets.fid}ms) ${this.getStatusIcon(metrics.fid, this.budgets.fid)}`
    );
    console.log(
      `  CLS: ${metrics.cls?.toFixed(3) || 'N/A'} (budget: ${this.budgets.cls}) ${this.getStatusIcon(metrics.cls, this.budgets.cls)}`
    );

    // Additional metrics
    console.log('\n📈 Additional Metrics:');
    console.log(
      `  FCP: ${metrics.fcp?.toFixed(0) || 'N/A'}ms (budget: ${this.budgets.fcp}ms) ${this.getStatusIcon(metrics.fcp, this.budgets.fcp)}`
    );
    console.log(
      `  TTFB: ${metrics.ttfb?.toFixed(0) || 'N/A'}ms (budget: ${this.budgets.ttfb}ms) ${this.getStatusIcon(metrics.ttfb, this.budgets.ttfb)}`
    );
    console.log(
      `  Speed Index: ${metrics.speedIndex?.toFixed(0) || 'N/A'}ms (budget: ${this.budgets.speedIndex}ms) ${this.getStatusIcon(metrics.speedIndex, this.budgets.speedIndex)}`
    );
    console.log(
      `  Performance Score: ${metrics.performanceScore?.toFixed(0) || 'N/A'}/100`
    );

    // Bundle sizes
    console.log('\n📦 Bundle Sizes:');
    console.log(
      `  JavaScript: ${this.formatBytes(bundleSizes.jsBundle)} (budget: ${this.formatBytes(this.budgets.jsBundle)}) ${this.getStatusIcon(bundleSizes.jsBundle, this.budgets.jsBundle)}`
    );
    console.log(
      `  CSS: ${this.formatBytes(bundleSizes.cssBundle)} (budget: ${this.formatBytes(this.budgets.cssBundle)}) ${this.getStatusIcon(bundleSizes.cssBundle, this.budgets.cssBundle)}`
    );
    console.log(`  Total: ${this.formatBytes(bundleSizes.totalSize)}`);

    // Budget violations
    if (violations.length > 0) {
      console.log('\n🚨 Budget Violations:');
      violations.forEach(violation => {
        const icon =
          violation.impact === 'critical'
            ? '🔴'
            : violation.impact === 'high'
              ? '🟠'
              : violation.impact === 'medium'
                ? '🟡'
                : '🔵';
        console.log(`  ${icon} ${violation.message}`);
      });
    }

    // Performance regressions
    if (regressions.length > 0) {
      console.log('\n📉 Performance Regressions:');
      regressions.forEach(regression => {
        const icon = regression.severity === 'high' ? '🔴' : '🟡';
        console.log(
          `  ${icon} ${regression.metric.toUpperCase()}: ${regression.regression} regression (${regression.current.toFixed(2)} vs ${regression.baseline.toFixed(2)} baseline)`
        );
      });
    }

    // Summary
    const hasIssues = violations.length > 0 || regressions.length > 0;
    const criticalIssues = violations.filter(
      v => v.impact === 'critical'
    ).length;

    console.log('\n📋 Summary:');
    if (hasIssues) {
      console.log(`  ❌ Performance check failed`);
      console.log(`  🚨 ${violations.length} budget violations`);
      console.log(`  📉 ${regressions.length} performance regressions`);
      if (criticalIssues > 0) {
        console.log(
          `  🔴 ${criticalIssues} critical issues requiring immediate attention`
        );
      }
    } else {
      console.log('  ✅ All performance checks passed');
      console.log('  🎉 No budget violations or regressions detected');
    }

    return hasIssues;
  }

  /**
   * Get status icon for metric comparison
   */
  getStatusIcon(actual, budget) {
    if (actual === null || actual === undefined) return '❓';
    return actual <= budget ? '✅' : '❌';
  }

  /**
   * Export results for CI/CD integration
   */
  exportResults(data, format = 'json') {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `performance-results-${timestamp}.${format}`;
    const filepath = join(this.outputDir, filename);

    if (format === 'json') {
      writeFileSync(filepath, JSON.stringify(data, null, 2));
    } else if (format === 'junit') {
      const junit = this.generateJUnitXML(data);
      writeFileSync(filepath.replace('.junit', '.xml'), junit);
    }

    console.log(`📄 Results exported to: ${filepath}`);
    return filepath;
  }

  /**
   * Generate JUnit XML for CI/CD integration
   */
  generateJUnitXML(data) {
    const { violations, regressions } = data;
    const totalTests = Object.keys(this.budgets).length;
    const failures = violations.length;

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<testsuite name="Performance Tests" tests="${totalTests}" failures="${failures}" time="0">\n`;

    // Add test cases for each budget
    Object.entries(this.budgets).forEach(([metric, budget]) => {
      const violation = violations.find(v => v.metric === metric);
      xml += `  <testcase name="${metric}_budget_check" classname="PerformanceBudgets">\n`;

      if (violation) {
        xml += `    <failure message="${violation.message}" type="BudgetViolation">\n`;
        xml += `      ${violation.message}\n`;
        xml += `      Actual: ${violation.actual}\n`;
        xml += `      Budget: ${violation.budget}\n`;
        xml += `      Impact: ${violation.impact}\n`;
        xml += `    </failure>\n`;
      }

      xml += '  </testcase>\n';
    });

    xml += '</testsuite>';
    return xml;
  }

  /**
   * Main monitoring function
   */
  async run(options = {}) {
    try {
      console.log('🔍 Starting performance monitoring...\n');

      // Measure Core Web Vitals
      const vitalsData = await this.runLighthouseAudit();

      // Measure bundle sizes
      const bundleSizes = this.measureBundleSizes();

      // Load historical data
      const history = this.loadHistory();

      // Validate budgets
      const violations = this.validateBudgets(vitalsData.metrics, bundleSizes);

      // Detect regressions
      const regressions = this.detectRegressions(vitalsData.metrics, history);

      // Compile full report data
      const reportData = {
        ...vitalsData,
        bundleSizes,
        violations,
        regressions,
        summary: {
          passed: violations.length === 0 && regressions.length === 0,
          totalViolations: violations.length,
          criticalViolations: violations.filter(v => v.impact === 'critical')
            .length,
          totalRegressions: regressions.length,
          highSeverityRegressions: regressions.filter(
            r => r.severity === 'high'
          ).length,
        },
      };

      // Generate and display report
      const hasIssues = this.generateReport(reportData);

      // Save to history
      this.saveToHistory(reportData);

      // Export results if requested
      if (options.export) {
        this.exportResults(reportData, options.format);
      }

      // Exit with appropriate code for CI/CD
      if (options.ci && hasIssues) {
        process.exit(1);
      }

      return reportData;
    } catch (error) {
      console.error('❌ Performance monitoring failed:', error.message);
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
    baseUrl:
      args.find(arg => arg.startsWith('--url='))?.split('=')[1] ||
      'http://localhost:8080',
  };

  const monitor = new PerformanceMonitor({ baseUrl: options.baseUrl });
  monitor.run(options).catch(error => {
    console.error('Performance monitoring failed:', error);
    process.exit(1);
  });
}

export default PerformanceMonitor;
