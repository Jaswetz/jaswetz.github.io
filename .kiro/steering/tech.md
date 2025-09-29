---
inclusion: always
---

# Technology Stack

## Critical Technology Constraints

**NEVER use frameworks** - This is a vanilla JavaScript project using Web Components only.

### Required Stack

- **JavaScript**: Vanilla ES2022 modules with Web Components
- **CSS**: Cascade Layers architecture (`@layer reset, base, theme, layout, components, utilities`)
- **Build**: Parcel.js 2.15.4 (zero-config bundler)
- **Node.js**: 23.9.0 (check `.nvmrc`)

### Performance Budgets (ENFORCE)

- **JavaScript**: <30KB gzipped
- **CSS**: <70KB gzipped
- **Core Web Vitals**: LCP <2.5s, CLS <0.1, FID <100ms

## Web Components Pattern (MANDATORY)

```javascript
class ComponentName extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
customElements.define('component-name', ComponentName);
```

**Rules:**

- All interactive UI must be Web Components
- Custom element names require hyphens
- Use Shadow DOM for encapsulation
- Register components in `src/js/main.js`

## CSS Architecture (EXACT ORDER)

```css
@layer reset, base, theme, layout, components, utilities;
```

**Implementation:**

- Import layers in `src/css/main.css` in this exact order
- Design tokens in `src/css/variables.css`
- Mobile-first responsive design with `rem` units
- BEM methodology within Shadow DOM only

## Essential Commands

### Pre-Deployment Validation (REQUIRED)

```bash
npm run test:bundle-size    # MUST pass - validates JS <30KB, CSS <70KB
npm run test               # ESLint + Stylelint MUST pass
npx playwright test        # Cross-browser + accessibility MUST pass
```

### Development Workflow

```bash
npm run dev                # Hot reload development server
npm run build              # Production build to dist/
npm run preview            # Test production build
npm run optimize:images    # WebP conversion after adding images
```

## Code Style Requirements

### JavaScript (ES2022 Modules Only)

- Use `import`/`export` syntax
- Web Components extend `HTMLElement`
- Handle errors with try/catch blocks
- Respect `prefers-reduced-motion`
- NO frameworks or libraries

### CSS (Cascade Layers)

- Import layers in exact order in `main.css`
- Use design tokens from `variables.css`
- Mobile-first responsive design
- BEM methodology within Shadow DOM

### HTML Requirements

- Semantic elements: `<nav>`, `<main>`, `<section>`, `<article>`
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels for interactive elements
- `loading="lazy"` for below-fold images

## Image Optimization Pipeline

**ALWAYS run after adding images:**

```bash
npm run optimize:images
```

- Converts to WebP with JPEG/PNG fallbacks
- Stores originals in `src/img/`, optimized in `src/img/webp/`
- Use descriptive alt text for accessibility

## Browser Support Targets

- Chrome/Edge >= 63
- Firefox >= 63
- Safari >= 10.1

## Troubleshooting

### Bundle Size Violations

```bash
npm run test:bundle-size    # Check current sizes
npm run build              # Rebuild and check dist/
```

### Build Failures

- Verify Node.js version matches `.nvmrc`
- Run `npm run clean:all` then `npm install`

### Test Failures

- Update browsers: `npx playwright install`
- Check dev server is running for integration tests
