---
description: "Keep a Styleguide for every component"
applyTo: "**"
---

- A “living style guide” is available at `src/styleguide.html`.
- When running the development server (`npm run dev`), this page serves as:
  - A **central reference** for all **Web Components**, **design tokens** (colors, typography), and **utility classes**.
  - A **test environment** to preview components, verify styles, and spot design consistency issues.
- **Whenever you add a new component, style, or layout**, update `src/styleguide.html` accordingly:
  - **Add component previews** (e.g., custom elements) and code snippets.
  - **Include updated design token samples**, such as new color swatches or typography scales.
  - **Showcase new utility classes** with visual examples and usage notes.
- A live, "always in sync" style guide reduces duplication and keeps documentation directly tied to the current codebase:contentReference[oaicite:1]{index=1}.
