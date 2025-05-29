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
It correctly bundles your code in production mode and optimizes the build for the best performance.

The build is minified and the filenames include hashes for cache busting. 