# Jason Swetzoff's UX Portfolio

[![Deploy to GitHub Pages](https://github.com/jaswetz/jaswetz.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/jaswetz/jaswetz.github.io/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://jaswetz.github.io/)
[![Bundle Size](https://img.shields.io/badge/JS-29.94KB-success)](https://github.com/jaswetz/jaswetz.github.io)
[![Bundle Size](https://img.shields.io/badge/CSS-66.43KB-success)](https://github.com/jaswetz/jaswetz.github.io)

A modern UX portfolio website built with fundamental web technologies and native Web Components.

## ✨ Key Features

- **🎨 Animated 2D Logo**: Interactive animated logo in the hero section featuring the three signature shapes (triangle, circle, square) with smooth CSS animations
- **📱 Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes
- **⚡ Performance Optimized**: Lightweight bundle sizes and fast loading times
- **🧭 Smart Sidebar Navigation**: Automatic scroll spy with active section highlighting and smooth scrolling (see [SIDEBAR_NAVIGATION.md](SIDEBAR_NAVIGATION.md))

## 🚀 Live Site

Visit the portfolio at: [https://jaswetz.github.io/](https://jaswetz.github.io/)

## 🔧 CI/CD Pipeline Status

**Build & Deploy:** Fully automated CI/CD pipeline with GitHub Actions

- ✅ **Linting:** ESLint (JavaScript) + Stylelint (CSS)
- ✅ **Build Optimization:** Parcel.js with asset optimization
- ✅ **Bundle Size Monitoring:** JS (29.94KB) + CSS (66.43KB) within limits
- ✅ **Automated Deployment:** GitHub Pages on push to main
- ✅ **Clean Build Process:** No artifact pollution

### Quick Commands

```bash
npm run dev         # Development server
npm run build       # Production build
npm run test        # Run all tests (lint + stylelint)
npm run preview     # Build + serve for testing
npm run clean       # Clean build artifacts
```

---

---

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

## Image and Asset Files

Use `kebab-case` with descriptive names.

- Example: `profile-picture-large.jpg`
- Example: `project-thumbnail-blue.png`

## Web Components

- Custom element names MUST contain a hyphen (e.g., `<site-header>`, `<project-card>`).
- Component JavaScript files should be named in `PascalCase` (e.g., `SiteHeader.js`, `ProjectCard.js`).
- Component files should be organized by feature/UI element in the `src/js/components/` directory (e.g., `src/js/components/site-header/SiteHeader.js`).

# Development Environment & Tooling

This project uses `npm` for package management and Parcel.js as the bundler and development server.

## Prerequisites

- Node.js and npm: Make sure you have Node.js and npm installed. You can download them from [https://nodejs.org/](https://nodejs.org/).

## Setup

1. Clone the repository (if you haven't already).
2. Install project dependencies:
   ```bash
   npm install
   ```

## Debugging Visuals (Layout & Rhythm)

To aid in visual debugging of layouts and typographic rhythm, a keyboard shortcut is available:

- **Press `Ctrl+Shift+D`**: This will toggle helper debug styles on the page.
  - **Layout Outlines**: Adds outlines to all major elements and semantic sections (header, main, footer, section, etc.) to help visualize their boundaries and nesting.
  - **Typographic Baseline Grid**: Overlays a semi-transparent baseline grid on the page to help align text and elements to a consistent vertical rhythm.

Pressing `Ctrl+Shift+D` again will disable these visual aids. A message will also be logged to the browser console indicating the status of the debug styles.

## Available Scripts

In the project directory, you can run the following scripts:

### `npm run dev`

Runs the app in development mode using Parcel. It will automatically open `src/index.html` in your default browser.
The page will reload if you make edits.
You will also see any lint errors in the console.

Parcel will automatically install any necessary compilers or transformers for file types like Sass, TypeScript, etc., when it first encounters them.

### `npm run build`

Builds the app for production to the `dist/` folder.\
It correctly bundles your code in production mode and optimizes the build for the best performance. All `*.html` files in the `src/` directory (e.g., `src/index.html`, `src/about.html`, `src/styleguide.html`) are used as entry points for the build.

The build is minified and the filenames include hashes for cache busting.

## Build Optimizations

- **Browser Targets**: The `package.json` file includes a `"browserslist"` field. This configuration informs Parcel (and other tools) about the target browsers for the project. Parcel uses this to determine the level of JavaScript transpilation needed and to generate [differential bundling](https://parceljs.org/features/production/#differential-bundling), serving modern code to modern browsers and fallbacks to older ones, optimizing load times and performance.
- **Automatic Optimizations**: Parcel automatically handles many optimizations during a production build (`npm run build`), including code minification (HTML, CSS, JS), tree-shaking (to remove unused code), and efficient asset bundling.

## CSS Structure and Organization

### TL;DR

Use **cascade layers** to control global styles (`reset → base → theme → layout → components → utilities`).  
Web Components handle their own styles in Shadow DOM using **BEM‑style** class names, while consuming global design tokens declared in `variables.css`.

---

### Directory Overview ⇢ _where things live_

```text
src/
└── css/
    ├── main.css            # Defines @layer order & imports (entry point)
    ├── variables.css       # Design tokens (CSS custom properties)
    ├── base/               # reset.css, global.css, typography.css
    ├── theme/              # default-theme.css, dark-theme.css …
    ├── layout/             # page‑level grid or layout helpers
    ├── components/         # non‑Web‑Component UI styles
    └── utils/              # utility classes (spacing, flex, grid, …)
```

Hover the file names in GitHub to jump directly to each folder.

---

### Declaring the Layer Order

In `src/css/main.css`:

```css
@import "../variables.css"; /* tokens first */

@layer reset, base, theme, layout, components, utilities;

@layer reset {
  @import url("base/reset.css");
}
@layer base {
  @import url("base/global.css");
  @import url("base/typography.css");
}
@layer theme {
  @import url("theme/default-theme.css");
}
@layer layout {
  @import url("layout/projects.css");
}
@layer components {
  @import url("components/buttons.css");
}
@layer utilities {
  @import url("utils/spacing.css"); /* … */
}
```

---

### Quick Checklist ✓

- [ ] `variables.css` is imported **before** any `@layer`.
- [ ] Layer order matches `reset → base → theme → layout → components → utilities`.
- [ ] New global styles are added inside the correct layer import.
- [ ] Utility classes are last, so they override earlier layers without `!important`.
- [ ] Shadow DOM styles stay inside their component `.js` file.

---

### 60‑Second Working Example

> From design token → theme override → component usage

```css
/* variables.css */
:root {
  --brand-color: #0055ff;
  --brand-color-dark: #0037a6;
}

/* theme/dark-theme.css */
@layer theme {
  :root {
    --brand-color: #7aa3ff; /* override for dark mode */
  }
}
```

```css
/* utils/buttons.css */
@layer utilities;
.btn {
  background-color: var(--brand-color);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}
```

```html
<!-- Any page or component -->
<button class="btn">Primary action</button>
```

Switching to the dark theme automatically restyles every `.btn`.

---

### Browser Support & Fallback

Cascade Layers are supported in **Chrome 111+, Firefox 110+, Safari 16.4+, Edge 111+**.  
Older/legacy browsers (including IE 11) will receive the un‑layered fallback output that Parcel generates, so critical styles remain intact. If you must support those browsers, keep overrides minimal or use a PostCSS plugin to flatten layers.

---

### Guiding Principles 🚀

1. **Import tokens first** – `variables.css` must load before any layer.
2. **One concern per layer** – don’t mix resets with utilities.
3. **Utilities override by design** – place them last, avoid `!important`.
4. **BEM‑style inside components** – `:host` is the “block”; use `.element` and `.element--modifier`.
5. **No global styles inside Shadow DOM** – share design tokens instead.

---

### Looking Ahead 🔭

We’re tracking the emerging `@scope` rule and container queries. Once browser support solidifies, expect an update to layer structure and utility generation to leverage them.

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

### TypeScript Users: CSS Module Declaration

If you use TypeScript and want to remove the import warning, add a file like `src/js/components/site-header/declaration.d.ts`:

```ts
declare module "*.css" {
  const content: { [className: string]: string; default: string };
  export = content;
}
```

## 4. Recommended VS Code Extensions & Settings for Web Components

- **lit-html** by Rune Mehlsen: Syntax highlighting for HTML and CSS in template literals.
- **es6-string-html** by Tzvetan Mikov: Highlights HTML and CSS inside JavaScript template strings.
- **Template Literal Editor** by plievone: (Optional) Edit template literals as if they were standalone files.
- **CSS Peek** by Pranay Prakash: (Optional) Jump to CSS definitions from HTML.

### VS Code Settings

Add to `.vscode/settings.json` for best experience:

```json
{
  "emmet.includeLanguages": {
    "javascript": "html",
    "javascriptreact": "html"
  },
  "files.associations": {
    "*.js": "javascript"
  },
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "string.template.js",
        "settings": {
          "foreground": "#9CDCFE"
        }
      }
    ]
  }
}
```

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

## Responsive Breakpoint System

The project uses a standardized, mobile-first breakpoint system for consistent responsive design across all components and layouts.

### Breakpoint Scale

All breakpoints use `rem` units for better accessibility and are defined as CSS Custom Properties in `src/css/variables.css`:

```css
--breakpoint-xs: 20rem; /* 320px - Small phones */
--breakpoint-sm: 36rem; /* 576px - Large phones */
--breakpoint-md: 48rem; /* 768px - Tablets */
--breakpoint-lg: 64rem; /* 1024px - Desktop */
--breakpoint-xl: 80rem; /* 1280px - Large desktop */
--breakpoint-2xl: 96rem; /* 1536px - Extra large */
```

### Usage in Media Queries

**Important**: CSS custom properties cannot be used directly in `@media` queries. Use the actual `rem` values:

```css
/* ✅ Correct - Mobile First (Preferred) */
@media (min-width: 48rem) {
  /* Tablet and up styles */
}

@media (min-width: 64rem) {
  /* Desktop and up styles */
}

/* ✅ Correct - Desktop First (When Needed) */
@media (max-width: 47.9375rem) {
  /* Mobile only styles */
}
```

### Migration from Legacy Breakpoints

Common conversions from previous inconsistent breakpoints:

- `@media (max-width: 768px)` → `@media (max-width: 47.9375rem)`
- `@media (min-width: 768px)` → `@media (min-width: 48rem)`
- `@media (min-width: 66em)` → `@media (min-width: 64rem)`
- `@media (min-width: 100em)` → `@media (min-width: 96rem)`

### Container System

Responsive containers automatically adjust max-width and padding at each breakpoint:

```css
.container {
  /* Responsive max-widths and padding */
}

.container-narrow {
  /* Constrained to reading width */
}

.container-full {
  /* Full width, responsive padding only */
}
```

### Breakpoint System Documentation

See `src/css/utils/media-queries.css` for complete documentation and examples. The living style guide at `/styleguide.html` includes an interactive breakpoint demo.

## Unified Grid & Layout System

The project uses a comprehensive, utility-first grid and layout system located in `src/css/utils/grid-system.css`. This system replaces all previous grid implementations (`base/layout.css`, `components/grids.css`) and provides a single, consistent way to create responsive layouts.

### Core Concepts

- **Utility-First**: Compose complex layouts by applying small, single-purpose utility classes directly in your HTML.
- **CSS Grid & Flexbox**: The system provides utilities for both CSS Grid and Flexbox, allowing you to choose the best tool for the job.
- **Responsive by Default**: All layout utilities can be applied conditionally at different breakpoints using prefixes (e.g., `md:grid-cols-4`).

### CSS Grid Utilities

Create grid containers and define column structures with simple classes.

- `.grid`: Establishes a grid container.
- `.grid-cols-[1-12]`: Defines a grid with a fixed number of equal-width columns.
- `.grid-cols-auto-fit`: Creates a responsive grid where columns automatically wrap and fill the available space (ideal for cards).
- `.gap-[1-6]`: Applies consistent spacing between grid items.

**Example:**

```html
<!-- A 2-column grid on mobile, 4-column on desktop -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

### Flexbox Utilities

For one-dimensional layouts, use the flexbox utilities.

- `.flex`: Establishes a flex container.
- `.flex-row`, `.flex-col`: Defines the direction of the flex items.
- `.justify-center`, `.items-center`, etc.: For alignment.
- `.gap-[1-6]`: Applies spacing between flex items.

### Grid System Documentation

See `src/css/utils/grid-system.css` for a complete list of available utilities. The living style guide at `/styleguide.html` includes comprehensive documentation and live, interactive demos for all grid and flexbox variations.

## HTML Structure & Templating

This project uses **Native Web Components** for creating reusable UI elements such as the site header, footer, and navigation. This approach helps maintain a DRY (Don't Repeat Yourself) HTML structure without requiring additional templating engine dependencies.

- Core components like `<site-header>` and `<site-footer>` are defined in `src/js/components/`.
- These components are then used directly in the HTML pages (e.g., `src/index.html`, `src/about.html`, `src/styleguide.html`).
- Parcel.js handles the bundling of these components as part of the standard JavaScript build process.

## Living Style Guide

A living style guide is available at `src/styleguide.html`. When running the development server (`npm run dev`), this page can be accessed to view and test all available Web Components, design tokens (colors, typography), and utility classes.
This page serves as a central reference for the UI of the website.

Add any new components or styles or layouts to this page when created.

## Password Protection System

This project includes a modular password protection system for case studies that contain confidential or sensitive design work. The system provides client-side password protection with session management.

## Features

- **Modular Configuration**: Centralized configuration for easy management
- **User-Friendly Interface**: Clean, accessible password prompt with proper styling
- **Session Management**: 24-hour authentication sessions stored in localStorage
- **Responsive Design**: Works across all device sizes and input methods
- **Accessibility**: Full keyboard navigation, screen reader support, high contrast mode
- **Easy Integration**: Simple script import to protect any case study

## Quick Start

### Protecting a Case Study

1. **Add the case study to the configuration** in `src/js/auth/password-config.js`:

   ```javascript
   protectedCaseStudies: {
     'your-case-study-id': {
       password: 'YourSecurePassword',
       title: 'Your Case Study Title',
       description: 'This case study contains confidential design work.',
       redirectOnCancel: '../work.html'
     }
   }
   ```

2. **Add the protection script** to your case study HTML file before the closing `</body>` tag:

   ```html
   <script type="module">
     import { protectCaseStudy } from "../js/password-protection-init.js";
     protectCaseStudy("your-case-study-id");
   </script>
   ```

### Currently Protected Case Studies

- **project-autodesk-di**: Autodesk Fusion Device Independence case study
  - Password: `CuriousDesign404`
  - Protected due to confidential enterprise design work

## System Architecture

The password protection system consists of:

- `src/js/auth/password-config.js` - Central configuration
- `src/js/auth/password-protection.js` - Core protection logic
- `src/js/auth/password-protection-init.js` - Integration helpers
- `src/css/components/password-protection.css` - UI styling

## Security Considerations

⚠️ **Important**: This is client-side protection suitable for:

- Portfolio access control and sharing
- Keeping case studies out of search engines
- Basic access control for confidential work samples

**Not suitable for**: Protecting truly sensitive data or defense against determined attackers.

For more detailed documentation, see `PASSWORD_PROTECTION.md`.

## Testing

A demo page is available at `src/projects/password-protection-demo.html` for testing the system functionality.

# Analytics and Tracking

This project uses multiple analytics tools to gather comprehensive insights into user behavior and site performance:

- **Google Analytics 4 (GA4)**: For traffic analysis and conversion tracking
- **Microsoft Clarity**: For user behavior insights through heatmaps and session recordings

## Google Analytics 4 Integration

- **Measurement ID**: `G-Z5DNDF44NG`
- **Implementation**: The core GA4 logic is managed in `src/js/analytics.js`. This script is loaded on all HTML pages via a `<script>` tag in the `<head>`.
- **Bundling**: The `analytics.js` script is imported into the main `src/index.js` file to ensure it is included in the final production build by Parcel.

## Microsoft Clarity Integration

- **Implementation**: The Clarity configuration is managed in `src/js/clarity-config.js`. This script is loaded on all HTML pages.
- **Features**: Provides heatmaps, session recordings, user insights, and performance metrics
- **Setup**: See `CLARITY_SETUP.md` for detailed setup instructions including how to configure your Project ID
- **Privacy**: Automatically masks sensitive information and complies with GDPR requirements

## Tracked Events

The analytics setup includes both standard and custom event tracking:

### Enhanced Measurement (Automatic)

GA4's enhanced measurement is enabled to automatically track:

- Page views
- Scroll depth
- Outbound link clicks
- File downloads (`.pdf`, `.docx`, etc.)
- Site search (if implemented)
- Video engagement (if implemented)

### Custom Event Tracking

Both analytics tools include custom logic to track specific user interactions:

**Google Analytics 4**:

- **Project Clicks**: Tracks when a user clicks on a project card to view details.
- **Resume Downloads**: Specifically tracks clicks on links identified as a resume download.
- **Time on Page**: A basic mechanism to track time spent on each page.
- **External Link Clicks**: Tracks clicks on links leading to external domains.

**Microsoft Clarity**:

- **Project Interactions**: Tracks project card clicks and views
- **Resume Downloads**: Tracks resume download events
- **Contact Form**: Tracks form interactions and submissions
- **Navigation**: Tracks navigation patterns between pages
- **Custom Events**: Flexible event tracking for any user interaction

## Data Privacy

Both analytics tools are configured with privacy in mind:

- **Google Analytics**: The `allow_ad_personalization_signals` flag is set to `false`
- **Microsoft Clarity**: Automatically masks sensitive information and PII
- **GDPR Compliance**: Both tools comply with European privacy regulations
- **IP Anonymization**: User IP addresses are anonymized

For production environments, consider adding a cookie consent banner and allowing users to opt-out of tracking as required by GDPR and CCPA regulations.

# Editor Configuration

This project includes a recommended editor configuration for VS Code and Cursor in the `.vscode/settings.json` file. This file includes settings for formatting (Prettier) and recommends some useful extensions for web development.

Since `.vscode/` is included in `.gitignore`, these settings are not committed to the repository and are intended for local development convenience. You may customize them further to your preferences.

# TODO Strategy

This project uses a simple comment-based system for tracking tasks, issues, and optimization opportunities directly within the codebase. The following prefixes should be used:

- `// TODO: [Scope] Description` - For planned features or tasks that need to be implemented. The `[Scope]` can be a component name, feature area, or general category (e.g., `[Accessibility]`, `[SiteHeader]`, `[ProjectPage]`).
- `// FIXME: Description` - For bugs or issues that need to be addressed.
- `// OPTIMIZE: Description` - For areas of the code that could be improved for performance, readability, or efficiency.

This approach keeps tasks contextually close to the relevant code and makes them easy to find via code search.

# Environment and Future-Proofing

This section outlines key aspects of the development environment to ensure the project can be run and maintained in the future.

## Node.js Version

This project was last developed and tested with Node.js version `23.9.0`.
An `.nvmrc` file is included in the project root. If you use [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm), you can switch to the correct Node.js version by running the following command in the project root:

```bash
nvm use
```

If you don't have this version of Node.js installed, nvm will prompt you to install it.
Using a consistent Node.js version is crucial for ensuring that dependencies, especially the Parcel.js build tool, install and operate as expected.

## Dependencies

The primary build-time dependency is Parcel.js. All dependencies and their exact versions are locked in the `package-lock.json` file.
To ensure a clean and reproducible build environment when returning to the project after some time, or when setting it up on a new machine, it is highly recommended to install dependencies using:

```bash
npm ci
```

This command performs a clean install strictly based on the `package-lock.json` file.

## Core Technologies

The website itself is built using fundamental web technologies:

- HTML5
- CSS3 (including CSS Grid and Flexbox)
- Vanilla JavaScript
- Native Web Components

These technologies are web standards and are designed for long-term browser compatibility, which significantly contributes to the future-proofing of the actual deployed website.

## Build Output

The `npm run build` command generates a production-ready static site in the `dist/` directory. This output consists of plain HTML, CSS, and JavaScript files that can be hosted on any static web hosting provider (like Github Pages, as intended for this project). Once built, the `dist/` directory is self-contained and does not require Parcel.js or Node.js to be served to users.

# Testing Strategy

This section outlines the planned testing approaches to ensure website quality, performance, and accessibility.

## 11.1 Cross-Browser Testing

- **Manual Testing**: The website will be manually tested on the latest versions of supported browsers (Chrome, Firefox, Safari, Edge - desktop and mobile, as per project requirements).
- **Web Component Functionality**: Specific attention will be paid to verifying Web Components functionality and rendering across these browsers, using the `styleguide.html` as a primary tool.
- **Graceful Degradation**: The unsupported browser warning message (to be implemented) will be tested on an older browser or by simulating an unsupported environment.
- **Results Storage**: Cross-browser testing checklists and results may be stored as GitLab artifacts if a CI/CD pipeline is established.

## 11.2 Performance Testing

- **Lighthouse**: Google Lighthouse (via Chrome DevTools) will be used periodically to measure Core Web Vitals (LCP, FID/INP, CLS) and overall performance scores.
- **Bundle Size Validation**: Production build bundle sizes will be monitored using Parcel's output and potentially bundle analysis tools if needed.
- **Network Throttling**: Testing on throttled connections (via browser DevTools) will be performed to simulate various mobile network conditions.

## 11.3 Accessibility Testing (A11Y)

- **Automated Tools**: Lighthouse and the axe-core browser extension will be used for automated WCAG 2.1 Level AA compliance checks.
- **Manual Keyboard Navigation**: Thorough manual testing of all interactive elements using only keyboard navigation.
- **Screen Reader Verification**: Manual testing with screen reader software (e.g., VoiceOver, NVDA) to ensure a good user experience for visually impaired users.
- **Color Contrast**: Color contrast ratios will be validated using browser DevTools or dedicated contrast checker tools.

## 11.4 Component Testing

- **Isolation Testing**: Web Components will be manually tested in isolation using the `styleguide.html` page to verify their appearance, functionality, and responsiveness.
- **Integration Testing**: Components will be tested on actual pages (`index.html`, `about.html`, etc.) to ensure they integrate correctly with the page layout and other components.
- **Encapsulation Verification**: Shadow DOM encapsulation will be implicitly verified by ensuring styles do not leak between components or the global scope.

# Git Workflow & Quality Assurance

This project implements a streamlined git workflow with automated quality checks to maintain code quality without slowing down development.

## 12.1 Git Hooks Strategy

### Pre-Commit Hook (Lightweight)

- **Purpose**: Quick essential checks to catch critical errors
- **Runs**: ESLint on JavaScript files only
- **Behavior**: Auto-fixes issues when possible, fails only on critical errors
- **Speed**: Fast (< 5 seconds typically)
- **Bypass**: Use `git commit --no-verify` if needed

### Pre-Push Hook (Comprehensive)

- **Purpose**: Thorough testing before sharing code
- **Runs on Main Branch**: Full test suite (ESLint, Stylelint, HTML validation, accessibility)
- **Runs on Feature Branches**: Basic ESLint checks only
- **Behavior**: Prevents push if critical issues found
- **Bypass**: Use `git push --no-verify` for emergencies

### CI/CD Pipeline

- **Purpose**: Final verification and deployment
- **Runs**: Complete test suite including cross-browser testing
- **Triggers**: On push to main branch
- **Result**: Automatic deployment if all tests pass

## 12.2 Development Workflow

```bash
# Normal development cycle
git add .
git commit -m "feat: add new feature"  # Runs quick ESLint check
git push origin feature-branch         # Runs basic checks

# When ready to merge to main
git checkout main
git merge feature-branch
git push origin main                   # Runs full test suite
```

# Deployment & Hosting (Github Pages)

This project is intended to be deployed using GitLab Pages.

## 13.1 Security Configuration

- **HTTPS Enforcement**: GitLab Pages automatically enforces HTTPS for `*.gitlab.io` domains and for custom domains when using GitLab-managed Let's Encrypt certificates.
- **Security Headers**: Custom HTTP headers are configured in the `public/_headers` file, which Parcel will copy to the `dist/` directory during the build process. This file includes:
  - `Content-Security-Policy` (CSP): A restrictive policy is set as a baseline. **This policy will likely need adjustments** based on the final content, scripts (e.g. analytics), and styles used. For example, `script-src` includes `'wasm-unsafe-eval'` for Parcel's HMR in development; this should be reviewed for production builds. `style-src` includes `'unsafe-inline'` to support Web Component Shadow DOM styles.
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`: Basic policy to disable features like microphone/camera by default.
  - (HSTS) `Strict-Transport-Security`: GitLab Pages typically manages HSTS for its domains. If a custom domain is used and HSTS is not managed by GitLab, it can be added to `_headers`.
- **Cache Control**: The `public/_headers` file also defines caching strategies:
  - HTML files (`/*.html`): `Cache-Control: no-cache` to ensure clients always revalidate.
  - Versioned assets (CSS, JS, images, fonts with content hashes from Parcel): `Cache-Control: public, max-age=31536000, immutable` for long-term caching.

## 13.2 Domain Configuration (GitLab Pages)

- **Custom Domain**: GitLab Pages supports custom domain configuration. Refer to the official GitLab documentation for setup.
- **SSL Certificate Management**: GitLab provides automatic SSL certificate management via Let's Encrypt for custom domains.
- **CDN Integration**: GitLab Pages serves content via a CDN (Fastly) by default, which aids global performance.

# Accessibility (A11Y) - Accessibility-by-Design

This project commits to an "Accessibility-by-Design" approach, integrating accessibility considerations throughout the development lifecycle.

- **A11Y1. WCAG 2.1 Level AA:** The primary goal is to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.
- **A11Y2. Semantic HTML5:** Use HTML5 elements according to their semantic meaning to build a well-structured and understandable content hierarchy (e.g., `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`).
- **A11Y3. Keyboard Accessibility:** All interactive elements (links, buttons, future form controls) must be fully operable via keyboard. Focus states must be clear and visible.
- **A11Y4. ARIA Attributes:** Use ARIA attributes judiciously to enhance accessibility where native HTML semantics are insufficient, especially for custom Web Components. Prefer native HTML elements and attributes first.
- **A11Y5. Image `alt` Text:** All `<img>` tags will have descriptive `alt` text for informative images, or `alt=""` for purely decorative images.
- **A11Y6. Color Contrast:** Text and interactive elements will maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (as defined by WCAG) against their backgrounds.
- **A11Y7. Responsiveness & Zoom:** The website will be responsive across various screen sizes. Text must be resizable up to 200% using browser zoom features without loss of content or functionality.
- **A11Y8. Forms:** If forms are implemented (e.g., a contact form, potentially via a third-party service), they must have clear labels, associated error messages, and support accessible validation.
- **A11Y9. Web Component Accessibility:** Web Components will be developed with accessibility as a core requirement. This includes managing focus within Shadow DOM, providing appropriate ARIA roles and states for custom elements, and ensuring they are keyboard navigable.
- **A11Y10. Regular Testing:** Accessibility will be regularly checked using:
  - Automated tools (e.g., Axe DevTools, Lighthouse accessibility audits).
  - Manual testing (keyboard-only navigation, screen reader checks with VoiceOver/NVDA, zoom testing, color contrast checks).

# Outstanding Project TODOs

This section lists general pending tasks. File/component-specific TODOs are typically located as comments within the relevant files.

## ✅ Completed

- **[CI/CD] ✅ Created comprehensive CI/CD pipeline** (`.github/workflows/deploy.yml`)
- **[CI/CD] ✅ Implemented all pipeline jobs** (security, lint, build, accessibility-test, performance-test, deploy)
- **[CI/CD] ✅ Added GitHub Actions deployment status badges** (See top of README)
- **[Testing] ✅ Implemented comprehensive testing suite** (See `TESTING.md`)
  - Security auditing with npm audit
  - JavaScript linting with ESLint
  - CSS linting with Stylelint
  - HTML validation with html-validate
  - Accessibility testing with axe-core
  - Performance testing with Lighthouse
  - Cross-browser testing with Playwright
  - Bundle size monitoring
  - Link checking
- **[Testing] ✅ Created local testing script** (`./test-local.sh`)
- **[Testing] ✅ Added optimized git hooks** (Lightweight pre-commit + comprehensive pre-push)
- **[Optimization] ✅ Implemented comprehensive asset optimization** (Image compression, WebP conversion, lazy loading)
- **[Optimization] ✅ Implemented web font optimization** (Preconnect, preload, font-display: swap)
- **[Optimization] ✅ Updated all HTML files with optimized font loading** (All 9 HTML files now use optimized headers)

## 🚧 In Progress / Remaining

- `// TODO: [Content] Add actual portfolio project content to src/content/projects/ (PS8, PS8.1, PS8.2)`
- `// TODO: [CSS] Create specific CSS for case study layouts (PS3.4)`
- `// TODO: [Accessibility] Ensure all images have appropriate alt text once added (A11Y5)`
- `// TODO: [SEO] For each page: Define unique <title> tags (Phase 8.1)`
- `// TODO: [SEO] For each page: Write meta descriptions (Phase 8.1)`
- `// TODO: [SEO] For each page: Ensure logical heading hierarchy (Phase 8.1)`
- `// TODO: [SEO] For each page: Use clean, keyword-relevant URLs (Phase 8.1)`
- `// TODO: [SEO] For each page: Implement internal linking (Phase 8.1)`
- `// TODO: [SEO] Create and configure robots.txt (Phase 8.2)`
- `// TODO: [SEO] Generate and plan for XML sitemap submission (Phase 8.2)`
- `// TODO: [Analytics] Integrate Google Analytics 4 (GA4) tracking code (Phase 8.3)`
- `// COMPLETED: [Analytics] Integrate Microsoft Clarity tracking code (Phase 8.3) - See CLARITY_SETUP.md for configuration`
- `// TODO: [Analytics] Address data privacy implications of analytics tools (Phase 8.3)`
- `// TODO: add a scroll to top floating button`

## Future Implementation Recommendations

These are enhancement suggestions for continued development beyond the core requirements:

- `// TODO: [Content] Consider moving project content to src/content/projects/ structure for better organization (PS8)`
- `// TODO: [Performance] Add responsive image srcsets with different sizes for various breakpoints (OP8)`
- `// TODO: [Testing] Add automated visual regression testing with tools like Percy or Chromatic`
- `// TODO: [Security] Add security headers to public/_headers for enhanced security (CSP, HSTS, etc.)`
- `// TODO: [Accessibility] Add more comprehensive ARIA labels for complex interactions`
- `// TODO: [Accessibility] Implement skip navigation links for better keyboard navigation`
- `// TODO: [Performance] Consider implementing Service Worker for offline functionality`
- `// TODO: [SEO] Add structured data markup (JSON-LD) for better search engine understanding`
- `// TODO: [Analytics] Consider privacy-focused analytics alternatives like Plausible or Fathom`
- `// TODO: [Monitoring] Add error tracking with tools like Sentry for production monitoring`
- `// TODO: [Components] Create additional reusable Web Components (project-card, modal, carousel)`
- `// TODO: [CSS] Implement CSS Container Queries for more responsive component design`
- `// TODO: [Build] Add bundle analysis tools to monitor and optimize bundle sizes`

## Case Study Updates

### Autodesk Notification System Case Study

#### Added Sections

- **Problem Section**: Explained the challenges with the existing notification system
- **Approach Section**: Added a three-phase approach with tag-like phase badges and checkmark bullets
- **Solution Section**: Implemented a "Centralized Notification Center" with solution points, main image, key features box, and severity levels grid
- **Results & Impact Section**: Added subscriber results card, business benefit cards with icons, and professional growth highlight
- **Key Learnings Section**: Added four numbered cards with titles and descriptions
- **Testimonial Section**: Added a testimonial quote from Alyssa (Sr. Software Engineer) with styled quote design

#### Styling Enhancements

- Created custom styling for each section to ensure visual consistency
- Implemented responsive layouts for all sections
- Added visual elements like icons, badges, and cards
- Ensured accessibility with proper contrast and semantic HTML
- Added navigation links in the sidebar for all new sections

# Testing

This project utilizes a comprehensive testing strategy to ensure code quality, performance, and accessibility. The testing process is divided into several key areas:

## 1. Automated Testing

Automated tests are run on each commit and pull request to the main branch. These tests include:

- **Security Audits**: Using `npm audit` to identify and fix vulnerabilities in dependencies.
- **JavaScript Linting**: Using ESLint to enforce coding standards and catch errors in JavaScript code.
- **CSS Linting**: Using Stylelint to ensure CSS code quality and consistency.
- **HTML Validation**: Using html-validate to check HTML files for compliance with web standards.
- **Accessibility Testing**: Using axe-core to automatically check for WCAG 2.1 accessibility compliance.
- **Performance Testing**: Using Lighthouse to measure and report on performance metrics.
- **Cross-Browser Testing**: Using Playwright to test website functionality and layout in different browsers.

These automated tests help catch issues early in the development process and ensure that the website remains secure, performant, and accessible.

## 2. Manual Testing

In addition to automated tests, manual testing is performed to catch issues that automated tests might miss. This includes:

- **Visual Inspection**: Manually checking the website in different browsers and devices to ensure consistent appearance and behavior.
- **Interactive Testing**: Using the website as an end user would, to identify any usability or functional issues.
- **Accessibility Testing**: Manual checks with screen readers (e.g., VoiceOver, NVDA) and keyboard navigation to ensure a fully accessible experience.

## 3. Testing Tools and Scripts

Several tools and scripts are used to facilitate testing:

- **Playwright**: For automated cross-browser testing.
- **Lighthouse**: For performance and accessibility audits.
- **axe-core**: For automated accessibility testing.
- **npm scripts**: Custom npm scripts are defined in `package.json` to run the various tests and linters. Some of the key scripts include:
  - `npm run test`: Runs the JavaScript and CSS linters, HTML validator, and accessibility tests.
  - `npm run test:watch`: Runs the tests in watch mode, re-running them on file changes.
  - `npm run test:all`: Runs all tests, including accessibility and performance tests (requires the development server to be running).

## 4. Testing Workflow

The typical workflow for testing is as follows:

1. **Code Changes**: Make changes to the codebase.
2. **Automated Tests**: Push the changes to the repository. Automated tests will run on the CI server.
3. **Review Results**: Review the results of the automated tests. Fix any issues that are identified.
4. **Manual Testing**: Perform manual testing as needed, especially for accessibility and cross-browser compatibility.
5. **Merge Changes**: Once all tests pass and the code is reviewed, merge the changes into the main branch.

## 5. Testing Documentation

Detailed documentation for testing procedures, tools, and scripts is available in the `TESTING.md` file. This includes:

- How to run tests locally
- How to interpret test results
- How to fix common issues identified by the tests
- Guidelines for writing accessible and high-quality code

By following this testing strategy, the project aims to maintain a high standard of quality, performance, and accessibility throughout its development and maintenance lifecycle.
