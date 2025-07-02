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
