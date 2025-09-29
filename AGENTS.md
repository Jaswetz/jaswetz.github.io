# jaswetz.github.io Agents Documentation

This document consolidates all detailed, agent-focused development instructions, conventions, and guidelines to enable efficient automation and maintenance of Jason Swetzoff's UX portfolio. It complements the human-oriented README and other Docs.

---

## Table of Contents

1. [Critical Constraints](#critical-constraints)
2. [Technology Stack](#technology-stack)
3. [Performance Requirements](#performance-requirements)
4. [Project Structure](#project-structure)
5. [Web Components Architecture](#web-components-architecture)
6. [CSS Cascade Layers](#css-cascade-layers)
7. [File Naming Conventions](#file-naming-conventions)
8. [Development Workflows](#development-workflows)
9. [Quality Assurance](#quality-assurance)
10. [Content Guidelines](#content-guidelines)
11. [Password Protection](#password-protection)
12. [Asset Management](#asset-management)
13. [Deployment Checklist](#deployment-checklist)

---

## Critical Constraints

### NEVER VIOLATE

- **NO frameworks** - This is a vanilla JavaScript project using Web Components only
- **Performance budgets**: JavaScript <30KB gzipped, CSS <70KB gzipped
- **Core Web Vitals**: LCP <2.5s, CLS <0.1, FID <100ms
- **Technology stack**: Vanilla ES2022 modules, Web Components, Cascade Layers only

### Validation Commands (REQUIRED)

```bash
npm run test:bundle-size    # MUST pass - validates size limits
npm run test               # ESLint + Stylelint MUST pass
npx playwright test        # Cross-browser + accessibility MUST pass
```

## Technology Stack

### Required Stack

- **JavaScript**: Vanilla ES2022 modules with Web Components only
- **CSS**: Cascade Layers architecture (`@layer reset, base, theme, layout, components, utilities`)
- **Build**: Parcel.js 2.15.4 (zero-config bundler)
- **Node.js**: 23.9.0 (check `.nvmrc`)

### Browser Support

- Chrome/Edge >= 63
- Firefox >= 63
- Safari >= 10.1

## Performance Requirements

### Bundle Size Limits (ENFORCE)

- **JavaScript**: <30KB gzipped
- **CSS**: <70KB gzipped
- **Core Web Vitals**: LCP <2.5s, CLS <0.1, FID <100ms
- **Lighthouse Performance**: ≥90 score required

### Validation

```bash
npm run test:bundle-size    # Check current sizes
npm run build              # Rebuild and check dist/
```

## Project Structure

### Root Directory Structure

- `src/` - All source files (HTML, CSS, JS, images)
- `dist/` - Production build output (DO NOT EDIT)
- `tests/` - Playwright test files
- `scripts/` - Build and optimization utilities
- `public/` - Static assets (robots.txt, \_headers)

### Key Directories

- `src/js/components/` - Web Components (PascalCase folders)
- `src/css/` - Cascade Layers architecture
- `src/projects/` - Case study HTML files
- `src/img/projects/` - Project images organized by company

### Case Study Naming Convention

**MANDATORY**: `project-[company]-[project].html`

- Examples: `project-autodesk-di.html`, `project-intel-lfc.html`
- Use kebab-case for company and project names
- Store in `src/projects/` directory

## Web Components Architecture

### MANDATORY Pattern

```javascript
class ComponentName extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
customElements.define('component-name', ComponentName);
```

### Rules

- All interactive UI MUST be Web Components
- Custom element names require hyphens
- Use Shadow DOM for encapsulation
- Register components in `src/js/main.js`

### File Structure

**MANDATORY Pattern:**

```
src/js/components/[component-name]/
├── ComponentName.js    # PascalCase class file
└── ComponentName.css   # Component styles
```

### Component Registration

**ALL components MUST be registered in `src/js/main.js`:**

```javascript
import { SiteHeader } from './components/site-header/SiteHeader.js';
customElements.define('site-header', SiteHeader);
```

## CSS Cascade Layers

### CRITICAL: Layer Import Order

**EXACT ORDER in `src/css/main.css`:**

```css
@layer reset, base, theme, layout, components, utilities;
```

### Directory Structure

- `src/css/main.css` - Entry point with layer imports
- `src/css/variables.css` - Design tokens (CSS custom properties)
- `src/css/base/` - Foundation styles (reset, typography)
- `src/css/theme/` - Color schemes and theme overrides
- `src/css/layout/` - Page-level layout systems
- `src/css/components/` - UI component styles
- `src/css/pages/` - Page-specific styles
- `src/css/utils/` - Utility classes and helpers

### Implementation Rules

- Import layers in `src/css/main.css` in exact order
- Design tokens in `src/css/variables.css`
- Mobile-first responsive design with `rem` units
- BEM methodology within Shadow DOM only

## File Naming Conventions

### MANDATORY Naming Rules

- **HTML/CSS/JS files**: `kebab-case.ext`
- **Web Component classes**: `PascalCase.js`
- **Component folders**: `kebab-case/`
- **Case studies**: `project-[company]-[project].html`

### Web Components

- **Custom elements**: Must contain hyphens (`<site-header>`)
- **Class names**: PascalCase (`SiteHeader`)
- **Folder structure**: `src/js/components/site-header/SiteHeader.js`

### CSS Classes

- **Global**: BEM methodology (`card__content--primary`)
- **Component**: Shadow DOM scoped (`:host`, `.nav-list`)
- **Utilities**: Descriptive (`grid-cols-2`, `gap-3`)

## Development Workflows

### Adding Web Components

1. Create `src/js/components/[component-name]/ComponentName.js`
2. Create `src/js/components/[component-name]/ComponentName.css`
3. Register in `src/js/main.js`: `customElements.define('component-name', ComponentName)`
4. Document in `/styleguide.html`
5. Test with `npm run test && npx playwright test`

### Adding Case Studies

1. Create `src/projects/project-[company]-[project].html`
2. Add project card to `src/index.html` homepage grid
3. Add images to `src/img/projects/[company]/`
4. Run `npm run optimize:images`
5. Add password protection if needed: `protectCaseStudy("project-id")`
6. Validate with full test suite

### Adding CSS

1. Add styles to appropriate layer in `src/css/[layer]/`
2. Import in `src/css/main.css` maintaining layer order
3. Use design tokens from `src/css/variables.css`
4. Validate bundle size: `npm run test:bundle-size`

## Quality Assurance

### Pre-Deployment Validation (MANDATORY)

```bash
npm run test:bundle-size    # MUST pass - validates JS <30KB, CSS <70KB
npm run test               # ESLint + Stylelint MUST pass
npx playwright test        # Cross-browser + accessibility MUST pass
npm run build && npm run preview  # Test production build
```

### Performance Requirements

- Core Web Vitals within thresholds
- Lighthouse performance score ≥90
- Bundle size limits enforced
- Cross-browser compatibility

### HTML Requirements

- Semantic elements: `<nav>`, `<main>`, `<section>`, `<article>`
- Proper heading hierarchy: h1 → h2 → h3 (no skipping)
- ARIA labels for interactive elements
- 44px minimum touch targets on mobile
- `loading="lazy"` for below-fold images

### JavaScript Requirements

- ES2022 modules with `import`/`export`
- Web Components extend `HTMLElement`
- Handle errors with try/catch blocks
- Respect `prefers-reduced-motion`
- NO frameworks or libraries

## Content Guidelines

### Writing Style

- Third person for Jason's work: "Jason led the design process..."
- Include quantifiable outcomes: "Increased conversion by 23%"
- Professional UX terminology: user research, personas, wireframes, prototypes
- Case study structure: hero, problem, process, outcomes

### Content Protection Levels

- **Public**: Open portfolio pieces (default)
- **Protected**: Client work requiring `protectCaseStudy("case-id")`

## Password Protection

### Implementation

```javascript
// In protected HTML pages
protectCaseStudy('autodesk-di'); // kebab-case IDs only
```

### Configuration

- Edit `src/js/auth/password-config.js` for protected content
- Client-side only, 24-hour localStorage sessions
- NEVER log passwords or expose authentication details

## Asset Management

### Image Workflow

1. Add images to `src/img/projects/[company]/`
2. **ALWAYS run:** `npm run optimize:images`
3. Use WebP with fallbacks in HTML
4. Add descriptive alt text for accessibility

### Image Organization

- `src/img/` - Original images
- `src/img/webp/` - WebP optimized versions (auto-generated)
- `src/img/projects/[company]/` - Project images by company
- `src/img-backup/` - Backup of originals

### Static Assets

- `src/assets/favicons/` - Favicon variants
- `src/assets/pdf/` - Resume and documents
- `src/svg/` - SVG graphics and logos

## Deployment Checklist

Before any deployment, ALL items must pass:

- [ ] `npm run test` passes (linting)
- [ ] `npm run test:bundle-size` passes (JS <30KB, CSS <70KB)
- [ ] `npx playwright test` passes (functionality + accessibility)
- [ ] Lighthouse performance score ≥90
- [ ] Password protection tested for protected content
- [ ] Mobile responsiveness validated on actual devices

## Essential Commands

### Development

```bash
npm run dev                # Hot reload development server
npm run build             # Production build to dist/
npm run preview           # Test production build
```

### Quality Assurance (REQUIRED)

```bash
npm run test              # Linting validation
npm run test:bundle-size  # Size limits (JS <30KB, CSS <70KB)
npx playwright test       # Full test suite
```

### Asset Management

```bash
npm run optimize:images   # WebP conversion (run after adding images)
```

## Critical Files to Update

### Component Registration

- `src/js/main.js` - Register ALL Web Components here

### CSS Layer Management

- `src/css/main.css` - Maintain exact layer import order

### Password Protection

- `src/js/auth/password-config.js` - Configure protected content

### Homepage Updates

- `src/index.html` - Add new project cards to grid

### Documentation

- `/styleguide.html` - Document new components

## File Organization Rules

### DO NOT EDIT

- `dist/` and `dev-build/` directories (build output)
- `.parcel-cache/` directory (build cache)

### ALWAYS UPDATE TOGETHER

- When adding components: JS file + CSS file + registration in main.js
- When adding case studies: HTML file + homepage grid + images + optimization
- When adding CSS: layer file + import in main.css

### VALIDATE BEFORE COMMIT

- Bundle size limits enforced
- All tests must pass
- Components documented in style guide
