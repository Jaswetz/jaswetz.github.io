# Project Structure

This document outlines the complete file structure and architectural patterns for Jason Swetzoff's UX Portfolio website.

## Root Directory

```
├── src/                    # Source files
├── dist/                   # Production build output
├── dev-build/             # Development build output
├── tests/                 # Playwright test files
├── scripts/               # Build and optimization scripts
├── Docs/                  # Project documentation
├── public/                # Static assets (robots.txt, headers)
├── .kiro/                 # Kiro AI assistant configuration
│   ├── hooks/             # Agent hooks for automation
│   ├── specs/             # Feature specifications
│   └── steering/          # AI guidance rules
└── Configuration files    # Package.json, build configs, etc.
```

## Source Structure (`src/`)

### HTML Pages

```
src/
├── index.html             # Homepage with hero and featured projects
├── about.html             # About page with professional background
├── contact.html           # Contact page with LinkedIn integration
├── work.html              # Work overview with project grid
├── styleguide.html        # Living style guide for components
├── 404.html               # Error page
├── lightbox-test.html     # Component testing page
└── projects/              # Case study pages
    ├── project-adsk-notification.html    # Autodesk messaging case study
    ├── project-autodesk-di.html          # Autodesk DI case study (protected)
    └── project-intel-lfc.html            # Intel LFC case study
```

### CSS Architecture (Cascade Layers)

```
src/css/
├── main.css               # Entry point with @layer imports and order
├── variables.css          # Design tokens (CSS custom properties)
├── base/                  # Foundation styles
│   ├── reset.css         # CSS reset
│   ├── global.css        # Global styles
│   └── typography.css    # Typography system
├── theme/                 # Theme definitions
│   └── default-theme.css # Default color scheme and overrides
├── layout/                # Page-level layout systems (deprecated - use utils/grid-system.css)
├── components/            # Reusable UI component styles
│   ├── accessibility.css # A11y utilities
│   ├── badges.css        # Badge components
│   ├── buttons.css       # Button styles
│   ├── cards.css         # Project cards and content cards
│   ├── error-page.css    # 404 page styles
│   ├── forms.css         # Form components
│   ├── form-*.css        # Specific form element styles
│   ├── heroes.css        # Hero section styles
│   ├── icons.css         # Icon styles
│   ├── images.css        # Image handling and optimization
│   ├── lists.css         # List styles
│   ├── logo-2d.css       # Interactive 2D logo animation
│   ├── main-content.css  # Main content area
│   ├── navigation.css    # Navigation components
│   ├── password-protection.css # Password prompt styling
│   ├── sections.css      # Section layouts
│   └── tags.css          # Tag components
├── pages/                 # Page-specific styles
│   ├── page-about.css    # About page specific styles
│   ├── page-autodesk-di.css # Autodesk DI case study styles
│   ├── page-index/       # Homepage section styles
│   │   ├── index-section-about.css
│   │   ├── index-section-companies.css
│   │   ├── index-section-featured-projects.css
│   │   └── index-section-quotes.css
│   └── projects.css      # General project page styles
├── utils/                 # Utility classes and helpers
│   ├── flexbox.css       # Flexbox utilities
│   ├── grid-system.css   # Comprehensive grid and layout system
│   ├── layout.css        # Layout utilities
│   ├── media-queries.css # Responsive breakpoint system
│   ├── spacing.css       # Margin and padding utilities
│   └── typography.css    # Typography utilities
└── debug/                 # Development debugging styles
    ├── debug.css         # Layout debugging outlines
    └── vertical-rhythm.css # Typography baseline grid
```

### JavaScript Architecture

```
src/js/
├── main.js                # Entry point and component registration
├── analytics/             # Analytics configuration
│   └── index.js          # Google Analytics 4 setup
├── analytics-legacy.js    # Legacy analytics (deprecated)
├── analytics-refactored.js # Refactored analytics (deprecated)
├── clarity-config.js      # Microsoft Clarity setup
├── browser-support.js     # Browser compatibility checks
├── event-listeners.js     # Global event handlers
├── lazy-loading.js        # Image lazy loading
├── password-protection-init.js # Password protection initialization
├── smart-image-loader.js  # Intelligent image loading
├── auth/                  # Password protection system
│   ├── password-config.js # Protected case studies configuration
│   └── password-protection.js # Core protection logic
└── components/            # Web Components
    ├── site-header/
    │   ├── SiteHeader.js  # Site header component
    │   └── SiteHeader.css # Header styles
    ├── site-footer/
    │   ├── SiteFooter.js  # Site footer component
    │   └── SiteFooter.css # Footer styles
    ├── sidebar-navigation/
    │   ├── SidebarNavigation.js # Sidebar nav component
    │   └── SidebarNavigation.css # Sidebar styles
    └── ImageLightbox/
        ├── ImageLightbox.js # Image lightbox component
        └── ImageLightbox.css # Lightbox styles
```

