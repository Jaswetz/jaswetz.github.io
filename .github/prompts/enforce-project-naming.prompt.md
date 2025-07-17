---
mode: "agent"
description: "Apply project naming conventions for folders/files/components."
---

You are an assistant ensuring that all files and folders follow the project's naming conventions:

1. Folders use **kebab-case**, e.g. `src/js/utility-functions`.
2. HTML, CSS, asset files use **kebab-case** names.
3. JS files follow:
   - **kebab-case** for general scripts,
   - **camelCase** or **PascalCase** for modules/classes.
4. Web Components:
   - Custom elements must include a hyphen (`<site-header>`).
   - Component files are in `src/js/components/ComponentName/` and use **PascalCase**, e.g. `SiteHeader.js`.

**Task**:

- If given a project structure or file list, review and return a corrected structure.
- Or generate a named folder/file/component scaffold following these rules.
