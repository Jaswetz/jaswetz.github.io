# Project Structure

## Root Directory

```
├── src/                    # Source files
├── dist/                   # Production build output
├── dev-build/             # Development build output
├── tests/                 # Playwright test files
├── scripts/               # Build and optimization scripts
├── Docs/                  # Project documentation
└── public/                # Static assets (robots.txt, headers)
```

## Source Structure (`src/`)

### HTML Pages

```
src/
├── index.html             # Homepage
├── about.html             # About page
├── contact.html           # Contact page
├── work.html              # Work overview
├── styleguide.html        # Living style guide
└── projects/              # Case study pages
    ├── project-adsk-notification.html
    ├── project-autodesk-di.html
    └── project-intel-lfc.html
```

### CSS Architecture

```
src/css/
├── main.css               # Entry point with @layer imports
├── variables.css          # Design tokens (CSS custom properties)
├── base/                  # Reset, global styles, typography
├── theme/                 # Theme definitions and overrides
├── layout/                # Page-level layout systems
├── components/            # Reusable UI component styles
├── pages/                 # Page-specific styles
├── utils/                 # Utility classes and helpers
└── debug/                 # Development debugging styles
```

### JavaScript Architecture

```
src/js/
├── main.js                # Entry point and component registration
├── analytics.js           # Google Analytics configuration
├── clarity-config.js      # Microsoft Clarity setup
├── components/            # Web Components
│   ├── site-header/
│   │   ├── SiteHeader.js
│   │   └── SiteHeader.css
│   ├── site-footer/
│   └── sidebar-navigation/
└── auth/                  # Password protection system
    ├── password-config.js
    ├── password-protection.js
    └── password-protection-init.js
```

### Assets Organization

```
src/
├── assets/                # Static assets
│   ├── favicons/         # Favicon variants
│   └── pdf/              # Resume and documents
├── img/                   # Images (original formats)
│   ├── webp/             # WebP optimized versions
│   ├── projects/         # Project-specific images
│   └── icons/            # Icon assets
└── svg/                   # SVG graphics and logos
```

## Naming Conventions

### Files & Folders

- **kebab-case**: All files and folders (`project-page.html`, `site-header/`)
- **PascalCase**: Web Component JavaScript files (`SiteHeader.js`)

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

@layer reset, base, theme, layout, components, utilities;
```

### Password Protection Integration

```javascript
// In protected case study pages
import { protectCaseStudy } from "../js/password-protection-init.js";
protectCaseStudy("case-study-id");
```

## Development Workflow

### File Creation

1. **HTML Pages**: Add to `src/` root, update navigation
2. **Components**: Create folder in `src/js/components/` with JS and CSS
3. **Styles**: Add to appropriate layer folder, import in `main.css`
4. **Images**: Add to `src/img/`, run optimization script

### Testing Structure

```
tests/
├── homepage.spec.js       # Homepage functionality
├── accessibility.spec.js  # A11y compliance
├── performance.spec.js    # Core Web Vitals
└── project-pages.spec.js  # Case study pages
```

## Build Output

- **dist/**: Production-ready static files
- **dev-build/**: Development build for testing
- **Assets**: Automatically copied and optimized during build
