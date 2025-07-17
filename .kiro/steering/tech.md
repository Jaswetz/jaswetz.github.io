# Technology Stack

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

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build           # Production build to dist/
npm run preview         # Build and serve for testing

# Quality Assurance
npm run test            # Run linting (ESLint + Stylelint)
npm run lint:fix        # Auto-fix JavaScript issues
npm run stylelint:fix   # Auto-fix CSS issues

# Testing
npx playwright test     # Run end-to-end tests
npm run test:accessibility  # Axe accessibility testing

# Optimization
npm run optimize:images # Optimize and convert images to WebP
npm run test:bundle-size    # Check bundle size limits

# Cleanup
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
