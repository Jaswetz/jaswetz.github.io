This TypeScript-first approach ensures type safety, better IDE support, and maintainable component APIs throughout the application.

## Developer Onboarding Guide

This guide walks new developers through setting up the development environment and understanding the code quality workflow.

### 🚀 Quick Start

**Prerequisites:**

- Node.js 18+ (see `.nvmrc` for exact version)
- npm or yarn package manager
- VS Code with recommended extensions

**Initial Setup:**

```bash
# Clone the repository
git clone https://github.com/jaswetz/jaswetz.github.io.git
cd jaswetz.github.io

# Install dependencies
npm ci

# Start development server
npm run dev
```

### 🛠️ Development Environment Setup

#### 1. VS Code Configuration

**Install Recommended Extensions:**
The project includes a `.vscode/extensions.json` file with recommended extensions. VS Code will prompt you to install them when you open the project.

**Key Extensions:**

- **ESLint**: Real-time JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Stylelint**: CSS linting
- **TypeScript Importer**: Auto-import management
- **EditorConfig**: Cross-editor consistency

**Workspace Settings:**
The `.vscode/settings.json` file configures:

- Format on save with Prettier
- ESLint auto-fix on save
- Stylelint validation
- TypeScript strict settings

#### 2. Code Quality Tools

**ESLint Configuration:**

- **Flat Config**: Modern `eslint.config.js` format
- **TypeScript Support**: Full type-aware linting
- **Custom Rules**: Project-specific best practices
- **Auto-fix**: Many issues can be automatically resolved

**Prettier Configuration:**

- **Consistent Formatting**: Enforced across all file types
- **EditorConfig Integration**: Respects `.editorconfig` settings
- **Import Sorting**: Maintains consistent import order

**Stylelint Configuration:**

- **BEM Methodology**: Enforced naming conventions
- **Property Ordering**: Consistent CSS property order
- **SCSS Support**: Full Sass syntax validation

### 🔄 Development Workflow

#### Daily Development Cycle

```bash
# 1. Start development server
npm run dev

# 2. Make changes to code
# - ESLint provides real-time feedback in VS Code
# - Prettier formats code on save
# - Stylelint validates CSS/SCSS

# 3. Run quality checks before committing
npm run lint      # Check JavaScript/TypeScript
npm run stylelint # Check CSS/SCSS
npm run format    # Format all files

# 4. Commit changes
git add .
git commit -m "feat: add new component"
# Pre-commit hooks run automatically:
# - ESLint on staged JS/TS files
# - Prettier formatting
# - Stylelint on staged CSS/SCSS
```

#### Pre-commit Quality Gates

**Husky + lint-staged** automatically run quality checks:

**Pre-commit Hook:**

- **ESLint**: Lints only staged JavaScript/TypeScript files
- **Prettier**: Formats staged files automatically
- **Stylelint**: Lints staged CSS/SCSS files
- **Speed**: Typically completes in <5 seconds

**Pre-push Hook:**

- **Full Test Suite**: Runs on feature branches
- **Type Checking**: Validates TypeScript types
- **Bundle Analysis**: Checks size limits

### 🧪 Testing and Validation

#### Local Testing

**Run All Quality Checks:**

```bash
# Comprehensive local testing
npm run test:all  # Requires dev server running

# Individual checks
npm run lint         # ESLint only
npm run stylelint    # Stylelint only
npm run format       # Prettier formatting
npm run test         # Unit tests
```

**Local Test Script:**
The `test-local.sh` script provides comprehensive local testing:

```bash
./test-local.sh
# Runs: security audit, linting, accessibility, performance, bundle size
```

#### CI/CD Pipeline

**GitHub Actions Workflow:**

- **Triggers**: Push to main branch or pull requests
- **Jobs**:
  - **Lint**: ESLint, Stylelint, Prettier validation
  - **Build**: Production build with bundle analysis
  - **Test**: Accessibility, performance, cross-browser testing
  - **Deploy**: Automatic deployment on main branch

