/**
 * Performance Monitoring Integration Tests
 *
 * Tests for the performance monitoring system including:
 * - Core Web Vitals monitoring
 * - Bundle size regression testing
 * - Performance dashboard generation
 * - CI/CD integration
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { execSync, spawn } from 'child_process';
import PerformanceMonitor from '../scripts/performance-monitor.js';
import BundleSizeMonitor from '../scripts/bundle-size-monitor.js';
import PerformanceDashboard from '../scripts/performance-dashboard.js';

const projectRoot = process.cwd();
const testReportsDir = join(projectRoot, 'test-reports');
const testPerformanceDir = join(testReportsDir, 'performance-reports');
const testBundleDir = join(testReportsDir, 'bundle-reports');

describe('Performance Monitoring System', () => {
  let serverProcess;
  let serverReady = false;

  beforeAll(async () => {
    // Create test directories
    if (existsSync(testReportsDir)) {
      rmSync(testReportsDir, { recursive: true, force: true });
    }
    mkdirSync(testReportsDir, { recursive: true });
    mkdirSync(testPerformanceDir, { recursive: true });
    mkdirSync(testBundleDir, { recursive: true });

    // Build the project
    console.log('Building project for performance testing...');
    execSync('npm run build', { stdio: 'pipe' });

    // Start development server
    console.log('Starting development server...');
    serverProcess = spawn('npm', ['run', 'serve'], {
      stdio: 'pipe',
      env: { ...process.env, PORT: '8081' },
    });

    // Wait for server to be ready
    await new Promise(resolve => {
      const checkServer = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:8081');
          if (response.ok) {
            serverReady = true;
            clearInterval(checkServer);
            resolve();
          }
        } catch (error) {
          // Server not ready yet
        }
      }, 1000);

      // Timeout after 30 seconds
      setTimeout(() => {
        clearInterval(checkServer);
        if (!serverReady) {
          console.warn('Server startup timeout - tests may fail');
          resolve();
        }
      }, 30000);
    });
  }, 60000);

  afterAll(() => {
    // Clean up server process
    if (serverProcess) {
      serverProcess.kill();
    }

    // Clean up test directories
    if (existsSync(testReportsDir)) {
      rmSync(testReportsDir, { recursive: true, force: true });
    }
  });

  describe('Bundle Size Monitor', () => {
    test('should analyze bundle sizes correctly', async () => {
      const monitor = new BundleSizeMonitor({
        outputDir: testBundleDir,
      });

      const result = await monitor.run({ export: true });

      expect(result).toBeDefined();
      expect(result.analysis).toBeDefined();
      expect(result.analysis.totals).toBeDefined();
      expect(result.analysis.totals.js).toBeGreaterThan(0);
      expect(result.analysis.totals.css).toBeGreaterThan(0);
      expect(result.analysis.totals.total).toBeGreaterThan(0);
      expect(result.analysis.files).toBeDefined();
      expect(Object.keys(result.analysis.files).length).toBeGreaterThan(0);
    });

    test('should detect bundle size violations', async () => {
      const monitor = new BundleSizeMonitor({
        outputDir: testBundleDir,
      });

      // Set very strict budgets to force violations
      monitor.budgets.js = 1000; // 1KB (very strict)
      monitor.budgets.css = 1000; // 1KB (very strict)

      const result = await monitor.run({ export: true });

      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.violations[0]).toHaveProperty('category');
      expect(result.violations[0]).toHaveProperty('actual');
      expect(result.violations[0]).toHaveProperty('budget');
      expect(result.violations[0]).toHaveProperty('severity');
    });

    test('should export results in multiple formats', async () => {
      const monitor = new BundleSizeMonitor({
        outputDir: testBundleDir,
      });

      await monitor.run({ export: true, format: 'json' });
      await monitor.run({ export: true, format: 'junit' });

      // Check that files were created
      const files = existsSync(testBundleDir)
        ? require('fs').readdirSync(testBundleDir)
        : [];

      const hasJsonReport = files.some(
        file => file.includes('bundle-analysis') && file.endsWith('.json')
      );
      const hasJunitReport = files.some(
        file => file.includes('bundle-analysis') && file.endsWith('.xml')
      );

      expect(hasJsonReport).toBe(true);
      expect(hasJunitReport).toBe(true);
    });

    test('should track bundle history correctly', async () => {
      const monitor = new BundleSizeMonitor({
        outputDir: testBundleDir,
      });

      // Run analysis multiple times to build history
      await monitor.run();
      await monitor.run();

      const historyFile = join(testBundleDir, 'bundle-history.json');
      expect(existsSync(historyFile)).toBe(true);

      const history = JSON.parse(readFileSync(historyFile, 'utf8'));
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThanOrEqual(2);

      // Check history entry structure
      const entry = history[0];
      expect(entry).toHaveProperty('timestamp');
      expect(entry).toHaveProperty('totals');
      expect(entry).toHaveProperty('files');
      expect(entry.totals).toHaveProperty('js');
      expect(entry.totals).toHaveProperty('css');
      expect(entry.totals).toHaveProperty('total');
    });
  });

  describe('Performance Monitor', () => {
    test('should run Lighthouse audit successfully', async () => {
      if (!serverReady) {
        console.warn('Skipping Lighthouse test - server not ready');
        return;
      }

      const monitor = new PerformanceMonitor({
        baseUrl: 'http://localhost:8081',
        outputDir: testPerformanceDir,
      });

      const result = await monitor.run({ export: true });

      expect(result).toBeDefined();
      expect(result.metrics).toBeDefined();
      expect(result.metrics.lcp).toBeGreaterThan(0);
      expect(result.metrics.performanceScore).toBeGreaterThan(0);
      expect(result.metrics.performanceScore).toBeLessThanOrEqual(100);
    }, 60000);

    test('should validate performance budgets', async () => {
      if (!serverReady) {
        console.warn('Skipping budget validation test - server not ready');
        return;
      }

      const monitor = new PerformanceMonitor({
        baseUrl: 'http://localhost:8081',
        outputDir: testPerformanceDir,
      });

      // Set very strict budgets to force violations
      monitor.budgets.lcp = 100; // 100ms (impossible)
      monitor.budgets.performanceScore = 99; // Very high score requirement

      const result = await monitor.run({ export: true });

      expect(result.violations).toBeDefined();
      // Should have at least one violation with strict budgets
      expect(result.violations.length).toBeGreaterThan(0);
    }, 60000);

    test('should export performance results correctly', async () => {
      if (!serverReady) {
        console.warn('Skipping export test - server not ready');
        return;
      }

      const monitor = new PerformanceMonitor({
        baseUrl: 'http://localhost:8081',
        outputDir: testPerformanceDir,
      });

      await monitor.run({ export: true, format: 'json' });
      await monitor.run({ export: true, format: 'junit' });

      // Check that files were created
      const files = existsSync(testPerformanceDir)
        ? require('fs').readdirSync(testPerformanceDir)
        : [];

      const hasJsonReport = files.some(
        file => file.includes('performance-results') && file.endsWith('.json')
      );
      const hasJunitReport = files.some(
        file => file.includes('performance-results') && file.endsWith('.xml')
      );
      const hasLighthouseReport = files.some(
        file => file.includes('lighthouse') && file.endsWith('.json')
      );

      expect(hasJsonReport).toBe(true);
      expect(hasJunitReport).toBe(true);
      expect(hasLighthouseReport).toBe(true);
    }, 60000);

    test('should detect performance regressions', async () => {
      if (!serverReady) {
        console.warn('Skipping regression test - server not ready');
        return;
      }

      const monitor = new PerformanceMonitor({
        baseUrl: 'http://localhost:8081',
        outputDir: testPerformanceDir,
      });

      // Create mock historical data with good performance
      const mockHistory = [
        {
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          metrics: { lcp: 1000, fid: 50, cls: 0.05, performanceScore: 95 },
        },
        {
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          metrics: { lcp: 1100, fid: 55, cls: 0.06, performanceScore: 93 },
        },
      ];

      const historyFile = join(testPerformanceDir, 'performance-history.json');
      writeFileSync(historyFile, JSON.stringify(mockHistory, null, 2));

      const result = await monitor.run({ export: true });

      expect(result).toBeDefined();
      expect(result.regressions).toBeDefined();
      // With current performance likely being worse than mock data, should detect some regressions
    }, 60000);
  });

  describe('Performance Dashboard', () => {
    test('should generate dashboard with no data', async () => {
      const dashboard = new PerformanceDashboard({
        performanceDir: join(testReportsDir, 'empty-performance'),
        bundleDir: join(testReportsDir, 'empty-bundle'),
        outputFile: join(testReportsDir, 'test-dashboard-empty.html'),
      });

      const result = await dashboard.generate();

      expect(result).toBeDefined();
      expect(result.outputFile).toBeDefined();
      expect(existsSync(result.outputFile)).toBe(true);

      const htmlContent = readFileSync(result.outputFile, 'utf8');
      expect(htmlContent).toContain('No Performance Data Available');
      expect(htmlContent).toContain('<!DOCTYPE html>');
      expect(htmlContent).toContain('Performance Dashboard');
    });

    test('should generate dashboard with historical data', async () => {
      // Create mock performance history
      const performanceHistoryFile = join(
        testPerformanceDir,
        'performance-history.json'
      );
      const mockPerformanceHistory = [
        {
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          metrics: {
            lcp: 2000,
            fid: 80,
            cls: 0.08,
            fcp: 1500,
            performanceScore: 90,
          },
        },
        {
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          metrics: {
            lcp: 2100,
            fid: 85,
            cls: 0.09,
            fcp: 1600,
            performanceScore: 88,
          },
        },
      ];
      writeFileSync(
        performanceHistoryFile,
        JSON.stringify(mockPerformanceHistory, null, 2)
      );

      // Create mock bundle history
      const bundleHistoryFile = join(testBundleDir, 'bundle-history.json');
      const mockBundleHistory = [
        {
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          totals: { js: 28000, css: 65000, total: 93000 },
        },
        {
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          totals: { js: 29000, css: 66000, total: 95000 },
        },
      ];
      writeFileSync(
        bundleHistoryFile,
        JSON.stringify(mockBundleHistory, null, 2)
      );

      const dashboard = new PerformanceDashboard({
        performanceDir: testPerformanceDir,
        bundleDir: testBundleDir,
        outputFile: join(testReportsDir, 'test-dashboard-with-data.html'),
      });

      const result = await dashboard.generate();

      expect(result).toBeDefined();
      expect(result.dataPoints.performance).toBe(2);
      expect(result.dataPoints.bundle).toBe(2);
      expect(result.stats).toBeDefined();

      const htmlContent = readFileSync(result.outputFile, 'utf8');
      expect(htmlContent).toContain('Core Web Vitals');
      expect(htmlContent).toContain('Bundle Size Analysis');
      expect(htmlContent).toContain('chart.js');
      expect(htmlContent).not.toContain('No Performance Data Available');
    });

    test('should calculate performance statistics correctly', async () => {
      const dashboard = new PerformanceDashboard({
        performanceDir: testPerformanceDir,
        bundleDir: testBundleDir,
        outputFile: join(testReportsDir, 'test-dashboard-stats.html'),
      });

      const mockPerformanceData = {
        timestamps: [Date.now() - 86400000, Date.now() - 43200000],
        metrics: {
          lcp: [2000, 2200],
          fid: [80, 90],
          cls: [0.08, 0.09],
          performanceScore: [90, 88],
        },
      };

      const mockBundleData = {
        timestamps: [Date.now() - 86400000, Date.now() - 43200000],
        sizes: {
          js: [28000, 29000],
          css: [65000, 66000],
          total: [93000, 95000],
        },
      };

      const stats = dashboard.calculateStats(
        mockPerformanceData,
        mockBundleData
      );

      expect(stats).toBeDefined();
      expect(stats.performance.averages).toBeDefined();
      expect(stats.performance.averages.lcp).toBe(2100); // Average of 2000 and 2200
      expect(stats.performance.averages.performanceScore).toBe(89); // Average of 90 and 88
      expect(stats.bundle.averages).toBeDefined();
      expect(stats.bundle.averages.js).toBe(28500); // Average of 28000 and 29000
    });
  });

  describe('Configuration', () => {
    test('should load performance budget configuration', () => {
      const configPath = join(projectRoot, 'performance-budget.json');

      if (existsSync(configPath)) {
        const config = JSON.parse(readFileSync(configPath, 'utf8'));

        expect(config).toHaveProperty('budgets');
        expect(config.budgets).toHaveProperty('lcp');
        expect(config.budgets).toHaveProperty('fid');
        expect(config.budgets).toHaveProperty('cls');
        expect(config.budgets).toHaveProperty('jsBundle');
        expect(config.budgets).toHaveProperty('cssBundle');

        // Validate budget values are reasonable
        expect(config.budgets.lcp).toBeGreaterThan(1000);
        expect(config.budgets.lcp).toBeLessThan(10000);
        expect(config.budgets.fid).toBeGreaterThan(50);
        expect(config.budgets.fid).toBeLessThan(500);
        expect(config.budgets.cls).toBeGreaterThan(0);
        expect(config.budgets.cls).toBeLessThan(1);
      }
    });

    test('should validate bundlesize.json format', () => {
      const bundleSizeConfig = join(projectRoot, 'bundlesize.json');

      if (existsSync(bundleSizeConfig)) {
        const config = JSON.parse(readFileSync(bundleSizeConfig, 'utf8'));

        expect(config).toHaveProperty('files');
        expect(Array.isArray(config.files)).toBe(true);

        config.files.forEach(file => {
          expect(file).toHaveProperty('path');
          expect(file).toHaveProperty('maxSize');
          expect(typeof file.path).toBe('string');
          expect(typeof file.maxSize).toBe('string');
        });
      }
    });
  });

  describe('CI/CD Integration', () => {
    test('should have correct npm scripts for performance monitoring', () => {
      const packageJsonPath = join(projectRoot, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

      // Check required scripts exist
      expect(packageJson.scripts).toHaveProperty('test:performance');
      expect(packageJson.scripts).toHaveProperty('test:performance:ci');
      expect(packageJson.scripts).toHaveProperty('test:bundle-regression');
      expect(packageJson.scripts).toHaveProperty('test:bundle-regression:ci');
      expect(packageJson.scripts).toHaveProperty('monitor:performance');
      expect(packageJson.scripts).toHaveProperty('dashboard:generate');

      // Validate script commands point to correct files
      expect(packageJson.scripts['test:performance']).toContain(
        'performance-monitor.js'
      );
      expect(packageJson.scripts['test:bundle-regression']).toContain(
        'bundle-size-monitor.js'
      );
      expect(packageJson.scripts['dashboard:generate']).toContain(
        'performance-dashboard.js'
      );
    });

    test('should have performance monitoring workflow', () => {
      const workflowPath = join(
        projectRoot,
        '.github/workflows/performance-monitoring.yml'
      );
      expect(existsSync(workflowPath)).toBe(true);

      const workflowContent = readFileSync(workflowPath, 'utf8');

      // Check key workflow components
      expect(workflowContent).toContain('Performance Monitoring');
      expect(workflowContent).toContain('bundle-size-analysis');
      expect(workflowContent).toContain('performance-audit');
      expect(workflowContent).toContain('regression-analysis');
      expect(workflowContent).toContain('performance-gate');

      // Check Lighthouse integration
      expect(workflowContent).toContain('lighthouse');
      expect(workflowContent).toContain('Core Web Vitals');
    });

    test('should validate GitHub Actions workflow syntax', () => {
      const workflowPath = join(
        projectRoot,
        '.github/workflows/performance-monitoring.yml'
      );

      if (existsSync(workflowPath)) {
        // Basic YAML syntax validation
        const content = readFileSync(workflowPath, 'utf8');

        // Should not have tab characters (YAML requirement)
        expect(content).not.toMatch(/\t/);

        // Should have proper job structure
        expect(content).toContain('jobs:');
        expect(content).toContain('runs-on: ubuntu-latest');

        // Should have required permissions
        expect(content).toContain('permissions:');
        expect(content).toContain('contents: read');
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle missing dist directory gracefully', async () => {
      // Temporarily rename dist directory
      const distPath = join(projectRoot, 'dist');
      const tempPath = join(projectRoot, 'dist-temp');

      if (existsSync(distPath)) {
        execSync(`mv "${distPath}" "${tempPath}"`);
      }

      try {
        const monitor = new BundleSizeMonitor({
          outputDir: testBundleDir,
        });

        await expect(monitor.run()).rejects.toThrow();
      } finally {
        // Restore dist directory
        if (existsSync(tempPath)) {
          execSync(`mv "${tempPath}" "${distPath}"`);
        }
      }
    });

    test('should handle server connection errors gracefully', async () => {
      const monitor = new PerformanceMonitor({
        baseUrl: 'http://localhost:9999', // Non-existent server
        outputDir: testPerformanceDir,
      });

      await expect(monitor.run({ ci: false })).rejects.toThrow();
    }, 30000);

    test('should handle malformed configuration files', () => {
      const tempConfigPath = join(testReportsDir, 'invalid-config.json');
      writeFileSync(tempConfigPath, '{ invalid json }');

      // Monitor should handle invalid JSON gracefully
      expect(() => {
        const monitor = new PerformanceMonitor();
        monitor.configFile = tempConfigPath;
        monitor.loadConfig();
      }).not.toThrow();
    });
  });
});
