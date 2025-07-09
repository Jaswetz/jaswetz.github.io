---
description: "Portfolio: Semantic HTML5 + BEM across all files."
applyTo: "*.html"
---

- A11Y2. Semantic HTML5: Generate clean, semantic HTML5 structure using proper HTML5 elements.

## Requirements

- Use semantic HTML5 tags: `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>`.
- Wrap content in appropriate semantic containers based on its purpose (e.g. blog post → `<article>`, navigation → `<nav>`).
- A11Y5. Image `alt` Text: All `<img>` tags will have descriptive `alt` text for informative images, or `alt=""` for purely decorative images.
- Avoid `<div>` and `<span>` for structural layout unless absolutely necessary.
- **A11Y9. Web Component Accessibility:** Web Components will be developed with accessibility as a core requirement. This includes managing focus within Shadow DOM, providing appropriate ARIA roles and states for custom elements, and ensuring they are keyboard navigable.
- Use class names that follow the **BEM (Block\_\_Element--Modifier)** naming convention.
  - Block names are lowercase, no hyphens (e.g., `profile`)
  - Elements use `__` (e.g., `profile__image`)
  - Modifiers use `--` (e.g., `profile__image--rounded`)
- Do not generate styling or inline CSS.

## Example Output

```html
<main class="page">
  <article class="post post--featured">
    <header class="post__header">
      <h1 class="post__title">Semantic HTML Guide</h1>
    </header>
    <section class="post__content">
      <p class="post__text">Learn how to structure documents semantically.</p>
    </section>
    <footer class="post__footer">
      <p class="post__meta">Written by Jason</p>
    </footer>
  </article>
</main>
```
