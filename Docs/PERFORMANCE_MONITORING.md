# Performance Monitoring & Regression Testing

This document describes the comprehensive performance monitoring system implemented for the Jason Swetzoff UX Portfolio, including Core Web Vitals monitoring, bundle size regression testing, and CI/CD performance gates.

## Overview

The performance monitoring system provides:

- **Automated Core Web Vitals monitoring** with Lighthouse integration
- **Bundle size regression testing** with historical tracking
- **Performance CI/CD gates** that prevent regressions from being deployed
- **Interactive performance dashboard** with trend visualization
- **Configurable performance budgets** and alerting thresholds

## Architecture

```
Performance Monitoring System
├── Core Web Vitals Monitor (scripts/performance-monitor.js)
│   ├── Lighthouse integration
│   ├── Real User Metrics collection
│   ├── Budget validation
│   └── Regression detection
├── Bundle Size Monitor (scripts/bundle-size-monitor.js)
│   ├── File size tracking
│   ├── Historical comparison
│   ├── Budget enforcement
│   └── Trend analysis
├── Performance Dashboard (scripts/performance-dashboard.js)
│   ├── Historical data visualization
│   ├── Trend analysis charts
│   ├── Budget compliance tracking
│   └── Interactive HTML reports
└── CI/CD Integration (.github/workflows/performance-monitoring.yml)
    ├── Automated testing on PRs
    ├── Performance gate enforcement
    ├── Results reporting
    └── Artifact preservation
```

## Performance Budgets

### Core Web Vitals Thresholds

| Metric   | Budget | Description                                          |
| -------- | ------ | ---------------------------------------------------- |
| **LCP**  | 2.5s   | Largest Contentful Paint - largest element load time |
| **FID**  | 100ms  | First Input Delay - time to interactive              |
| **CLS**  | 0.1    | Cumulative Layout Shift - visual stability           |
| **FCP**  | 1.8s   | First Contentful Paint - initial content render      |
| **TTFB** | 800ms  | Time to First Byte - server response time            |

### Bundle Size Budgets

| Resource Type  | Budget | Description                      |
| -------------- | ------ | -------------------------------- |
| **JavaScript** | 200KB  | Total compressed JS bundle size  |
| **CSS**        | 70KB   | Total compressed CSS bundle size |
| **Total**      | 100KB  | Combined bundle size limit       |

## Getting Started

### 1. Basic Performance Testing

```bash
# Run performance audit on local development server
npm run monitor:performance

# Run comprehensive performance and bundle analysis
npm run monitor:performance:full

# Generate performance dashboard
npm run dashboard:generate
```

### 2. CI/CD Integration

The performance monitoring system automatically runs on:

- **Pull Requests** - Prevents performance regressions from merging
- **Main branch pushes** - Tracks performance trends over time
- **Daily schedule** - Continuous monitoring at 2 AM UTC
- **Manual dispatch** - On-demand performance audits

### 3. Performance Dashboard

Generate an interactive HTML dashboard showing historical performance trends:

```bash
npm run dashboard:generate
open performance-dashboard.html
```

The dashboard includes:

- Core Web Vitals trends over time
- Bundle size progression charts
- Budget compliance tracking
- Performance regression alerts

## Configuration

### Performance Budget Configuration

Edit `performance-budget.json` to customize thresholds:

```json
{
  "budgets": {
    "lcp": 2500,
    "fid": 100,
    "cls": 0.1,
    "fcp": 1800,
    "ttfb": 800,
    "jsBundle": 30720,
    "cssBundle": 71680
  },
  "thresholds": {
    "performance": {
      "good": 90,
      "needsImprovement": 70,
      "poor": 49
    },
    "regression": {
      "warning": 0.1,
      "error": 0.25
    }
  },
  "pages": [
    {
      "name": "home",
      "url": "/",
      "critical": true,
      "customBudgets": {
        "lcp": 2000,
        "fcp": 1500
      }
    }
  ]
}
```

### CI/CD Performance Gates

Configure performance gate behavior in the workflow:

```yaml
env:
  LIGHTHOUSE_RUNS: 3 # Number of runs to average
  PERFORMANCE_BUDGET_FILE: 'performance-budget.json'
```

## Monitoring Scripts

### Core Web Vitals Monitor

```bash
# Basic performance audit
node scripts/performance-monitor.js

# CI mode with JUnit output
node scripts/performance-monitor.js --ci --export --junit

# Custom URL testing
node scripts/performance-monitor.js --url=http://localhost:3000
```

### Bundle Size Monitor

```bash
# Analyze current bundle sizes
node scripts/bundle-size-monitor.js

# CI mode with regression detection
node scripts/bundle-size-monitor.js --ci --export

# Generate JUnit XML for CI
node scripts/bundle-size-monitor.js --junit
```

## Understanding Results

### Performance Score Interpretation

| Score Range | Status               | Action Required               |
| ----------- | -------------------- | ----------------------------- |
| 90-100      | ✅ Good              | Continue monitoring           |
| 70-89       | 🟡 Needs Improvement | Investigate bottlenecks       |
| 0-69        | 🔴 Poor              | Immediate optimization needed |

