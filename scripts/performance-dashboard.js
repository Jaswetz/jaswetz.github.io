#!/usr/bin/env node

/**
 * Performance Dashboard
 *
 * Generate interactive HTML dashboard for performance monitoring
 * Part of the Portfolio Refactoring and Optimization project
 *
 * Features:
 * - Historical performance trends visualization
 * - Core Web Vitals tracking over time
 * - Bundle size regression analysis
 * - Performance budget compliance tracking
 * - Automated report generation
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  statSync,
} from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

class PerformanceDashboard {
  constructor(options = {}) {
    this.performanceReportsDir =
      options.performanceDir || join(projectRoot, 'performance-reports');
    this.bundleReportsDir =
      options.bundleDir || join(projectRoot, 'bundle-reports');
    this.outputFile =
      options.outputFile || join(projectRoot, 'performance-dashboard.html');

    this.budgets = {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
      fcp: 1800,
      ttfb: 800,
      jsBundle: 30720,
      cssBundle: 71680,
    };
  }

  /**
   * Load all performance history data
   */
  loadPerformanceHistory() {
    const historyFile = join(
      this.performanceReportsDir,
      'performance-history.json'
    );

    if (existsSync(historyFile)) {
      try {
        return JSON.parse(readFileSync(historyFile, 'utf8'));
      } catch (error) {
        console.warn('Failed to load performance history:', error.message);
      }
    }

    return [];
  }

  /**
   * Load all bundle size history data
   */
  loadBundleHistory() {
    const historyFile = join(this.bundleReportsDir, 'bundle-history.json');

    if (existsSync(historyFile)) {
      try {
        return JSON.parse(readFileSync(historyFile, 'utf8'));
      } catch (error) {
        console.warn('Failed to load bundle history:', error.message);
      }
    }

    return [];
  }

  /**
   * Process performance data for visualization
   */
  processPerformanceData(history) {
    if (!history || history.length === 0) return null;

    const processedData = {
      timestamps: [],
      metrics: {
        lcp: [],
        fid: [],
        cls: [],
        fcp: [],
        ttfb: [],
        performanceScore: [],
      },
      violations: [],
      regressions: [],
    };

    history.forEach(entry => {
      const timestamp = new Date(entry.timestamp).getTime();
      processedData.timestamps.push(timestamp);

      // Extract metric values
      Object.keys(processedData.metrics).forEach(metric => {
        const value =
          entry.metrics && entry.metrics[metric] !== null
            ? entry.metrics[metric]
            : null;
        processedData.metrics[metric].push(value);
      });

      // Track violations and regressions
      if (entry.violations && entry.violations.length > 0) {
        processedData.violations.push({
          timestamp,
          count: entry.violations.length,
          critical: entry.violations.filter(v => v.impact === 'critical')
            .length,
        });
      }

      if (entry.regressions && entry.regressions.length > 0) {
        processedData.regressions.push({
          timestamp,
          count: entry.regressions.length,
          high: entry.regressions.filter(r => r.severity === 'high').length,
        });
      }
    });

    return processedData;
  }

  /**
   * Process bundle size data for visualization
   */
  processBundleData(history) {
    if (!history || history.length === 0) return null;

    const processedData = {
      timestamps: [],
      sizes: {
        js: [],
        css: [],
        total: [],
      },
      violations: [],
    };

    history.forEach(entry => {
      const timestamp = new Date(entry.timestamp).getTime();
      processedData.timestamps.push(timestamp);

      // Extract size values
      Object.keys(processedData.sizes).forEach(type => {
        const size =
          entry.totals && entry.totals[type] ? entry.totals[type] : 0;
        processedData.sizes[type].push(size);
      });
    });

    return processedData;
  }

  /**
   * Calculate performance statistics
   */
  calculateStats(performanceData, bundleData) {
    const stats = {
      performance: {
        averages: {},
        trends: {},
        budgetCompliance: {},
      },
      bundle: {
        averages: {},
        trends: {},
        budgetCompliance: {},
      },
      overall: {
        totalRuns: 0,
        passedRuns: 0,
        passRate: 0,
      },
    };

    // Performance statistics
    if (performanceData) {
      Object.entries(performanceData.metrics).forEach(([metric, values]) => {
        const validValues = values.filter(v => v !== null && !isNaN(v));
        if (validValues.length > 0) {
          stats.performance.averages[metric] =
            validValues.reduce((a, b) => a + b) / validValues.length;

          // Calculate trend (last 10 vs previous 10)
          if (validValues.length >= 20) {
            const recent = validValues.slice(-10);
            const previous = validValues.slice(-20, -10);
            const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
            const previousAvg =
              previous.reduce((a, b) => a + b) / previous.length;
            const trend = ((recentAvg - previousAvg) / previousAvg) * 100;
            stats.performance.trends[metric] = trend;
          }

          // Budget compliance
          if (this.budgets[metric]) {
            const compliantRuns = validValues.filter(
              v => v <= this.budgets[metric]
            ).length;
            stats.performance.budgetCompliance[metric] =
              (compliantRuns / validValues.length) * 100;
          }
        }
      });
    }

    // Bundle statistics
    if (bundleData) {
      Object.entries(bundleData.sizes).forEach(([type, values]) => {
        const validValues = values.filter(v => v > 0);
        if (validValues.length > 0) {
          stats.bundle.averages[type] =
            validValues.reduce((a, b) => a + b) / validValues.length;

          // Calculate trend
          if (validValues.length >= 20) {
            const recent = validValues.slice(-10);
            const previous = validValues.slice(-20, -10);
            const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
            const previousAvg =
              previous.reduce((a, b) => a + b) / previous.length;
            const trend = ((recentAvg - previousAvg) / previousAvg) * 100;
            stats.bundle.trends[type] = trend;
          }

          // Budget compliance
          if (this.budgets[`${type}Bundle`]) {
            const compliantRuns = validValues.filter(
              v => v <= this.budgets[`${type}Bundle`]
            ).length;
            stats.bundle.budgetCompliance[type] =
              (compliantRuns / validValues.length) * 100;
          }
        }
      });
    }

    return stats;
  }

  /**
   * Generate Chart.js configuration
   */
  generateChartConfig(performanceData, bundleData) {
    const charts = {};

    // Core Web Vitals Chart
    if (performanceData) {
      charts.coreWebVitals = {
        type: 'line',
        data: {
          labels: performanceData.timestamps.map(ts =>
            new Date(ts).toLocaleDateString()
          ),
          datasets: [
            {
              label: 'LCP (ms)',
              data: performanceData.metrics.lcp,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              yAxisID: 'y',
            },
            {
              label: 'FID (ms)',
              data: performanceData.metrics.fid,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
              yAxisID: 'y',
            },
            {
              label: 'CLS',
              data: performanceData.metrics.cls.map(v => (v ? v * 1000 : null)), // Scale for visibility
              borderColor: 'rgb(255, 205, 86)',
              backgroundColor: 'rgba(255, 205, 86, 0.1)',
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: { display: true, text: 'Time (ms)' },
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: { display: true, text: 'CLS (×1000)' },
              grid: { drawOnChartArea: false },
            },
          },
          plugins: {
            title: { display: true, text: 'Core Web Vitals Trends' },
          },
        },
      };

      // Performance Score Chart
      charts.performanceScore = {
        type: 'line',
        data: {
          labels: performanceData.timestamps.map(ts =>
            new Date(ts).toLocaleDateString()
          ),
          datasets: [
            {
              label: 'Performance Score',
              data: performanceData.metrics.performanceScore,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              min: 0,
              max: 100,
              title: { display: true, text: 'Score' },
            },
          },
          plugins: {
            title: { display: true, text: 'Performance Score Over Time' },
          },
        },
      };
    }

    // Bundle Size Chart
    if (bundleData) {
      charts.bundleSize = {
        type: 'line',
        data: {
          labels: bundleData.timestamps.map(ts =>
            new Date(ts).toLocaleDateString()
          ),
          datasets: [
            {
              label: 'JavaScript (KB)',
              data: bundleData.sizes.js.map(size => size / 1024),
              borderColor: 'rgb(255, 159, 64)',
              backgroundColor: 'rgba(255, 159, 64, 0.1)',
            },
            {
              label: 'CSS (KB)',
              data: bundleData.sizes.css.map(size => size / 1024),
              borderColor: 'rgb(153, 102, 255)',
              backgroundColor: 'rgba(153, 102, 255, 0.1)',
            },
            {
              label: 'Total (KB)',
              data: bundleData.sizes.total.map(size => size / 1024),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              title: { display: true, text: 'Size (KB)' },
            },
          },
          plugins: {
            title: { display: true, text: 'Bundle Size Trends' },
          },
        },
      };
    }

    return charts;
  }

  /**
   * Generate HTML dashboard
   */
  generateDashboard(performanceData, bundleData, stats, charts) {
    const lastUpdate = new Date().toLocaleString();
    const hasData = performanceData || bundleData;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Dashboard - Jason Swetzoff Portfolio</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .dashboard {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 2.5rem;
        }

        .header p {
            color: #718096;
            font-size: 1.1rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .stat-card h3 {
            color: #2d3748;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }

        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }

        .metric:last-child {
            border-bottom: none;
        }

        .metric-name {
            font-weight: 500;
        }

        .metric-value {
            font-weight: 600;
        }

        .metric-value.good {
            color: #38a169;
        }

        .metric-value.warning {
            color: #d69e2e;
        }

        .metric-value.poor {
            color: #e53e3e;
        }

        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }

        .chart-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .chart-container {
            position: relative;
            height: 400px;
        }

        .no-data {
            text-align: center;
            color: #718096;
            padding: 60px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .no-data h2 {
            margin-bottom: 15px;
            color: #4a5568;
        }

        .update-info {
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 30px;
            font-size: 0.9rem;
        }

        .trend {
            font-size: 0.9rem;
            margin-left: 10px;
        }

        .trend.up {
            color: #e53e3e;
        }

        .trend.down {
            color: #38a169;
        }

        .budget-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 5px;
        }

        .budget-fill {
            height: 100%;
            transition: width 0.3s ease;
        }

        .budget-fill.good {
            background: #38a169;
        }

        .budget-fill.warning {
            background: #d69e2e;
        }

        .budget-fill.poor {
            background: #e53e3e;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🚀 Performance Dashboard</h1>
            <p>Real-time monitoring of Core Web Vitals and bundle size metrics for Jason Swetzoff's UX Portfolio</p>
        </div>

        ${hasData ? this.generateStatsSection(stats) : ''}
        ${hasData ? this.generateChartsSection(charts) : this.generateNoDataSection()}

        <div class="update-info">
            Last updated: ${lastUpdate}
        </div>
    </div>

    ${hasData ? this.generateChartScripts(charts) : ''}
</body>
</html>`;
  }

  /**
   * Generate statistics section
   */
  generateStatsSection(stats) {
    return `
        <div class="stats-grid">
            ${this.generatePerformanceStats(stats.performance)}
            ${this.generateBundleStats(stats.bundle)}
            ${this.generateOverallStats(stats.overall)}
        </div>
    `;
  }

  /**
   * Generate performance statistics card
   */
  generatePerformanceStats(perfStats) {
    if (!perfStats || !perfStats.averages) return '';

    const metrics = [
      {
        key: 'lcp',
        name: 'LCP (Largest Contentful Paint)',
        unit: 'ms',
        budget: this.budgets.lcp,
      },
      {
        key: 'fid',
        name: 'FID (First Input Delay)',
        unit: 'ms',
        budget: this.budgets.fid,
      },
      {
        key: 'cls',
        name: 'CLS (Cumulative Layout Shift)',
        unit: '',
        budget: this.budgets.cls,
      },
      {
        key: 'performanceScore',
        name: 'Performance Score',
        unit: '',
        budget: 90,
      },
    ];

    const metricsHtml = metrics
      .map(metric => {
        const value = perfStats.averages[metric.key];
        if (value === undefined) return '';

        const trend = perfStats.trends && perfStats.trends[metric.key];
        const compliance =
          perfStats.budgetCompliance && perfStats.budgetCompliance[metric.key];

        const displayValue =
          metric.key === 'cls'
            ? value.toFixed(3)
            : metric.key === 'performanceScore'
              ? value.toFixed(0)
              : Math.round(value);

        const status =
          value <= metric.budget
            ? 'good'
            : value <= metric.budget * 1.2
              ? 'warning'
              : 'poor';
        const trendClass = trend > 0 ? 'up' : 'down';
        const trendIcon = trend > 0 ? '↗' : '↘';

        return `
        <div class="metric">
            <span class="metric-name">${metric.name}</span>
            <div>
                <span class="metric-value ${status}">${displayValue}${metric.unit}</span>
                ${trend !== undefined ? `<span class="trend ${trendClass}">${trendIcon} ${Math.abs(trend).toFixed(1)}%</span>` : ''}
            </div>
        </div>
        ${
          compliance !== undefined
            ? `
        <div class="budget-bar">
            <div class="budget-fill ${compliance >= 90 ? 'good' : compliance >= 70 ? 'warning' : 'poor'}"
                 style="width: ${Math.min(compliance, 100)}%"></div>
        </div>
        `
            : ''
        }
      `;
      })
      .join('');

    return `
        <div class="stat-card">
            <h3>🎯 Core Web Vitals</h3>
            ${metricsHtml}
        </div>
    `;
  }

  /**
   * Generate bundle size statistics card
   */
  generateBundleStats(bundleStats) {
    if (!bundleStats || !bundleStats.averages) return '';

    const bundles = [
      { key: 'js', name: 'JavaScript Bundle', budget: this.budgets.jsBundle },
      { key: 'css', name: 'CSS Bundle', budget: this.budgets.cssBundle },
      {
        key: 'total',
        name: 'Total Bundle Size',
        budget: this.budgets.jsBundle + this.budgets.cssBundle,
      },
    ];

    const bundlesHtml = bundles
      .map(bundle => {
        const value = bundleStats.averages[bundle.key];
        if (value === undefined) return '';

        const trend = bundleStats.trends && bundleStats.trends[bundle.key];
        const compliance =
          bundleStats.budgetCompliance &&
          bundleStats.budgetCompliance[bundle.key];

        const displayValue = this.formatBytes(value);
        const budgetValue = this.formatBytes(bundle.budget);

        const status =
          value <= bundle.budget
            ? 'good'
            : value <= bundle.budget * 1.2
              ? 'warning'
              : 'poor';
        const trendClass = trend > 0 ? 'up' : 'down';
        const trendIcon = trend > 0 ? '↗' : '↘';

        return `
        <div class="metric">
            <span class="metric-name">${bundle.name}</span>
            <div>
                <span class="metric-value ${status}">${displayValue}</span>
                ${trend !== undefined ? `<span class="trend ${trendClass}">${trendIcon} ${Math.abs(trend).toFixed(1)}%</span>` : ''}
            </div>
        </div>
        <div style="font-size: 0.85rem; color: #718096;">Budget: ${budgetValue}</div>
        ${
          compliance !== undefined
            ? `
        <div class="budget-bar">
            <div class="budget-fill ${compliance >= 90 ? 'good' : compliance >= 70 ? 'warning' : 'poor'}"
                 style="width: ${Math.min(compliance, 100)}%"></div>
        </div>
        `
            : ''
        }
      `;
      })
      .join('');

    return `
        <div class="stat-card">
            <h3>📦 Bundle Size Analysis</h3>
            ${bundlesHtml}
        </div>
    `;
  }

  /**
   * Generate overall statistics card
   */
  generateOverallStats(overallStats) {
    return `
        <div class="stat-card">
            <h3>📊 Overall Performance</h3>
            <div class="metric">
                <span class="metric-name">Total Monitoring Runs</span>
                <span class="metric-value">${overallStats.totalRuns || 0}</span>
            </div>
            <div class="metric">
                <span class="metric-name">Passed Runs</span>
                <span class="metric-value ${overallStats.passRate >= 80 ? 'good' : overallStats.passRate >= 60 ? 'warning' : 'poor'}">
                    ${overallStats.passedRuns || 0} (${(overallStats.passRate || 0).toFixed(1)}%)
                </span>
            </div>
            <div class="metric">
                <span class="metric-name">Monitoring Status</span>
                <span class="metric-value ${overallStats.passRate >= 80 ? 'good' : 'warning'}">
                    ${overallStats.passRate >= 80 ? '✅ Healthy' : '⚠️ Needs Attention'}
                </span>
            </div>
        </div>
    `;
  }

  /**
   * Generate charts section
   */
  generateChartsSection(charts) {
    const chartCards = Object.entries(charts)
      .map(
        ([chartId, config]) => `
        <div class="chart-card">
            <div class="chart-container">
                <canvas id="${chartId}"></canvas>
            </div>
        </div>
    `
      )
      .join('');

    return `<div class="charts-grid">${chartCards}</div>`;
  }

  /**
   * Generate no data section
   */
  generateNoDataSection() {
    return `
        <div class="no-data">
            <h2>📊 No Performance Data Available</h2>
            <p>Run performance monitoring to start collecting data:</p>
            <br>
            <code>npm run monitor:performance</code>
            <br><br>
            <p>Or view CI/CD performance reports in GitHub Actions workflows.</p>
        </div>
    `;
  }

  /**
   * Generate Chart.js initialization scripts
   */
  generateChartScripts(charts) {
    const scripts = Object.entries(charts)
      .map(
        ([chartId, config]) => `
        new Chart(document.getElementById('${chartId}'), ${JSON.stringify(config, null, 2)});
    `
      )
      .join('\n');

    return `
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                ${scripts}
            });
        </script>
    `;
  }

  /**
   * Format bytes in human-readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Generate the dashboard
   */
  async generate() {
    console.log('📊 Generating performance dashboard...\n');

    try {
      // Load historical data
      const performanceHistory = this.loadPerformanceHistory();
      const bundleHistory = this.loadBundleHistory();

      console.log(`Loaded ${performanceHistory.length} performance records`);
      console.log(`Loaded ${bundleHistory.length} bundle size records`);

      // Process data for visualization
      const performanceData = this.processPerformanceData(performanceHistory);
      const bundleData = this.processBundleData(bundleHistory);

      // Calculate statistics
      const stats = this.calculateStats(performanceData, bundleData);

      // Generate chart configurations
      const charts = this.generateChartConfig(performanceData, bundleData);

      // Generate HTML dashboard
      const html = this.generateDashboard(
        performanceData,
        bundleData,
        stats,
        charts
      );

      // Write dashboard file
      writeFileSync(this.outputFile, html);

      console.log(`✅ Performance dashboard generated: ${this.outputFile}`);
      console.log(
        `🌐 Open the dashboard in your browser to view performance trends`
      );

      return {
        outputFile: this.outputFile,
        dataPoints: {
          performance: performanceHistory.length,
          bundle: bundleHistory.length,
        },
        stats,
      };
    } catch (error) {
      console.error('❌ Failed to generate dashboard:', error.message);
      throw error;
    }
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const dashboard = new PerformanceDashboard();
  dashboard.generate().catch(error => {
    console.error('Dashboard generation failed:', error);
    process.exit(1);
  });
}

export default PerformanceDashboard;
