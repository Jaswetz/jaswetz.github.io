# Technology Stack

_AI agent guidance for technical implementation and tooling_

## Build System & Bundler

- **Parcel.js 2.15.4**: Zero-config bundler handling HTML, CSS, JS, and assets
- **Node.js 23.9.0**: Runtime environment (see `.nvmrc`)
- **npm**: Package manager with locked dependencies via `package-lock.json`

## Core Technologies

- **HTML5**: Semantic markup with accessibility focus
- **CSS3**: Modern features including CSS Grid, Flexbox, and Cascade Layers
- **Vanilla JavaScript (ES2022)**: No frameworks, native Web Components
- **Web Components**: Custom elements with Shadow DOM encapsulation

## CSS Architecture

- **Cascade Layers**: Explicit cascade control (`reset → base → theme → layout → components → utilities`)
- **CSS Custom Properties**: Design tokens in `variables.css`
- **BEM-style**: Component naming within Shadow DOM
- **Mobile-first**: Responsive breakpoints using `rem` units

## Development Tools

- **ESLint**: JavaScript linting with ES2022 module support
- **Stylelint**: CSS linting with standard configuration
- **Prettier**: Code formatting (`.prettierrc.json`)
- **Playwright**: End-to-end testing across browsers

## Image Optimization

- **Sharp**: Node.js image processing for optimization
- **WebP Conversion**: Automatic modern format generation
- **Multiple Formats**: Fallback support for older browsers

## Analytics & Monitoring

- **Google Analytics 4**: Traffic and conversion tracking
- **Microsoft Clarity**: Heatmaps and session recordings
- **Lighthouse**: Performance monitoring and Core Web Vitals

## Common Commands

### Development

```bash
npm run dev              # Start dev server with hot reload
npm run build           # Production build to dist/
npm run preview         # Build and serve for testing
```

### Quality Assurance

```bash
npm run test            # Run linting (ESLint + Stylelint)
npm run lint:fix        # Auto-fix JavaScript issues
npm run stylelint:fix   # Auto-fix CSS issues
```

### Testing

```bash
npx playwright test     # Run end-to-end tests
npm run test:accessibility  # Axe accessibility testing
```

### Optimization

```bash
npm run optimize:images # Optimize and convert images to WebP
npm run test:bundle-size    # Check bundle size limits
```

### Cleanup

```bash
npm run clean          # Remove build artifacts
npm run clean:all      # Full cleanup including node_modules
```

## Browser Support

- Chrome >= 63
- Firefox >= 63
- Safari >= 10.1
- Edge >= 79

## Deployment

- **GitHub Pages**: Static hosting via GitHub Actions
- **Static Output**: Self-contained `dist/` directory
- **No Server Dependencies**: Pure client-side application

## Technology Selection Rationale

### Web Standards Approach

- **Performance**: Direct browser APIs are faster than abstraction layers
- **Compatibility**: Native features work across all modern browsers
- **Maintainability**: Less dependency management and update cycles
- **Future-proofing**: Web standards have longer support lifecycles

### No Framework Decision

- **Bundle Size**: Eliminates framework overhead (target: <30KB JS gzipped)
- **Learning Curve**: No framework-specific knowledge required
- **Flexibility**: Direct control over implementation details
- **Performance**: No framework runtime overhead

## Development Environment Setup

### Prerequisites

- Node.js 23.9.0 (use `.nvmrc` for version management)
- npm (comes with Node.js)
- Modern web browser for testing

### Local Development

1. Clone repository
2. Run `npm install`
3. Run `npm run dev` for development server
4. Open `http://localhost:1234` in browser

### Production Build

1. Run `npm run build`
2. Deploy `dist/` directory to static hosting
3. Test production build with `npm run preview`

## Tooling Configuration

### ESLint Configuration

- ES2022 module support
- Web Components compatibility
- Accessibility linting rules
- Import/export validation

### Stylelint Configuration

- CSS Cascade Layers support
- Custom property validation
- BEM methodology enforcement
- Performance-related rules

### Parcel Configuration

- Zero-config setup
- Automatic asset optimization
- Hot module replacement
- Tree shaking and minification

## Performance Optimization

### Bundle Optimization

- **Tree Shaking**: Unused code elimination
- **Minification**: JavaScript and CSS compression
- **Asset Optimization**: Image compression and format conversion
- **Code Splitting**: Separate bundles for different pages

### Image Strategy

- **WebP Conversion**: Modern format with fallbacks
- **Responsive Images**: Multiple sizes for different viewports
- **Lazy Loading**: Images loaded as needed
- **Optimization Pipeline**: Sharp-based processing

### Caching Strategy

- **Static Assets**: Long-term caching with hash-based filenames
- **HTML**: Short-term caching for content updates
- **Service Worker**: Considered for future implementation

## Quality Assurance

### Automated Testing

- **Security**: Dependency vulnerability scanning
- **Code Quality**: ESLint and Stylelint
- **Accessibility**: axe-core automated testing
- **Performance**: Lighthouse Core Web Vitals
- **Cross-browser**: Playwright end-to-end tests
- **Bundle Size**: Automated size monitoring

### Performance Budgets

- **JavaScript**: ≤30KB gzipped
- **CSS**: ≤70KB gzipped
- **Lighthouse Score**: ≥90 performance
- **Core Web Vitals**: LCP <2.5s, CLS <0.1, FID <100ms

## Troubleshooting

### Common Issues

#### Build Failures

- Check Node.js version matches `.nvmrc`
- Clear node_modules: `npm run clean:all`
- Verify all dependencies are installed

#### Performance Issues

- Run bundle size check: `npm run test:bundle-size`
- Optimize images: `npm run optimize:images`
- Check Lighthouse scores

#### Testing Failures

- Update Playwright browsers: `npx playwright install`
- Check for missing dependencies
- Verify server is running for integration tests

## Related Documentation

- **AGENTS.md**: Main AI agent instructions
- **Product Guidelines**: See `.kiro/steering/product.md`
- **Project Structure**: See `.kiro/steering/structure.md`
- **Architecture**: See `Docs/ARCHITECTURE.md`
- **Testing**: See `Docs/TESTING.md`

---

_This file follows the agents.md format for AI coding agent guidance._
