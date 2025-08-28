# Testing Guide

This document outlines the comprehensive testing strategy for the Jason Swetzoff Portfolio website.

## Overview

The project uses a multi-layered testing approach that includes:

- **Security auditing** - Dependency vulnerability scanning
- **Code quality** - Linting for JavaScript and CSS
- **HTML validation** - Markup validation
- **Accessibility testing** - WCAG 2.1 AA compliance checks
- **Performance testing** - Core Web Vitals and load time metrics
- **Cross-browser testing** - Multi-browser compatibility
- **End-to-end testing** - User journey validation
- **Bundle size monitoring** - Asset optimization tracking

## Quick Start

### Run All Tests Locally

```bash
# Run the comprehensive test suite
./test-local.sh
```

### Run Individual Test Categories

```bash
# Security audit
npm run test:security

# Linting
npm run lint
npm run stylelint

# Accessibility (requires running server)
npm run test:accessibility:local

# Performance (requires running server)
npm run test:performance:local

# Cross-browser tests
npm test
```

## Development vs Production Builds

The project uses separate build outputs for development and production:

- **Development**: `npm run dev` → `dev-build/` folder (fast, unoptimized)
- **Production**: `npm run build` → `dist/` folder (optimized, minified)

This separation ensures:

- No conflicts between dev and prod builds
- Faster development builds
- Clean production artifacts
- Bundle size checks only apply to production builds

## Test Categories

### 1. Security Testing

**Tools**: npm audit
**Purpose**: Detect known vulnerabilities in dependencies
**Threshold**: No moderate or higher severity vulnerabilities

```bash
npm run test:security
```

**Common Issue**: Image optimization dependencies (imagemin-\*) may have security vulnerabilities due to outdated transitive dependencies. See [Troubleshooting](#troubleshooting) section for resolution strategies.

### 2. Code Quality

#### JavaScript Linting

**Tools**: ESLint
**Configuration**: `eslint.config.js`
**Rules**: ES2022, module syntax, no unused variables

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

#### CSS Linting

**Tools**: Stylelint
**Configuration**: `.stylelintrc.json`
**Rules**: Standard CSS rules, CSS Layer support

```bash
npm run stylelint
npm run stylelint:fix  # Auto-fix issues
```

### 3. HTML Validation

**Tools**: html-validate
**Configuration**: `.htmlvalidate.json`
**Purpose**: Validate HTML5 markup and custom elements

```bash
# This test is temporarily disabled.
# See TODO.md for details on re-enabling.
```

### 4. Accessibility Testing

**Tools**: axe-core CLI, Playwright
**Standards**: WCAG 2.1 AA compliance
**Automated checks**: Color contrast, keyboard navigation, ARIA labels

```bash
npm run test:accessibility:local
```

**Manual testing checklist**:

- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces content correctly
- [ ] Focus management is appropriate
- [ ] Color contrast meets 4.5:1 ratio
- [ ] All images have appropriate alt text

### 5. Performance Testing

**Tools**: Lighthouse CLI
**Metrics**: Core Web Vitals, Performance Score
**Threshold**: Performance score ≥ 90

```bash
npm run test:performance:local
```

**Key metrics monitored**:

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

### 6. Bundle Size Monitoring

**Tools**: bundlesize
**Thresholds**:

- JavaScript: ≤ 30kB gzipped
- CSS: ≤ 70kB gzipped

```bash
npm run test:bundle-size
```

### 7. Link Testing

**Tools**: linkcheck
**Purpose**: Verify all internal links work correctly

```bash
npm run test:links:local
```

### 8. Cross-Browser Testing

**Tools**: Playwright
**Browsers**: Chrome, Firefox, Safari, Edge
**Viewports**: Desktop, tablet, mobile

```bash
npx playwright test
```

**Test coverage**:

- Page loading and rendering
- Web component functionality
- Responsive design
- Navigation behavior
- Form interactions

## Continuous Integration

The CI/CD pipeline (`/.github/workflows/deploy.yml`) runs all tests automatically on:

- Every push to `main` branch
- Every pull request
- Scheduled runs (if configured)

### Pipeline Stages

1. **Security** - Dependency audit
2. **Lint** - Code quality checks
3. **Build** - Project compilation and bundle size check
4. **Test** - Accessibility, performance, links, and cross-browser tests
5. **Deploy** - Deployment to GitHub Pages (main branch only)

### Pipeline Artifacts

The following reports are generated and stored:

- Accessibility report (`accessibility-report`)
- Performance report (`performance-report`)
- Playwright test results (`playwright-report`)
- Built site (`site-dist`)

## Local Development

### Pre-commit Hooks

A pre-commit hook runs quick quality checks:

```bash
# Automatically installed when you commit
git commit -m "Your changes"
```

### IDE Integration

Recommended VS Code extensions:

- ESLint
- Stylelint
- HTML Validate
- Playwright Test for VS Code

## Troubleshooting

### Common Issues

#### Security Vulnerabilities in Image Optimization Dependencies

**Problem**: npm audit reports vulnerabilities in imagemin-webp, imagemin-mozjpeg, imagemin-pngquant
**Root Cause**: These packages depend on outdated binary tools with security issues
**Impact**: Development dependencies only - does not affect production bundle

**Solutions** (in order of preference):

1. **Accept as Development Risk** (Recommended for now)

   ```bash
   # Run audit but exclude dev dependencies from CI/CD
   npm audit --production
   ```

2. **Use npm audit override** (Temporary solution)

   ```json
   // Add to package.json
   "overrides": {
     "cross-spawn": "^6.0.6",
     "got": "^12.0.0",
     "http-cache-semantics": "^4.1.1",
     "semver-regex": "^4.0.0"
   }
   ```

3. **Alternative: Use Sharp for image optimization** (Long-term solution)

   ```bash
   npm uninstall imagemin imagemin-webp imagemin-mozjpeg imagemin-pngquant
   npm install sharp --save-dev
   # Update optimization scripts to use Sharp
   ```

4. **Docker-based optimization** (Production solution)
   ```bash
   # Use Docker container with updated binaries
   docker run --rm -v $(pwd):/work node:latest npm audit fix
   ```

**Note**: Since these are development dependencies used only for asset optimization, the vulnerabilities don't affect the production website. The optimized images are safe to use.

#### **Tests fail in CI but pass locally**

- Ensure you're testing against the built version (`npm run build`)
- Check that all dependencies are properly installed
- Verify server is running for integration tests

**Performance tests fail**

- Check network conditions during test
- Verify images are optimized
- Review bundle size reports
- Lighthouse report structure: Use `report.categories.performance.score` (Lighthouse v12+) instead of `report.lhr.categories.performance.score` (older versions)

**Accessibility tests fail**

- Check color contrast with browser dev tools
- Test keyboard navigation manually
- Verify ARIA labels are present

**Cross-browser tests fail**

- Update Playwright browsers: `npx playwright install`
- Check for browser-specific CSS or JavaScript issues
- Verify polyfills are loaded for older browsers

### Getting Help

1. Check the GitHub Actions logs for detailed error messages
2. Run tests locally with verbose output
3. Review the specific test documentation for each tool
4. Create an issue using the bug report template

## Contributing

When contributing:

1. Run `./test-local.sh` before submitting PRs
2. Add tests for new features
3. Update this documentation if you add new test types
4. Ensure all CI checks pass

## Test Reports

Test reports are available in the GitHub Actions artifacts and can be downloaded for detailed analysis:

- **Lighthouse Report**: Performance metrics and recommendations
- **Accessibility Report**: WCAG violations and fixes
- **Playwright Report**: Cross-browser test results with screenshots
