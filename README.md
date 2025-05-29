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

# CSS Structure and Organization

Global CSS styles are managed in the `src/css/` directory.

- **`src/css/main.css`**: This is the primary stylesheet linked in all HTML files. It imports other CSS files in a specific order: variables, then base styles, then other categories like layout, components (global), and utilities.
- **`src/css/variables.css`**: Defines global CSS Custom Properties (design tokens) for colors, typography, spacing, etc.
- **`src/css/base/reset.css`**: Contains a minimal custom CSS reset to remove default browser margins, apply a universal box-sizing model, and set a few other sensible defaults.
- **`src/css/base/global.css`**: Includes essential global HTML and body styles, such as base `font-size`, `line-height` for `html`, default background/text colors for `body`, and responsive media defaults.
- **`src/css/base/typography.css`**: Sets the base `font-family` and `line-height` for the `body` and includes very minimal default styling for links. More opinionated typographic styling will be added later.
- **Modular Structure**: For better organization, CSS is further structured into subdirectories within `src/css/`:
    - `base/`: Contains `reset.css`, `global.css`, and `typography.css`.
    - `layout/`: For page structure, grid systems, and major layout elements (though many layout concerns for specific components will be handled within the Web Component styles themselves).
    - `components/`: For styling specific UI pieces that are *not* encapsulated as Web Components (if any). Styles for Web Components are defined within their respective Shadow DOMs.
    - `utils/`: For utility classes (e.g., margin/padding helpers, text alignment, visibility classes).

Individual CSS files within these directories will be imported into `main.css` as needed.

# HTML Structure & Templating

This project uses **Native Web Components** for creating reusable UI elements such as the site header, footer, and navigation. This approach helps maintain a DRY (Don't Repeat Yourself) HTML structure without requiring additional templating engine dependencies.

- Core components like `<site-header>` and `<site-footer>` are defined in `src/js/components/`.
- These components are then used directly in the HTML pages (e.g., `src/index.html`, `src/about.html`, `src/styleguide.html`).
- Parcel.js handles the bundling of these components as part of the standard JavaScript build process.

# Living Style Guide

A living style guide is available at `src/styleguide.html`. When running the development server (`npm run dev`), this page can be accessed to view and test all available Web Components, design tokens (colors, typography), and utility classes.
This page serves as a central reference for the UI of the website.

# Editor Configuration

This project includes a recommended editor configuration for VS Code and Cursor in the `.vscode/settings.json` file. This file includes settings for formatting (Prettier) and recommends some useful extensions for web development.

Since `.vscode/` is included in `.gitignore`, these settings are not committed to the repository and are intended for local development convenience. You may customize them further to your preferences. 

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

The `npm run build` command generates a production-ready static site in the `dist/` directory. This output consists of plain HTML, CSS, and JavaScript files that can be hosted on any static web hosting provider (like GitLab Pages, as intended for this project). Once built, the `dist/` directory is self-contained and does not require Parcel.js or Node.js to be served to users.

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