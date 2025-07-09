# Project Naming Conventions

## Folders

Use `kebab-case` for folder names.

- Example: `src/content/project-archive`
- Example: `src/js/utility-functions`

## HTML Files

Use `kebab-case` for HTML file names.

- Example: `about-us.html`
- Example: `contact-form.html`

## CSS Files

Use `kebab-case` for CSS file names.

- Example: `main-styles.css`
- Example: `component-header.css`

## JavaScript Files

Use `kebab-case` for general script files. `camelCase` can be used for modules or class files if preferred.

- Example (kebab-case): `api-handler.js`
- Example (kebab-case): `user-profile.js`
- Example (camelCase): `UserProfile.js` (for a class)

# Development Environment & Tooling

This project uses `npm` for package management and Parcel.js as the bundler and development server.

## Prerequisites

- Node.js and npm: Make sure you have Node.js and npm installed. You can download them from [https://nodejs.org/](https://nodejs.org/).

## Build Optimizations

- **Browser Targets**: The `package.json` file includes a `"browserslist"` field. This configuration informs Parcel (and other tools) about the target browsers for the project. Parcel uses this to determine the level of JavaScript transpilation needed and to generate [differential bundling](https://parceljs.org/features/production/#differential-bundling), serving modern code to modern browsers and fallbacks to older ones, optimizing load times and performance.
- **Automatic Optimizations**: Parcel automatically handles many optimizations during a production build (`npm run build`), including code minification (HTML, CSS, JS), tree-shaking (to remove unused code), and efficient asset bundling.

# CSS Structure and Organization

This project employs a hybrid CSS strategy. Global styles are organized using CSS Cascade Layers (`@layer`), and Web Components use encapsulated BEM-style naming within their Shadow DOM. CSS Custom Properties are central for theming.

## Overall CSS Architecture with `@layer`

```text
src/
└── css/
    ├── main.css                # Primary CSS entry point. Defines @layer order and imports.
    │                           # @import "../variables.css"; (before layers or in an early layer)
    │                           # @layer reset, base, theme, layout, components, utilities;
    │
    ├── variables.css           # Global CSS Custom Properties (design tokens).
    │
    ├── base/                   # Styles imported into the 'reset' and 'base' layers.
    │   ├── reset.css           #   -> @layer reset
    │   ├── global.css          #   -> @layer base
    │   └── typography.css      #   -> @layer base
    │
    ├── theme/                  # Styles imported into the 'theme' layer.
    │   └── default-theme.css   #   -> @layer theme (example for default theme)
    │
    ├── layout/                 # (Optional) Global layout files for the 'layout' layer.
    │   └── grid.css            #   -> @layer layout (example)
    │
    ├── components/             # (Optional) Styles for non-Web Component UI for the 'components' layer.
    │   └── buttons.css         #   -> @layer components (example)
    │
    ├── pages/                  # Page-specific styles, typically imported into the 'components' or 'layout' layer.
    │   ├── page-about.css      #   -> @layer components (example for about page styles)
    │   └── page-index/         #   (example for page-specific component styles)
    │       └── hero-section.css #  -> @layer components
    │
    └── utils/                  # Utility class files for the 'utilities' layer.
        ├── spacing.css         #   -> @layer utilities
        ├── typography.css      #   -> @layer utilities
        ├── flexbox.css         #   -> @layer utilities
        ├── layout.css          #   -> @layer utilities
        └── debug.css           #   -> @layer utilities

src/
└── js/
    └── components/
        └── [ComponentName]/
            └── [ComponentName].js
                └── <style> /* Shadow DOM Styles (Not part of global @layers) */
                    /* :host { ... } Block styles */
                    /* .element { ... } BEM __element styles */
                    /* .element--modifier { ... } BEM --modifier styles */
                    /* Consumes global CSS vars from variables.css */
                </style>
```

## 1. Global CSS (`src/css/`) with `@layer`

- **`variables.css`**: Defines global CSS Custom Properties. These are imported in `main.css` _before_ any `@layer` declarations or within an early, unlayered import to ensure they are universally available.
- **`main.css`**: This is the primary stylesheet linked in all HTML files. Its main responsibilities are:
  1.  Importing `variables.css`.
  2.  Defining the order of cascade layers: `@layer reset, base, theme, layout, components, utilities;`.
  3.  Importing other CSS files directly into their designated layers.
      - `@layer reset { @import url("base/reset.css"); }`
      - `@layer base { @import url("base/global.css"); @import url("base/typography.css"); }`
      - `@layer theme { @import url("theme/default-theme.css"); }`
      - `@layer layout { /* @import url("layout/grid.css"); */ }`
      - `@layer components { /* @import url("components/buttons.css"); @import url("pages/page-about.css"); */ }`
      - `@layer utilities { @import url("utils/spacing.css"); /* etc. */ }`
- **Layer Content:**
  - **`reset` layer**: Contains minimal custom CSS reset (`base/reset.css`).
  - **`base` layer**: Holds essential global HTML/body styles, base typography, etc. (`base/global.css`, `base/typography.css`).
  - **`theme` layer**: Contains theme-specific styles, primarily CSS variable definitions/overrides for different themes (e.g., `default-theme.css`, `dark-theme.css`). This layer allows themes to adapt the look and feel defined in `base` without altering its core structure.
  - **`layout` layer (Optional)**: For global page structure, grid systems not encapsulated in components.
  - **`components` layer (Optional)**: For styling UI pieces that are _not_ Web Components. This can include styles for specific pages (e.g., `pages/page-about.css`) or reusable non-web-component UI elements (e.g., `components/buttons.css`).
  - **`utilities` layer**: Contains single-purpose utility classes (spacing, typography, flexbox, etc.). Styles in this layer will generally override styles from `reset`, `base`, `theme`, `layout`, and `components` layers for the same properties on the same elements, due to layer order, potentially reducing the need for `!important` on some utilities (though `!important` might still be used for highly specific overrides like `.hidden`).

## 2. Web Component Styles (BEM-like within Shadow DOM)

- This part of the strategy remains consistent: Styles are defined within the `<style>` tags of each Web Component's Shadow DOM.
- **Encapsulation**: Shadow DOM ensures these styles are scoped and don't interfere with global layers or other components.
- **Naming Convention (BEM-inspired)**: `:host` for the block, and simple, descriptive class names for elements and modifiers (e.g., `.nav-list`, `.nav-link--active`).
- **Consuming Global Variables**: Component styles use global CSS Custom Properties from `variables.css`.

## 3. Web Component CSS in Separate Files

- For maintainability and better tooling support, each Web Component can have its own CSS file (e.g., `SiteHeader.css` for `SiteHeader.js`).
- The CSS file is imported into the component JavaScript using:
  ```js
  import * as styles from "./SiteHeader.css";
  // ...
  this.shadowRoot.innerHTML = `
    <style>${styles.default}</style>
    ...
  `;
  ```
- This approach enables full syntax highlighting, code completion, and easier reuse of styles.
- **Note:** If you see a linter warning like "Cannot find module './SiteHeader.css' or its corresponding type declarations," you can safely ignore it for plain JS projects. For TypeScript, add a declaration file as described below.

### Web Component comments needed

- For CSS syntax highlighting inside template literals, use the comment `/* language=CSS */` before your CSS block in the template string.
- For HTML, use `/*html*/` before the template literal.

## Guiding Principles for This `@layer` Hybrid Strategy

- **Manage Cascade with Layers**: Use `@layer` in `main.css` to explicitly control the cascade order for global stylesheets (reset, base, theme, layout, global components, utilities).
- **Theme for Broad Visual Styles**: Use the `theme` layer to define or override CSS Custom Properties that control the overall look and feel (colors, font families, etc.), making it easier to switch between or add new themes like a dark mode.
- **Utilities for Override Power**: Place utility classes in the `utilities` layer, which is typically the last defined layer, giving them precedence over earlier layers for un-important styles.
- **BEM for Component Internals**: Continue using BEM-style classes within Web Component Shadow DOM for clarity and encapsulation.
- **CSS Custom Properties as the Theming Bridge**: Universal use of global CSS variables for design tokens.
- **Respect Shadow DOM Encapsulation**: Global layers do not directly style inside Shadow DOM. Web Components are styled internally or themed via CSS Custom Properties.

This `@layer` approach provides more explicit control over the CSS cascade for global styles, making the utility layer's overrides more predictable without always resorting to `!important`.

# HTML Structure & Templating

This project uses **Native Web Components** for creating reusable UI elements such as the site header, footer, and navigation. This approach helps maintain a DRY (Don't Repeat Yourself) HTML structure without requiring additional templating engine dependencies.

- Core components like `<site-header>` and `<site-footer>` are defined in `src/js/components/`.
- These components are then used directly in the HTML pages (e.g., `src/index.html`, `src/about.html`, `src/styleguide.html`).
- Parcel.js handles the bundling of these components as part of the standard JavaScript build process.

## Core Technologies

The website itself is built using fundamental web technologies:

- HTML5
- CSS3 (including CSS Grid and Flexbox)
- Vanilla JavaScript
- Native Web Components

These technologies are web standards and are designed for long-term browser compatibility, which significantly contributes to the future-proofing of the actual deployed website.

# Accessibility (A11Y) - Accessibility-by-Design
