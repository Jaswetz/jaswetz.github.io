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
