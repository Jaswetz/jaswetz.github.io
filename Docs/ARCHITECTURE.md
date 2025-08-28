# Architecture Overview

This document provides a comprehensive overview of the technical architecture and design decisions for Jason Swetzoff's UX Portfolio website.

## Core Architecture Principles

### 1. Performance-First Design

- **Bundle Size Limits**: JavaScript <30KB, CSS <70KB (gzipped)
- **Core Web Vitals**: LCP <2.5s, CLS <0.1, FID <100ms
- **Image Optimization**: WebP with fallbacks, lazy loading
- **Minimal Dependencies**: Vanilla JavaScript, no frameworks

### 2. Accessibility Compliance

- **WCAG 2.1 AA Standards**: Required for all features
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Reduced Motion**: Respects `prefers-reduced-motion`

### 3. Progressive Enhancement

- **Mobile-First**: Responsive design starting from mobile
- **Browser Support**: Chrome 63+, Firefox 63+, Safari 10.1+, Edge 79+
- **Graceful Degradation**: Fallbacks for older browsers
- **No JavaScript Dependency**: Core content accessible without JS

## Technology Stack

### Build System

- **Parcel.js 2.15.4**: Zero-config bundler
- **Node.js 23.9.0**: Runtime environment
- **npm**: Package management with locked dependencies

### Frontend Technologies

- **HTML5**: Semantic markup with accessibility focus
- **CSS3**: Modern features including Grid, Flexbox, Cascade Layers
- **Vanilla JavaScript (ES2022)**: No frameworks
- **Web Components**: Custom elements with Shadow DOM

### Development Tools

- **ESLint**: JavaScript linting
- **Stylelint**: CSS linting
- **Prettier**: Code formatting
- **Playwright**: End-to-end testing

## CSS Architecture

### Cascade Layers Strategy

The project uses CSS Cascade Layers for explicit cascade control:

```css
@layer reset, base, theme, layout, components, utilities, debug;
```

**Layer Purposes:**

- **Reset**: CSS reset and normalization
- **Base**: Global styles and typography
- **Theme**: Color schemes and design tokens
- **Layout**: Page-level layout systems
- **Components**: UI component styles
- **Utilities**: Override utilities and helpers
- **Debug**: Development debugging styles

### Design Token System

- **CSS Custom Properties**: Centralized in `variables.css`
- **Responsive Breakpoints**: `rem`-based mobile-first system
- **Color System**: Semantic color tokens with theme support
- **Typography Scale**: Consistent font sizes and line heights

### Component Styling

- **Shadow DOM Encapsulation**: Prevents style leakage
- **BEM-style Classes**: Within component scope
- **Global Token Consumption**: Components use global design tokens
- **Separate CSS Files**: Each component has its own stylesheet

## JavaScript Architecture

### Web Components Pattern

All interactive UI elements are implemented as Web Components:

```javascript
class ComponentName extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div>Component HTML</div>
    `;
  }
}
```

### Component Registration

Components are registered in `main.js`:

```javascript
if (window.customElements) {
  if (!customElements.get("site-header")) {
    customElements.define("site-header", SiteHeader);
  }
}
```

### Module System

- **ES6 Modules**: Native module imports/exports
- **Dynamic Imports**: For code splitting where needed
- **Tree Shaking**: Unused code elimination via Parcel

## Security Architecture

### Password Protection System

Client-side protection for confidential case studies:

**Components:**

- `password-config.js`: Centralized configuration
- `password-protection.js`: Core protection logic
- `password-protection-init.js`: Integration helpers

**Features:**

- Session management with localStorage
- 24-hour authentication sessions
- User-friendly password prompts
- Configurable per case study

**Security Considerations:**

- Client-side only (no server dependencies)
- Suitable for portfolio access control
- Not for truly sensitive data protection

### Privacy & Analytics

- **Google Analytics 4**: Traffic analysis with privacy settings
- **Microsoft Clarity**: User behavior insights with PII masking
- **GDPR Compliance**: Anonymized IPs, consent-aware
- **No Tracking**: Password-protected content excluded

## Performance Architecture

### Bundle Optimization

- **Code Splitting**: Separate bundles for different pages
- **Tree Shaking**: Unused code elimination
- **Minification**: JavaScript and CSS compression
- **Asset Optimization**: Image compression and format conversion

### Image Strategy

- **WebP Conversion**: Modern format with fallbacks
- **Responsive Images**: Multiple sizes for different viewports
- **Lazy Loading**: Images loaded as needed
- **Optimization Pipeline**: Sharp-based processing

### Caching Strategy

- **Static Assets**: Long-term caching with hash-based filenames
- **HTML**: Short-term caching for content updates
- **Service Worker**: Considered for future implementation

## Testing Architecture

### Multi-Layer Testing

1. **Security**: Dependency vulnerability scanning
2. **Code Quality**: ESLint and Stylelint
3. **Accessibility**: axe-core automated testing
4. **Performance**: Lighthouse Core Web Vitals
5. **Cross-Browser**: Playwright end-to-end tests
6. **Bundle Size**: Automated size monitoring

### Test Environment

- **Local Testing**: `./test-local.sh` comprehensive suite
- **CI/CD Pipeline**: GitHub Actions automated testing
- **Development vs Production**: Separate build outputs

## Deployment Architecture

### Static Site Generation

- **Build Output**: Self-contained `dist/` directory
- **GitHub Pages**: Static hosting via GitHub Actions
- **No Server Dependencies**: Pure client-side application
- **CDN**: GitHub's global CDN for fast delivery

### Build Pipeline

1. **Development**: Fast builds with source maps
2. **Production**: Optimized builds with compression
3. **Testing**: Automated quality checks
4. **Deployment**: Automated GitHub Pages deployment

## Scalability Considerations

### Component Reusability

- **Modular Design**: Self-contained Web Components
- **Style Encapsulation**: No global style conflicts
- **Configuration**: Props-based component configuration
- **Documentation**: Living style guide at `/styleguide.html`

### Content Management

- **File-Based**: HTML files for case studies
- **Asset Organization**: Structured image directories
- **Protection System**: Configurable password protection
- **SEO Optimization**: Semantic HTML and meta tags

### Future Extensibility

- **Modern Standards**: Built on web standards for longevity
- **Minimal Dependencies**: Reduces maintenance burden
- **Modular Architecture**: Easy to extend or modify
- **Documentation**: Comprehensive guides for maintenance

## Browser Compatibility

### Support Matrix

- **Chrome**: >= 63 (Web Components, ES2022)
- **Firefox**: >= 63 (Custom Elements, CSS Grid)
- **Safari**: >= 10.1 (Shadow DOM, CSS Custom Properties)
- **Edge**: >= 79 (Chromium-based features)

### Progressive Enhancement

- **Core Functionality**: Works without JavaScript
- **Enhanced Experience**: JavaScript adds interactivity
- **Fallback Strategies**: Graceful degradation for older browsers
- **Feature Detection**: Runtime capability checking

## Monitoring & Analytics

### Performance Monitoring

- **Core Web Vitals**: Automated Lighthouse testing
- **Bundle Size**: Continuous monitoring with thresholds
- **Load Times**: Real user monitoring via analytics
- **Error Tracking**: Console error monitoring

### User Analytics

- **Traffic Analysis**: Google Analytics 4
- **Behavior Insights**: Microsoft Clarity heatmaps
- **Conversion Tracking**: Project engagement metrics
- **Privacy Compliant**: GDPR-aware configuration

This architecture provides a solid foundation for a professional portfolio website that prioritizes performance, accessibility, and maintainability while supporting the specific needs of showcasing UX design work.