### Assets Organization

```
src/
├── assets/                # Static assets
│   ├── favicons/         # Favicon variants (16x16, 32x32, 96x96, apple-icon)
│   └── pdf/              # Resume and documents
├── img/                   # Images (original formats)
│   ├── webp/             # WebP optimized versions
│   ├── projects/         # Project-specific images organized by project
│   │   ├── autodesk/     # Autodesk project images
│   │   ├── dc/           # DC project images
│   │   └── househappy/   # HouseHappy project images
│   ├── icons/            # Icon assets
│   └── logos/            # Company logos
├── img-backup/            # Backup of original images
└── svg/                   # SVG graphics and logos
    ├── logo.svg          # Main logo
    └── logos/            # Company logos in SVG format
```

## Naming Conventions

### Files & Folders

- **kebab-case**: All files and folders (`project-page.html`, `site-header/`)
- **PascalCase**: Web Component JavaScript files (`SiteHeader.js`)
- **Descriptive names**: Images and assets (`profile-picture-large.jpg`)

### Web Components

- **Custom Elements**: Must contain hyphen (`<site-header>`, `<project-card>`)
- **File Structure**: Component folder with JS and CSS files
- **Registration**: Components registered in `main.js`

### CSS Classes

- **Global Styles**: BEM methodology (`card__content`, `button--primary`)
- **Component Styles**: BEM-style within Shadow DOM (`:host`, `.nav-list`)
- **Utility Classes**: Descriptive names (`grid-cols-2`, `gap-3`)

## Key Architectural Patterns

### Web Components Structure

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

### CSS Layer Organization

```css
/* main.css */
@import url("./variables.css");
@import url("./base/reset.css") layer(reset);
@import url("./components/cards.css") layer(components);
@import url("./utils/spacing.css") layer(utilities);

@layer reset, base, theme, layout, components, utilities, debug;
```

### Password Protection Integration

```javascript
// In protected case study pages
import { protectCaseStudy } from "../js/password-protection-init.js";
protectCaseStudy("case-study-id");
```

## Development Workflow

### File Creation Guidelines

1. **HTML Pages**: Add to `src/` root, update navigation in components
2. **Components**: Create folder in `src/js/components/` with JS and CSS
3. **Styles**: Add to appropriate layer folder, import in `main.css`
4. **Images**: Add to `src/img/`, run optimization script
5. **Case Studies**: Follow naming convention `project-[company]-[project].html`

### Component Development

1. Create component folder with PascalCase name
2. Implement JavaScript class extending HTMLElement
3. Create separate CSS file for styles
4. Register component in `main.js`
5. Add to style guide for documentation

### Testing Structure

```
tests/
├── homepage.spec.js       # Homepage functionality
├── accessibility.spec.js  # A11y compliance (WCAG 2.1 AA)
├── performance.spec.js    # Core Web Vitals
├── project-pages.spec.js  # Case study pages
└── web-components.spec.js # Component functionality
```

## Build Output

### Development Build (`dev-build/`)

- Fast, unoptimized build for development
- Source maps enabled
- Hot reload support

### Production Build (`dist/`)

- Optimized and minified assets
- WebP image conversion
- Bundle size validation
- Cache-busting hashes

## Performance Budgets

### Bundle Size Limits

- **JavaScript**: Maximum 30KB gzipped
- **CSS**: Maximum 70KB gzipped

### Core Web Vitals Targets

- **Largest Contentful Paint (LCP)**: <2.5s
- **Cumulative Layout Shift (CLS)**: <0.1
- **First Input Delay (FID)**: <100ms

## Browser Support

- **Chrome**: >= 63
- **Firefox**: >= 63
- **Safari**: >= 10.1
- **Edge**: >= 79

Progressive enhancement for older browsers with graceful degradation.

## Security & Privacy

### Password Protection

- Client-side only (no server dependencies)
- Session management with localStorage
- 24-hour authentication sessions
- Configurable per case study

### Analytics

- Google Analytics 4 with privacy settings
- Microsoft Clarity with PII masking
- GDPR-compliant configuration
- No tracking of password-protected content

## Documentation

- **Living Style Guide**: `/styleguide.html` for component documentation
- **API Documentation**: Inline JSDoc comments
- **Testing Guide**: `Docs/TESTING.md`
- **Password Protection**: `Docs/PASSWORD_PROTECTION.md`
- **Asset Optimization**: `Docs/ASSET_OPTIMIZATION_GUIDE.md`
