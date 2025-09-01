---
description: "Keep a Styleguide for every component"
applyTo: "**"
---

# Living Style Guide

## Overview

A comprehensive, living style guide is maintained at `src/styleguide.html` to ensure design system consistency and component documentation.

## Purpose & Benefits

### Development Reference

- **Central Hub**: Single source of truth for all design tokens, components, and utilities
- **Component Showcase**: Preview all Web Components in one location
- **Design Token Reference**: Visual examples of colors, typography, and spacing
- **Consistency Check**: Spot design inconsistencies before they propagate

### Quality Assurance

- **Visual Testing**: Verify component appearance across different states
- **Responsive Testing**: Check component behavior on various screen sizes
- **Accessibility Testing**: Ensure components meet WCAG guidelines
- **Cross-browser Testing**: Validate appearance across supported browsers

## Maintenance Workflow

### When Adding New Components

1. **Component Creation**: Develop the Web Component following established patterns
2. **Style Guide Update**: Add component preview to `src/styleguide.html`
3. **Documentation**: Include usage examples and code snippets
4. **Testing**: Verify component displays correctly in style guide

### When Updating Design Tokens

1. **Token Modification**: Update values in `src/css/variables.css`
2. **Style Guide Update**: Add/modify visual examples in style guide
3. **Component Review**: Check impact on existing components
4. **Testing**: Validate changes across all components

### When Adding Utility Classes

1. **Utility Creation**: Add new utilities to appropriate CSS layer
2. **Documentation**: Include usage examples in style guide
3. **Examples**: Provide visual demonstrations of utility effects
4. **Guidelines**: Document when and how to use each utility

## Style Guide Structure

### Design Tokens Section

```html
<section class="styleguide-section">
  <h2>Design Tokens</h2>
  <div class="token-showcase">
    <!-- Color swatches -->
    <!-- Typography examples -->
    <!-- Spacing demonstrations -->
  </div>
</section>
```

### Component Showcase

```html
<section class="styleguide-section">
  <h2>Components</h2>
  <div class="component-examples">
    <!-- Web Component previews -->
    <!-- Usage examples -->
    <!-- Code snippets -->
  </div>
</section>
```

### Utility Classes

```html
<section class="styleguide-section">
  <h2>Utility Classes</h2>
  <div class="utility-examples">
    <!-- Spacing utilities -->
    <!-- Typography utilities -->
    <!-- Layout utilities -->
  </div>
</section>
```

## Development Server Integration

### Local Development

- **Access**: Navigate to `/styleguide.html` during development
- **Hot Reload**: Changes reflect immediately with `npm run dev`
- **Testing**: Use style guide for component development and testing

### Production Validation

- **Build Check**: Ensure style guide builds correctly
- **Link Validation**: Verify all internal links work
- **Performance**: Confirm style guide meets performance budgets

## Best Practices

### Documentation Standards

- **Clear Examples**: Provide practical usage examples
- **Code Snippets**: Include HTML, CSS, and JavaScript examples
- **State Variations**: Show components in different states (hover, focus, active)
- **Responsive Examples**: Demonstrate responsive behavior

### Maintenance Guidelines

- **Regular Updates**: Keep style guide current with codebase changes
- **Version Control**: Track style guide changes alongside component updates
- **Team Collaboration**: Use style guide for design and development alignment
- **User Testing**: Reference style guide during user testing preparations

## Integration with Development Workflow

### Component Development

1. Create component following established patterns
2. Add component to style guide for testing
3. Verify component appearance and behavior
4. Update style guide with final implementation

### Design System Updates

1. Modify design tokens in `variables.css`
2. Update style guide examples
3. Review component impacts
4. Validate changes across all components

## Quality Assurance

### Automated Checks

- **Build Validation**: Ensure style guide builds without errors
- **Link Checking**: Verify all internal links are functional
- **Performance Testing**: Confirm style guide meets performance budgets

### Manual Review

- **Visual Consistency**: Check component alignment with design system
- **Accessibility**: Verify all components meet WCAG guidelines
- **Responsive Design**: Test across all supported breakpoints
- **Cross-browser**: Validate appearance in all supported browsers

## Related Documentation

- **Component Creation**: See `AGENTS.md` for component development guidelines
- **Design Tokens**: See `src/css/variables.css` for token definitions
- **CSS Architecture**: See main `copilot-instructions.md` for styling guidelines
- **Testing**: See `Docs/TESTING.md` for quality assurance procedures