**Quality Gates:**

- ❌ **Fail on**: ESLint errors, Stylelint errors, build failures
- ⚠️ **Warn on**: Performance regressions, accessibility issues
- ✅ **Pass**: All checks pass, deployment triggered

### 📝 Code Standards and Best Practices

#### JavaScript/TypeScript Standards

**ESLint Rules Categories:**

- **Error**: Must be fixed (syntax errors, potential bugs)
- **Warning**: Should be addressed (code quality issues)
- **Project Rules**: Custom rules for consistency

**Key Rules:**

```javascript
// Examples of enforced rules
'no-console': 'warn',           // Warn on console.log in production code
'no-unused-vars': 'error',      // Error on unused variables
'prefer-const': 'error',        // Enforce const over let when possible
'@typescript-eslint/no-explicit-any': 'warn',  // Warn on any types
```

#### CSS Standards

**Stylelint Rules:**

- **BEM Naming**: `.component__element--modifier` pattern
- **Property Order**: Consistent ordering using concentric-css
- **No Hardcoded Colors**: Use CSS custom properties
- **Max Nesting**: 3 levels maximum

**Example:**

```css
/* ✅ Correct BEM with ordered properties */
.component {
  /* Positioning */
  position: relative;
  /* Display & Box Model */
  display: flex;
  /* ... etc */
}

.component__element {
  /* Element styles */
}

.component--modifier {
  /* Modifier styles */
}
```

#### Commit Message Standards

**Conventional Commits:**

```bash
# Good commit messages
feat: add responsive navigation component
fix: resolve accessibility issue in image lightbox
docs: update component API documentation
style: format CSS with consistent spacing
refactor: simplify state management logic

# Bad commit messages
"fixed bug"
"updated code"
"changes"
```

### 🐛 Troubleshooting

#### Common Issues

**ESLint Errors:**

```bash
# Check specific file
npx eslint src/js/components/MyComponent.js

# Auto-fix issues
npx eslint src/js/components/MyComponent.js --fix

# Check all files
npm run lint
```

**Prettier Formatting:**

```bash
# Format specific file
npx prettier --write src/js/components/MyComponent.js

# Check formatting without changing files
npx prettier --check src/js/components/MyComponent.js

# Format all files
npm run format
```

**Stylelint Issues:**

```bash
# Check CSS file
npx stylelint src/css/components/my-component.css

# Auto-fix issues
npx stylelint src/css/components/my-component.css --fix
```

**TypeScript Errors:**

```bash
# Type check all files
npx tsc --noEmit

# Check specific file
npx tsc --noEmit src/js/components/MyComponent.ts
```

#### VS Code Issues

**Extensions Not Working:**

1. Reload VS Code window (`Ctrl/Cmd + Shift + P` → "Developer: Reload Window")
2. Check extension is enabled in status bar
3. Verify workspace settings are loaded

**Formatting Not Applying:**

1. Check `.prettierrc.json` exists and is valid
2. Verify Prettier is set as default formatter
3. Check "Format on Save" is enabled

### 📚 Additional Resources

**Documentation:**

- **[Architecture Overview](Docs/ARCHITECTURE.md)**: Technical architecture and design decisions
- **[Testing Guide](Docs/TESTING.md)**: Multi-layer testing strategy and tools
- **[Component APIs](#web-component-apis-and-typescript-usage)**: TypeScript component usage examples

**Tools:**

- **[ESLint Rules Reference](https://eslint.org/docs/rules/)**: Complete ESLint rule documentation
- **[Prettier Options](https://prettier.io/docs/en/options.html)**: Prettier configuration options
- **[Stylelint Rules](https://stylelint.io/user-guide/rules/list)**: Stylelint rule reference
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**: TypeScript language documentation

**Community:**

- **GitHub Issues**: Report bugs or request features
- **Pull Requests**: Follow the contribution guidelines
- **Code Reviews**: All changes require review before merging

This onboarding guide ensures all developers can quickly become productive while maintaining high code quality standards.
