### Test Environment

- **Local Testing**: `./test-local.sh` comprehensive suite
- **CI/CD Pipeline**: GitHub Actions automated testing
- **Development vs Production**: Separate build outputs

## Code Quality Architecture

### Enhanced Linting & Formatting Pipeline

The project implements a comprehensive code quality assurance system with enhanced tooling for maintainable, consistent code:

#### ESLint Configuration Architecture

**Modern Flat Config System:**

- **ESLint 9 Flat Config**: Uses `eslint.config.js` instead of legacy `.eslintrc`
- **TypeScript Integration**: Full type-aware linting with `@typescript-eslint/parser`
- **Environment-Specific Rules**: Different rule sets for browser, Node.js, and test environments
- **Custom Project Rules**: Additional rules for security, performance, and consistency

**Configuration Structure:**

```javascript
// eslint.config.js - Flat config with TypeScript support
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  // JavaScript files - browser environment
  {
    files: ['src/**/*.js'],
    languageOptions: { ecmaVersion: 2022 },
    rules: { ...js.configs.recommended.rules /* project rules */ },
  },
  // TypeScript files - strict type checking
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: { parser: tsparser },
    plugins: { '@typescript-eslint': tseslint },
    rules: { ...tseslint.configs.recommended.rules /* type rules */ },
  },
];
```

#### Prettier Integration

**Automated Code Formatting:**

- **EditorConfig Integration**: Respects `.editorconfig` for cross-editor consistency
- **Format on Save**: Automatic formatting in VS Code with proper extension configuration
- **Import Sorting**: Maintains consistent import order across files
- **Multi-Language Support**: JavaScript, TypeScript, CSS, SCSS, HTML, JSON, Markdown

#### Stylelint Architecture

**CSS Quality Assurance:**

- **BEM Methodology Enforcement**: Automated checking of BEM naming conventions
- **Property Ordering**: Consistent CSS property order using concentric-css methodology
- **Cascade Layer Validation**: Ensures proper use of CSS `@layer` directives
- **SCSS Support**: Full Sass syntax validation and best practices

### Pre-commit Quality Gates

**Husky + lint-staged Automation:**

- **Pre-commit Hook**: Lightweight checks on staged files (<5 seconds)
- **Pre-push Hook**: Comprehensive validation before sharing code
- **Selective Processing**: Only lints files that are actually being committed
- **Auto-fixing**: Automatically fixes issues where possible

**Hook Configuration:**

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["stylelint --fix", "prettier --write"]
  }
}
```

### VS Code Integration Architecture

**Workspace Configuration:**

- **Settings**: Comprehensive `.vscode/settings.json` with tool integrations
- **Extensions**: Recommended extensions in `.vscode/extensions.json`
- **Format on Save**: Automatic formatting and fixing on file save
- **Real-time Feedback**: Live linting and error highlighting

**Key Integrations:**

- ESLint extension with flat config support
- Prettier extension with config file detection
- Stylelint extension for CSS validation
- TypeScript extension for enhanced IDE support

### CI/CD Quality Assurance

**GitHub Actions Pipeline:**

- **Multi-stage Validation**: Separate jobs for different quality checks
- **Parallel Processing**: Concurrent linting, testing, and building
- **Comprehensive Coverage**: Security, accessibility, performance, and bundle analysis
- **Fail-fast Strategy**: Stops pipeline on critical quality issues

**Quality Gates:**

```yaml
# .github/workflows/deploy.yml
jobs:
  lint:
    steps:
      - run: npm run lint # ESLint validation
      - run: npm run stylelint # CSS validation
  build-and-deploy:
    needs: [lint] # Must pass quality checks
    steps:
      - run: npm run build # Production build
      - run: npm run test # Additional validations
```

### TypeScript Architecture

**Strict Type Safety:**

- **Full Type Checking**: All TypeScript files use strict mode
- **ES2022 Target**: Modern JavaScript features with type safety
- **Module Resolution**: Bundler-compatible type resolution
- **Declaration Files**: Type definitions for CSS modules and custom elements

**TypeScript Configuration:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noImplicitAny": true,
    "moduleResolution": "bundler",
    "types": ["vitest/globals"]
  }
}
```

### Code Quality Metrics

**Automated Monitoring:**

- **Bundle Size Limits**: JS <30KB, CSS <70KB with automated checking
- **Performance Budgets**: Core Web Vitals monitoring in CI/CD
- **Accessibility Scores**: WCAG 2.1 AA compliance validation
- **Security Scanning**: Dependency vulnerability assessment

**Quality Assurance Workflow:**

1. **Local Development**: Real-time linting and formatting
2. **Pre-commit**: Automated quality checks on staged files
3. **CI/CD Pipeline**: Comprehensive validation before deployment
4. **Post-deployment**: Performance monitoring and error tracking

This enhanced code quality architecture ensures consistent, maintainable, and high-quality code throughout the development lifecycle while providing excellent developer experience and automated quality assurance.
