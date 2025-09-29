# Contributing to Jason Swetzoff Portfolio

Thank you for your interest in contributing to this project! This document provides guidelines and standards for contributing to the codebase.

## Table of Contents

- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Code Quality Tools](#code-quality-tools)
- [Commit Guidelines](#commit-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Development Setup

### Prerequisites

- Node.js 18.x or later
- npm 8.x or later
- Git

### Installation

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/your-username/jaswetz.github.io.git
   cd jaswetz.github.io
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up Husky git hooks:
   ```bash
   npm run prepare
   ```

### Development Workflow

1. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Start the development server:

   ```bash
   npm run serve
   ```

3. Make your changes and ensure code quality:
   ```bash
   npm run lint
   npm run format
   npm run test
   ```

## Coding Standards

### JavaScript/TypeScript

- Use ES6+ features
- Prefer `const` over `let` when possible
- Use arrow functions for anonymous functions
- Use template literals instead of string concatenation
- Use destructuring assignment when appropriate
- Avoid `var` declarations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

#### Example:

```javascript
// Good
const calculateTotal = items => {
  return items.reduce((total, item) => total + item.price, 0);
};

// Avoid
function calc(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}
```

### CSS/SCSS

- Follow BEM methodology for class naming
- Use lowercase with hyphens for class names
- Group related properties logically
- Use CSS custom properties (variables) for reusable values
- Avoid deep nesting (max 3 levels)
- Use semantic class names

#### Example:

```scss
// Good - BEM methodology
.card {
  &__header {
    background-color: var(--color-primary);
  }

  &__title {
    font-size: 1.25rem;
  }

  &__content {
    padding: 1rem;
  }
}
```

### HTML

- Use semantic HTML elements
- Maintain proper document structure
- Use lowercase for element names and attributes
- Always include alt text for images
- Use ARIA attributes when necessary for accessibility

#### Example:

```html
<!-- Good -->
<article class="project-card">
  <header class="project-card__header">
    <h2 class="project-card__title">Project Title</h2>
  </header>
  <img
    src="project-image.jpg"
    alt="Screenshot of the project interface"
    class="project-card__image"
  />
  <p class="project-card__description">Project description...</p>
</article>
```

## Code Quality Tools

This project uses several tools to maintain code quality:

### ESLint

- Lints JavaScript/TypeScript code
- Enforces coding standards and catches potential bugs
- Run with: `npm run lint`
- Auto-fix issues: `npm run lint:fix`

### Prettier

- Formats code consistently
- Run with: `npm run format`
- Check formatting: `npm run format:check`

### Stylelint

- Lints CSS/SCSS code
- Enforces CSS coding standards
- Run with: `npm run stylelint`
- Auto-fix issues: `npm run stylelint:fix`

### Husky + lint-staged

- Runs linting and formatting on pre-commit
- Prevents commits with linting errors
- Automatically formats staged files

### Bundle Size Monitoring

- Monitors JavaScript and CSS bundle sizes
- Prevents unexpected size increases
- Run with: `npm run test:bundle-size`

## Commit Guidelines

This project follows conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples:

```
feat: add dark mode toggle
fix: resolve mobile navigation bug
docs: update installation instructions
style: format CSS with consistent spacing
refactor: simplify authentication logic
test: add unit tests for user validation
```

## Testing

### Unit Tests

- Write tests for utility functions and components
- Use Vitest as the testing framework
- Run tests: `npm run test`
- Run with coverage: `npm run test:coverage`

### End-to-End Tests

- Test complete user workflows
- Use Playwright for E2E testing
- Run E2E tests: `npm run test:e2e`

### CSS Regression Tests

- Test visual changes in CSS
- Run regression tests: `npm run test:css-regression`

### Accessibility Testing

- Test accessibility compliance
- Run locally: `npm run test:accessibility:local`

### Performance Testing

- Test Core Web Vitals
- Run locally: `npm run test:performance:local`

## Pull Request Process

1. **Create a Feature Branch**: Always create a feature branch from `master`

2. **Write Tests**: Add tests for new features and bug fixes

3. **Code Quality**: Ensure all code quality checks pass:
   - ESLint: `npm run lint`
   - Prettier: `npm run format:check`
   - Stylelint: `npm run stylelint`
   - Tests: `npm run test`

4. **Commit Messages**: Use conventional commit format

5. **Pull Request**:
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure CI checks pass

6. **Code Review**: Address review feedback and make necessary changes

7. **Merge**: Squash merge after approval

## Additional Resources

- [Architecture Documentation](Docs/ARCHITECTURE.md)
- [Testing Guide](Docs/TESTING.md)
- [Asset Optimization Guide](Docs/ASSET_OPTIMIZATION_GUIDE.md)
- [HTML5 & BEM Guidelines](.github/instructions/html5-BEM.instructions.md)
- [Accessibility Guidelines](.github/instructions/accessibility.instructions.md)

## Questions?

If you have questions about contributing, please open an issue or contact the maintainers.
