---
inclusion: always
---

# UX Portfolio Product Guidelines

_AI agent guidance for Jason Swetzoff's professional UX portfolio - a performance-first showcase built with modern web standards._

## Critical Constraints (NEVER VIOLATE)

### Performance Budgets

- **JavaScript Bundle**: <30KB gzipped (validate with `npm run test:bundle-size`)
- **CSS Bundle**: <70KB gzipped (validate with `npm run test:bundle-size`)
- **Core Web Vitals**: LCP <2.5s, CLS <0.1, FID <100ms
- **Lighthouse Performance**: ≥90 score required

### Technology Stack (MANDATORY)

- **JavaScript**: Vanilla ES2022 modules only (NO frameworks)
- **Components**: Web Components extending HTMLElement with Shadow DOM
- **CSS**: Cascade Layers architecture with design tokens
- **Accessibility**: WCAG 2.1 AA compliance (test with Playwright)

## Architecture Patterns

### Web Components (REQUIRED)

```javascript
// Component structure
class ComponentName extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
customElements.define('component-name', ComponentName);
```

**Rules:**

- All interactive UI MUST be Web Components
- File structure: `src/js/components/[component-name]/ComponentName.js` + `ComponentName.css`
- Register in `src/js/main.js`
- Custom element names require hyphens: `<site-header>`, `<project-card>`

### CSS Cascade Layers (EXACT ORDER)

```css
@layer reset, base, theme, layout, components, utilities;
```

**Implementation:**

- Import layers in `src/css/main.css` in this exact order
- Design tokens in `src/css/variables.css`
- BEM methodology within Shadow DOM only
- Mobile-first responsive design with `rem` units

### Password Protection System

```javascript
// In protected HTML pages
protectCaseStudy('autodesk-di'); // kebab-case IDs only
```

**Configuration:**

- Edit `src/js/auth/password-config.js` for protected content
- Client-side only, 24-hour localStorage sessions
- NEVER log passwords or expose authentication details

## Code Style Standards

### File Naming Conventions

- **HTML pages**: `kebab-case.html`
- **Case studies**: `project-[company]-[project].html` in `src/projects/`
- **Web Components**: `PascalCase.js` (e.g., `SiteHeader.js`)
- **CSS files**: `kebab-case.css`
- **Custom elements**: Must contain hyphens (e.g., `<site-header>`)

### HTML Requirements

- Semantic elements: `<nav>`, `<main>`, `<section>`, `<article>`
- Proper heading hierarchy: h1 → h2 → h3 (no skipping)
- ARIA labels for interactive elements
- 44px minimum touch targets on mobile
- `loading="lazy"` for below-fold images

### JavaScript Patterns

- ES2022 modules with `import`/`export`
- Web Components extend `HTMLElement`
- Use `querySelector` and `addEventListener`
- Handle errors with try/catch blocks
- Respect `prefers-reduced-motion`

## Content Guidelines

### Writing Style

- Third person for Jason's work: "Jason led the design process..."
- Include quantifiable outcomes: "Increased conversion by 23%"
- Professional UX terminology: user research, personas, wireframes, prototypes
- Case study structure: hero, problem, process, outcomes

### Image Management

- Store in `src/img/projects/[project-name]/` structure
- Run `npm run optimize:images` after adding new images
- WebP format with JPEG/PNG fallbacks required
- Descriptive alt text for accessibility
- Use `loading="lazy"` for images below the fold

### Content Protection Levels

- **Public**: Open portfolio pieces (default)
- **Protected**: Client work requiring `protectCaseStudy("case-id")`

## Quality Assurance Workflow

### Pre-Deployment Validation (MANDATORY)

```bash
npm run test:bundle-size    # MUST pass - validates size limits
npm run test               # ESLint + Stylelint MUST pass
npx playwright test        # Cross-browser + accessibility MUST pass
npm run build && npm run preview  # Test production build
```

### Performance Requirements

- Core Web Vitals within thresholds
- Lighthouse performance score ≥90
- Bundle size limits enforced
- Cross-browser compatibility (Chrome/Edge 63+, Firefox 63+, Safari 10.1+)

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
3. Add images to `src/img/projects/[project-name]/`
4. Run `npm run optimize:images`
5. Add password protection if needed: `protectCaseStudy("project-id")`
6. Validate with full test suite

### CSS Modifications

1. Add styles to appropriate layer in `src/css/[layer]/`
2. Import in `src/css/main.css` maintaining layer order
3. Use design tokens from `src/css/variables.css`
4. Validate bundle size: `npm run test:bundle-size`

## Critical Files Reference

### Key Files to Update

- `src/js/main.js` - Web Component registration
- `src/css/main.css` - CSS layer imports (maintain order)
- `src/js/auth/password-config.js` - Protected content configuration
- `src/index.html` - Homepage project grid
- `/styleguide.html` - Component documentation

### Essential Commands

```bash
# Development
npm run dev                 # Hot reload development server
npm run build              # Production build to dist/
npm run preview            # Test production build

# Quality Assurance (REQUIRED BEFORE DEPLOYMENT)
npm run test               # Linting validation
npm run test:bundle-size   # Size limit validation
npx playwright test        # Full test suite

# Asset Management
npm run optimize:images    # WebP conversion with fallbacks
```

## Deployment Checklist

Before any deployment, ALL items must pass:

- [ ] `npm run test` passes (linting)
- [ ] `npm run test:bundle-size` passes (JS <30KB, CSS <70KB)
- [ ] `npx playwright test` passes (functionality + accessibility)
- [ ] Lighthouse performance score ≥90
- [ ] Password protection tested for protected content
- [ ] Mobile responsiveness validated on actual devices