### Bundle Size Regression Levels

| Increase | Severity    | CI Behavior       |
| -------- | ----------- | ----------------- |
| 0-5%     | ℹ️ Info     | Pass with warning |
| 5-15%    | ⚠️ Warning  | Pass with alert   |
| 15-25%   | ❌ Error    | Fail build        |
| 25%+     | 🚨 Critical | Block deployment  |

### Core Web Vitals Rating

| Metric  | Good    | Needs Improvement | Poor    |
| ------- | ------- | ----------------- | ------- |
| **LCP** | ≤ 2.5s  | 2.5s - 4.0s       | > 4.0s  |
| **FID** | ≤ 100ms | 100ms - 300ms     | > 300ms |
| **CLS** | ≤ 0.1   | 0.1 - 0.25        | > 0.25  |

## Workflow Integration

### GitHub Actions Workflow

The performance monitoring workflow runs automatically:

1. **Bundle Size Analysis** - Measures and compares bundle sizes
2. **Performance Audit** - Runs Lighthouse tests across multiple pages
3. **Regression Analysis** - Compares results with historical baselines
4. **Performance Gate** - Fails builds if critical regressions detected

### Pull Request Integration

Performance results are automatically posted as PR comments:

```markdown
## 🎉 Performance Check Results

**Overall Status: ✅ PASSED**

### 📦 Bundle Size Analysis

- **JavaScript**: 28.3KB / 30KB ✅
- **CSS**: 65.2KB / 70KB ✅

### 🎯 Core Web Vitals

- **LCP**: 2,180ms / 2500ms ✅
- **CLS**: 0.089 / 0.1 ✅
- **Performance Score**: 94/100 ✅
```

## Troubleshooting

### Common Issues

#### 1. Server Startup Timeout

```bash
# Increase timeout in workflow
timeout 30s bash -c 'until curl -s http://localhost:8080 > /dev/null; do sleep 1; done'
```

#### 2. Chrome Dependencies Missing

```bash
# Install required dependencies (handled automatically in CI)
sudo apt-get install -y libnss3 libatk-bridge2.0-0 libdrm2 libgtk-3-0
```

#### 3. Bundle Size Calculation Errors

```bash
# Ensure dist directory exists
npm run build

# Check file permissions
ls -la dist/
```

### Performance Debugging

#### Analyze Lighthouse Report

```bash
# Run detailed Lighthouse audit
npx lighthouse http://localhost:8080 --view
```

#### Bundle Analysis

```bash
# Analyze bundle composition
npx parcel build src/index.html --reporter @parcel/reporter-bundle-analyzer
```

#### Network Throttling

```bash
# Test with network throttling
npx lighthouse http://localhost:8080 --throttling-method=simulate --throttling.cpuSlowdownMultiplier=4
```

## Best Practices

### 1. Performance Optimization

- **Code Splitting**: Load non-critical JavaScript lazily
- **Image Optimization**: Use WebP format with fallbacks
- **CSS Optimization**: Remove unused styles and minimize
- **Caching Strategy**: Implement effective browser caching
- **Font Loading**: Preload critical fonts

### 2. Monitoring Strategy

- **Baseline Establishment**: Run initial performance audit for baseline
- **Regular Monitoring**: Schedule daily automated checks
- **Alert Thresholds**: Configure appropriate warning levels
- **Historical Tracking**: Maintain performance trend data
- **Page Coverage**: Monitor all critical user journeys

### 3. CI/CD Integration

- **Performance Gates**: Block deployments with critical regressions
- **Progressive Enhancement**: Degrade gracefully for older browsers
- **Budget Enforcement**: Maintain strict performance budgets
- **Automated Reporting**: Generate performance reports automatically

## Advanced Configuration

### Custom Lighthouse Configuration

Create `.lighthouserc.json` for advanced Lighthouse configuration:

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "chromeFlags": "--no-sandbox --disable-dev-shm-usage"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

### Performance Budget Templates

Different budget configurations for different page types:

```json
{
  "templates": {
    "landing": {
      "lcp": 2000,
      "cls": 0.05,
      "jsBundle": 25600
    },
    "content": {
      "lcp": 2500,
      "cls": 0.1,
      "jsBundle": 30720
    },
    "interactive": {
      "lcp": 3000,
      "fid": 50,
      "jsBundle": 40960
    }
  }
}
```

## Maintenance

### Regular Tasks

1. **Weekly**: Review performance dashboard trends
2. **Monthly**: Update performance budgets based on user analytics
3. **Quarterly**: Analyze performance impact of major features
4. **Annually**: Reassess performance strategy and tools

### Data Retention

- Performance history: 100 most recent runs
- Bundle size history: 100 most recent builds
- Lighthouse reports: 30 days in CI artifacts
- Dashboard data: Continuously updated

### Upgrading

When updating the monitoring system:

1. Test changes in development environment
2. Validate against historical data
3. Update documentation
4. Notify team of threshold changes

---

This performance monitoring system ensures that the Jason Swetzoff UX Portfolio maintains excellent performance characteristics while providing comprehensive insights into optimization opportunities and regression detection.
