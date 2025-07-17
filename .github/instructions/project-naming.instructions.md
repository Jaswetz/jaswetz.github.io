---
description: "Enforce project naming and structure conventions across all files."
applyTo: "**"
---

# Folder Names

- Use `kebab-case`, e.g. `src/content/project-archive`, `src/js/utility-functions`.

# HTML, CSS, JS, and Asset Files

- HTML, CSS, images, assets → `kebab-case`, e.g. `about-us.html`, `main-styles.css`, `profile-picture-large.jpg`.
- JS files:
  - General scripts → `kebab-case`: `api-handler.js`, `user-profile.js`.
  - Modules / classes → `camelCase` or `PascalCase`: `UserProfile.js`.

# Web Components

- Custom element names **must contain a hyphen**, e.g. `<site-header>`, `<project-card>`.
- Component JS files → `PascalCase`, organized under `src/js/components/ComponentName/`, e.g. `src/js/components/site-header/SiteHeader.js`.

# Image and Asset Files

Use `kebab-case` with descriptive names.

- Example: `profile-picture-large.jpg`
- Example: `project-thumbnail-blue.png`

## Use BEM naming for specific component images

- For images tightly tied to specific components (e.g., thumbnails, icons), using block\_\_element.ext might make sense.
- For general assets like backgrounds or logos, standard naming is better.
