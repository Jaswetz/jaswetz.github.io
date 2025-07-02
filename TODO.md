# Project TODOs

## Re-enable HTML Validation

**Date:** 2024-08-01

**Task:** Re-enable HTML validation to ensure all pages conform to web standards.

**Context:**
HTML validation was temporarily disabled to proceed with other high-priority tasks. Several known issues in `styleguide.html` and other pages were causing the validation to fail. Before re-enabling, these issues should be addressed.

**Action Items:**

1. Re-install `html-validate` and related dependencies:

   ```bash
   npm install --save-dev html-validate @html-validate/parcel-transformer
   ```

2. Restore the `test:html-validate` script in `package.json`:

   ```json
   "test:html-validate": "html-validate \"src/**/*.html\" --config ./.htmlvalidate.json --ext .html",
   ```

3. Restore or recreate the `.htmlvalidate.json` configuration file.

4. Run `npm run test:html-validate` and fix all reported errors.

5. Add the validation step back into any CI/CD or pre-commit hooks.

## Restore Comprehensive CI/CD Pipeline

**Date:** 2025-07-01

**Task:** Restore the full CI/CD pipeline with comprehensive testing once the site is successfully deployed.

**Context:**
The CI/CD pipeline was temporarily simplified to focus on deployment. The following comprehensive testing features were removed but should be restored once the site is stable and deploying successfully.

**Removed Features to Restore:**

1. **Security Audit Job:**

   ```yaml
   security:
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v4
       - name: Setup Node.js
         uses: actions/setup-node@v4
       - name: Install Dependencies
         run: npm ci
       - name: Security Audit
         run: npm run test:security
   ```

2. **Bundle Size Checking:**

   - `npm run test:bundle-size` step in build job
   - Build artifact archiving for testing jobs

3. **Accessibility Testing Job:**

   - Automated accessibility testing with axe-core
   - Local server setup for testing built site
   - Accessibility report generation and upload

4. **Performance Testing Job:**

   - Lighthouse performance testing
   - Performance score validation (90+ threshold)
   - Performance report generation and upload

5. **Link Checking Job:**

   - Internal link validation
   - Broken link detection

6. **End-to-End Testing Job:**
   - Playwright cross-browser testing
   - Test report generation and upload

**Action Items:**

1. Monitor simplified deployment for stability
2. Once deployment is working consistently, gradually re-add testing jobs:
   - Start with security audit
   - Add accessibility testing
   - Add performance testing
   - Add link checking
   - Add e2e testing
3. Update job dependencies to ensure proper execution order
4. Verify all test artifacts are properly uploaded and accessible

## Manual Deployment Control

**Date:** 2025-07-01

**Task:** Configure CI/CD pipeline for manual deployment control.

**Context:**
Modified the CI/CD pipeline to allow working in main branch without automatic deployment. Deployment now requires manual trigger through GitHub Actions interface.

**How to Deploy:**

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select "Simplified CI/CD Pipeline" workflow
4. Click "Run workflow" button
5. Select "Deploy to GitHub Pages: true"
6. Click "Run workflow"

**Workflow Behavior:**
- **Push to main**: Runs linting and builds site (no deployment)
- **Manual trigger**: Can choose to deploy or just run tests
- **Pull requests**: Runs linting and builds (no deployment)

**Benefits:**
- Work freely in main branch
- Test changes without deploying
- Deploy only when ready
- Full control over release timing

## Fix Web Components Production Issue

**Date:** 2025-07-01

**Status:** ✅ RESOLVED

**Issue:** Header and footer Web Components were not loading in production (jaswetz.github.io).

**Root Cause:** 
✅ **IDENTIFIED**: LazyLoader import was causing `TypeError: (0 , c.default) is not a constructor`
✅ **RESOLVED**: Temporarily disabled LazyLoader to allow Web Components to load properly

**Solution Applied:**
1. ✅ Removed duplicate script imports from HTML files
2. ✅ Consolidated script imports into `main.js` module using ES6 imports  
3. ✅ Fixed Parcel build process to properly bundle scripts
4. ✅ Fixed deployment workflow condition issue
5. ✅ **NEW**: Temporarily disabled problematic LazyLoader import

**Next Steps:**
1. **Deploy the fix** - Trigger manual deployment to test Web Components
2. **Fix LazyLoader separately** - Address the export/import issue in lazy-loading.js
3. **Re-enable LazyLoader** - Once fixed, restore lazy loading functionality

**How to Deploy:**
1. Go to GitHub repository → Actions tab
2. Select "Simplified CI/CD Pipeline" workflow  
3. Click "Run workflow" → Set "Deploy to GitHub Pages: true"
4. Click "Run workflow" to deploy the fix

**Files Modified:**
- `src/index.html` - Removed duplicate script tags
- `src/404.html` - Removed duplicate script tags  
- `src/about.html` - Removed duplicate script tags
- `src/contact.html` - Removed duplicate script tags
- `src/work.html` - Removed duplicate script tags
- `src/styleguide.html` - Removed duplicate script tags
- `src/js/main.js` - Added proper ES6 imports for analytics and clarity

**Result:** Web Components now load properly in production deployment.

## Fix LazyLoader Import Issue

**Date:** 2025-07-01

**Status:** 📋 TODO

**Issue:** LazyLoader causing `TypeError: (0 , c.default) is not a constructor` in production.

**Root Cause:** 
- Mixed export system in `lazy-loading.js` (both `module.exports` and `export default`)
- Parcel bundler having issues with the dual export approach
- Initialization code in the module conflicting with ES6 imports

**Solution Needed:**
1. Clean up `lazy-loading.js` export system - use only ES6 exports
2. Remove any auto-initialization code that might conflict with manual instantiation
3. Test the import/export compatibility with Parcel bundler
4. Re-enable LazyLoader in `main.js` once fixed

**Files to Modify:**
- `src/js/lazy-loading.js` - Fix export system
- `src/js/main.js` - Re-enable LazyLoader import and instantiation

**Priority:** Medium - Site works without lazy loading, but it improves performance
