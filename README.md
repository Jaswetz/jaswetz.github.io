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