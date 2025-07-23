# Project Structure Documentation

## Overview

This document provides a comprehensive overview of the project structure, focusing on the organization of files, components, and architectural decisions that support the UX portfolio website.

## Root Directory Structure

```
├── .kiro/                     # Kiro AI assistant configuration
│   ├── specs/                 # Feature specifications and requirements
│   │   └── case-study-navigation-fix/  # Navigation enhancement specs
│   └── steering/              # AI assistant steering rules
├── src/                       # Source files (main development directory)
├── dist/                      # Production build output (generated)
├── dev-build/                 # Development build output (generated)
├── tests/                     # Playwright end-to-end tests
├── scripts/                   # Build and optimization scripts
├── Docs/                      # Project documentation
├── public/                    # Static assets (robots.txt, headers)
├── node_modules/              # Dependencies (generated)
└── Configuration files        # Package.json, build configs, etc.
```

## Source Directory (`src/`)

### HTML Pages Structure

```
src/
├── index.html                 # Homepage with animated logo
├── about.html                 # About page with professional background
├── contact.html               # Contact information and links
├── work.html                  # Work overview and project grid
├── styleguide.html           # Living style guide and component demo
├── 404.html                  # Custom 404 error page
└── projects/                 # Case study pages
    ├── project-adsk-notification.html    # Autodesk notification system
    ├── project-autodesk-di.html         # Autodesk device independence
    └── project-intel-lfc.html           # Intel LFC case study
```

### CSS Architecture

The CSS follows a layered architecture using CSS Cascade Layers for explicit cascade control:

```
src/css/
├── main.css                  # Entry point with @layer imports
├── variables.css             # Design tokens (CSS custom properties)
├── base/                     # Foundation styles
│   ├── reset.css            # CSS reset and normalization
│   ├── global.css           # Global base styles
│   └── typography.css       # Typography system
├── theme/                    # Theme definitions
│   └── default-theme.css    # Default color scheme and theming
├── layout/                   # Page-level layout systems
├── components/               # Reusable UI component styles
│   ├── navigation.css       # Navigation component styles
│   ├── cards.css           # Card component styles
│   ├── buttons.css         # Button component styles
│   ├── forms.css           # Form component styles
│   ├── heroes.css          # Hero section styles
│   ├── password-protection.css  # Password protection UI
│   └── [other components]
├── pages/                    # Page-specific styles
│   ├── page-index/         # Homepage specific styles
│   ├── page-about.css      # About page styles
│   ├── projects.css        # Project pages styles
│   └── page-autodesk-di.css # Specific case study styles
├── utils/                    # Utility classes and helpers
│   ├── grid-system.css     # Grid and layout utilities
│   ├── spacing.css         # Spacing utilities
│   ├── typography.css      # Typography utilities
│   ├── flexbox.css         # Flexbox utilities
│   └── media-queries.css   # Responsive breakpoint utilities
└── debug/                    # Development debugging styles
    ├── debug.css           # Layout debugging helpers
    └── vertical-rhythm.css  # Typography rhythm debugging
```

### JavaScript Architecture

The JavaScript follows a modular, component-based architecture using native Web Components:

```
src/js/
├── main.js                   # Entry point and component registration
├── index.js                 # Main application initialization
├── analytics/                # Analytics and tracking
│   ├── analytics-refactored.js    # Google Analytics 4 setup
│   └── analytics-legacy.js       # Legacy analytics (deprecated)
├── auth/                     # Password protection system
│   ├── password-config.js    # Centralized password configuration
│   ├── password-protection.js     # Core protection logic
│   └── password-protection-init.js # Integration helpers
├── components/               # Web Components
│   ├── site-header/         # Site header component
│   │   ├── SiteHeader.js    # Component logic
│   │   └── SiteHeader.css   # Component styles
│   ├── site-footer/         # Site footer component
│   │   ├── SiteFooter.js
│   │   └── SiteFooter.css
│   └── sidebar-navigation/   # Sidebar navigation component
│       ├── SidebarNavigation.js  # Scroll spy and navigation logic
│       └── SidebarNavigation.css # Navigation component styles
├── clarity-config.js         # Microsoft Clarity configuration
├── browser-support.js        # Browser compatibility checks
├── event-listeners.js        # Global event handling
├── lazy-loading.js          # Image lazy loading implementation
└── smart-image-loader.js    # Intelligent image loading system
```

### Assets Organization

```
src/
├── assets/                   # Static assets
│   ├── favicons/            # Favicon variants (16x16, 32x32, etc.)
│   └── pdf/                 # Resume and document downloads
├── img/                     # Images (original formats)
│   ├── webp/               # WebP optimized versions
│   ├── projects/           # Project-specific images organized by case study
│   │   ├── autodesk/       # Autodesk case study images
│   │   ├── autodesk-DI/    # Device Independence case study
│   │   ├── autodesk-messaging/  # Notification system case study
│   │   └── [other projects]
│   ├── icons/              # Icon assets
│   └── logos/              # Logo and brand assets
└── svg/                     # SVG graphics and logos
    ├── logo.svg            # Main portfolio logo
    └── logos/              # Client and company logos
```

## Component Architecture

### Web Components Structure

Each Web Component follows a consistent structure:

```javascript
class ComponentName extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="component-content">
        <!-- Component HTML -->
      </div>
    `;
    this.setupEventListeners();
  }

  disconnectedCallback() {
    // Cleanup logic
  }
}

