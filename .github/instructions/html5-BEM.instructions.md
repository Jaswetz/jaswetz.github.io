---
description: "Portfolio: Semantic HTML5 + BEM across all files."
applyTo: "*.html"
---

# HTML5 & BEM Guidelines

## Semantic HTML5 Structure

### Core Principles

- **Semantic Elements**: Use proper HTML5 semantic tags for content structure
- **Accessibility First**: Semantic markup supports screen readers and assistive technologies
- **SEO Benefits**: Search engines better understand content hierarchy
- **Maintainability**: Clear document structure improves code readability

### Required Semantic Elements

- `<header>` - Introductory content or navigation
- `<main>` - Primary content of the document
- `<section>` - Thematic grouping of content
- `<article>` - Self-contained content (blog posts, case studies)
- `<aside>` - Sidebar or supplementary content
- `<footer>` - Footer information
- `<nav>` - Navigation links

### Content Organization

- **Page Structure**: Use semantic elements to create clear content hierarchy
- **Heading Levels**: Maintain proper h1-h6 hierarchy for accessibility
- **Landmarks**: Use semantic elements as navigation landmarks

## BEM Methodology

### Naming Convention

- **Blocks**: Lowercase, descriptive names (e.g., `card`, `navigation`, `hero-section`)
- **Elements**: Use `__` separator (e.g., `card__title`, `navigation__link`)
- **Modifiers**: Use `--` separator (e.g., `card--featured`, `button--primary`)

### Implementation Rules

- **Single Responsibility**: Each block should have a single responsibility
- **Independent Styling**: Blocks should be independent and reusable
- **No Nested Selectors**: Avoid CSS nesting beyond BEM structure
- **Descriptive Names**: Use clear, descriptive class names

## Image Handling

### Alt Text Guidelines

- **Informative Images**: Provide descriptive alt text explaining the image content
- **Decorative Images**: Use `alt=""` for purely decorative images
- **Functional Images**: Alt text should describe the function, not appearance
- **Complex Images**: Consider additional description methods for complex images

### Image Optimization

- **Format Selection**: Use WebP with JPEG/PNG fallbacks
- **Responsive Images**: Implement `srcset` for different screen sizes
- **Lazy Loading**: Use `loading="lazy"` for performance
- **Dimensions**: Always specify `width` and `height` attributes

## Web Component Integration

### Custom Element Structure

- **Hyphenated Names**: All custom elements must contain hyphens
- **Shadow DOM**: Use Shadow DOM for style encapsulation
- **Accessibility**: Ensure custom elements are keyboard accessible

### Component Composition

- **Semantic Wrapping**: Use semantic elements within custom components
- **ARIA Support**: Provide appropriate ARIA attributes for custom elements
- **Focus Management**: Handle focus within Shadow DOM boundaries

## Example Implementation

### Page Structure

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Jason Swetzoff - UX Portfolio</title>
  </head>
  <body>
    <header class="site-header">
      <nav class="navigation">
        <ul class="navigation__list">
          <li class="navigation__item">
            <a href="/" class="navigation__link">Home</a>
          </li>
        </ul>
      </nav>
    </header>

    <main class="main-content">
      <section class="hero-section">
        <h1 class="hero-section__title">Welcome</h1>
        <p class="hero-section__description">UX Portfolio</p>
      </section>

      <section class="projects-section">
        <h2 class="projects-section__title">Featured Projects</h2>
        <div class="projects-grid">
          <article class="project-card project-card--featured">
            <header class="project-card__header">
              <h3 class="project-card__title">Project Title</h3>
            </header>
            <div class="project-card__content">
              <img
                src="project-image.jpg"
                alt="Project screenshot"
                class="project-card__image"
              />
              <p class="project-card__description">Project description</p>
            </div>
          </article>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p class="site-footer__copyright">© 2024 Jason Swetzoff</p>
    </footer>
  </body>
</html>
```

## Validation Checklist

- [ ] All content wrapped in appropriate semantic elements
- [ ] Proper heading hierarchy maintained
- [ ] All images have appropriate alt text
- [ ] BEM naming convention followed consistently
- [ ] No unnecessary div/span elements for structure
- [ ] Custom elements are keyboard accessible
- [ ] ARIA attributes used appropriately
- [ ] Image dimensions specified
- [ ] Lazy loading implemented where appropriate

## Related Guidelines

- **Accessibility**: See `accessibility.instructions.md`
- **CSS Architecture**: See main `copilot-instructions.md`
- **Component Creation**: See `AGENTS.md`
