---
description: "Enforce project naming and structure conventions across all files."
applyTo: "**"
---

# Project Naming Conventions

## File Naming Standards

### HTML, CSS, JS, and Asset Files

- **HTML/CSS/JS**: `kebab-case` (e.g., `about-us.html`, `main-styles.css`, `user-profile.js`)
- **Images and Assets**: `kebab-case` with descriptive names (e.g., `profile-picture-large.jpg`, `project-thumbnail-blue.png`)

### JavaScript Files

- **General scripts**: `kebab-case` (e.g., `api-handler.js`, `user-profile.js`)
- **Modules/classes**: `camelCase` or `PascalCase` (e.g., `UserProfile.js`)

### Web Components

- **Custom element names**: Must contain a hyphen (e.g., `<site-header>`, `<project-card>`)
- **Component files**: `PascalCase` in organized folders (e.g., `src/js/components/site-header/SiteHeader.js`)

## Folder Organization

- **All folders**: `kebab-case` (e.g., `src/content/project-archive`, `src/js/utility-functions`)
- **Component folders**: Match component name (e.g., `site-header/`, `project-card/`)

## CSS Class Naming

### BEM Methodology

- **Blocks**: Lowercase, no hyphens (e.g., `profile`, `card`)
- **Elements**: Use `__` separator (e.g., `profile__image`, `card__content`)
- **Modifiers**: Use `--` separator (e.g., `profile__image--rounded`, `card--featured`)

### Component-Specific Images

- For tightly coupled component images: Use BEM-style naming (e.g., `component__element.ext`)
- For general assets: Standard descriptive naming

## Examples

### File Structure

```
src/
├── js/
│   ├── components/
│   │   ├── site-header/
│   │   │   ├── SiteHeader.js
│   │   │   └── SiteHeader.css
│   │   └── project-card/
│   │       ├── ProjectCard.js
│   │       └── ProjectCard.css
│   └── utils/
│       └── api-handler.js
└── css/
    ├── main-styles.css
    └── component-header.css
```

### CSS Classes

```css
/* Block */
.card {
  ...;
}

/* Element */
.card__content {
  ...;
}
.card__image {
  ...;
}

/* Modifier */
.card--featured {
  ...;
}
.card__image--rounded {
  ...;
}
```

## Validation Checklist

- [ ] All HTML files use `kebab-case` naming
- [ ] All CSS files use `kebab-case` naming
- [ ] All JavaScript files follow appropriate casing conventions
- [ ] All folders use `kebab-case` naming
- [ ] Web components use `PascalCase` for files and contain hyphens in element names
- [ ] CSS classes follow BEM methodology
- [ ] Image files have descriptive, `kebab-case` names