customElements.define("component-name", ComponentName);
```

### Navigation System Architecture

The navigation system has two implementations:

1. **SidebarNavigation Component**: Reusable Web Component for general navigation
2. **Inline Scripts**: Enhanced implementations for case study pages with specific requirements

#### Case Study Navigation Features

- Dynamic offset calculation for proper scroll positioning
- Enhanced section detection for various HTML structures
- Intersection Observer API for performance
- Cross-browser compatibility with fallbacks

## Build System

### Parcel.js Configuration

The project uses Parcel.js 2.15.4 as the zero-config bundler:

- **Entry Points**: All HTML files in `src/` directory
- **Asset Processing**: Automatic optimization of images, CSS, and JavaScript
- **Development Server**: Hot reload and live development
- **Production Build**: Minification, tree-shaking, and optimization

### Build Outputs

```
dist/                         # Production build
├── index.html               # Optimized HTML files
├── *.css                    # Minified and bundled CSS
├── *.js                     # Minified and bundled JavaScript
└── assets/                  # Optimized images and static assets

dev-build/                   # Development build
├── [same structure as dist but unminified]
```

## Testing Structure

```
tests/
├── accessibility.spec.js     # WCAG compliance and a11y testing
├── homepage.spec.js         # Homepage functionality tests
├── performance.spec.js      # Core Web Vitals and performance
├── project-pages.spec.js    # Case study page functionality
├── web-components.spec.js   # Web Component integration tests
└── sidebar-navigation-test.js # Navigation system specific tests
```

## Configuration Files

### Key Configuration Files

- `package.json` - Dependencies and scripts
- `package-lock.json` - Locked dependency versions
- `.nvmrc` - Node.js version specification (23.9.0)
- `eslint.config.js` - JavaScript linting configuration
- `.stylelintrc.json` - CSS linting configuration
- `.prettierrc.json` - Code formatting configuration
- `playwright.config.js` - End-to-end testing configuration
- `.parcelrc` - Parcel bundler configuration
- `jsconfig.json` - JavaScript project configuration

## Development Workflow

### File Creation Guidelines

1. **HTML Pages**: Add to `src/` root, update navigation components
2. **Web Components**: Create folder in `src/js/components/` with JS and CSS files
3. **Styles**: Add to appropriate CSS layer folder, import in `main.css`
4. **Images**: Add to `src/img/`, run optimization scripts
5. **Documentation**: Update relevant files in `Docs/` and root-level docs

### Naming Conventions

- **Files & Folders**: kebab-case (`project-page.html`, `site-header/`)
- **Web Components**: PascalCase for JS files (`SiteHeader.js`)
- **Custom Elements**: Must contain hyphen (`<site-header>`, `<project-card>`)
- **CSS Classes**: BEM methodology for global styles, BEM-style within Shadow DOM

## Security & Privacy

### Password Protection System

The project includes a modular client-side password protection system:

```
src/js/auth/
├── password-config.js        # Centralized configuration
├── password-protection.js    # Core protection logic
└── password-protection-init.js # Integration helpers
```

**Protected Case Studies**:

- `project-autodesk-di.html` - Enterprise design work requiring confidentiality

### Analytics Integration

- **Google Analytics 4**: Traffic analysis and conversion tracking
- **Microsoft Clarity**: User behavior insights and heatmaps
- **Privacy Compliance**: GDPR-compliant configuration with IP anonymization

## Performance Optimizations

### Bundle Size Management

- **JavaScript**: 29.94KB (monitored and optimized)
- **CSS**: 66.43KB (layered architecture for efficient loading)
- **Images**: WebP conversion with fallbacks
- **Lazy Loading**: Implemented for images and non-critical content

### Core Web Vitals Focus

- **LCP (Largest Contentful Paint)**: Optimized through image optimization and critical CSS
- **FID/INP (First Input Delay/Interaction to Next Paint)**: Minimized JavaScript execution
- **CLS (Cumulative Layout Shift)**: Prevented through proper image sizing and layout stability

## Current Development Focus

### Case Study Navigation Enhancement

**Status**: 🔄 **Active Development**

The sidebar navigation system is being enhanced to fix scroll spy highlighting and positioning issues:

- **Enhanced Section Detection**: Improving detection of various HTML structures (`section[id]`, `h2[id]`) - **In Progress**
- **Dynamic Offset Calculation**: Implementing proper scroll positioning that accounts for header height - **Planned**
- **Cross-Browser Compatibility**: Ensuring consistent behavior across all modern browsers - **Planned**
- **Performance Optimization**: Using Intersection Observer API with throttled scroll events - **Planned**

**Implementation Progress**:

- ✅ Task 1: Enhanced section detection logic - **In Progress**
- ⏳ Tasks 2-8: Remaining implementation tasks - **Planned**

**Implementation Location**:

- Specifications: `.kiro/specs/case-study-navigation-fix/`
- Component: `src/js/components/sidebar-navigation/SidebarNavigation.js`
- Tests: `src/js/components/sidebar-navigation/SidebarNavigation.test.js`

## Future Architecture Considerations

### Planned Enhancements

- Unified navigation component system across all pages
- Enhanced accessibility features and ARIA implementation
- Progressive Web App (PWA) capabilities
- Advanced image optimization with responsive images

### Scalability Considerations

- Component library expansion for reusable UI elements
- Enhanced build pipeline with advanced optimization
- Improved testing coverage with visual regression testing
- Content management system integration possibilities

## Related Documentation

- `README.md` - Project overview and quick start guide
- `SIDEBAR_NAVIGATION.md` - Detailed navigation system documentation
- `Docs/PASSWORD_PROTECTION.md` - Password protection system guide
- `Docs/TESTING.md` - Testing strategy and procedures
- `.kiro/specs/` - Feature specifications and requirements
