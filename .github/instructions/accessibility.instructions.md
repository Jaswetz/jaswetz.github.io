---
description: Accessibility should meet WCAG 2.1 Level AA
applyTo: "**"
---

# Accessibility Guidelines

This project commits to an "Accessibility-by-Design" approach, integrating accessibility considerations throughout the development lifecycle.

## WCAG 2.1 AA Compliance

### Core Requirements

- **WCAG 2.1 Level AA**: Primary goal for all features and components
- **Keyboard Navigation**: All interactive elements must be fully operable via keyboard
- **Focus Management**: Clear, visible focus states for all interactive elements
- **Screen Reader Support**: Proper semantic HTML and ARIA labels where needed

### Color & Contrast

- **Text Contrast**: Minimum 4.5:1 ratio for normal text
- **Large Text**: Minimum 3:1 ratio for large text (18pt+ or 14pt+ bold)
- **Interactive Elements**: Same contrast requirements as text
- **Color Independence**: Information not conveyed by color alone

### Responsive Design

- **Zoom Support**: Text must be resizable up to 200% without loss of functionality
- **Touch Targets**: Minimum 44px for mobile touch targets
- **Viewport Adaptation**: Responsive across all screen sizes and orientations

## Implementation Guidelines

### Semantic HTML

- Use proper heading hierarchy (h1-h6) for content structure
- Implement landmark roles with semantic elements (`<header>`, `<main>`, `<nav>`, etc.)
- Provide descriptive `alt` text for all images
- Use appropriate form elements with labels

### ARIA Implementation

- **Progressive Enhancement**: Use native HTML first, ARIA as enhancement
- **Live Regions**: For dynamic content updates
- **Error Handling**: Clear error messages associated with form fields
- **Custom Components**: Proper ARIA roles and states for Web Components

### Keyboard Accessibility

- **Tab Order**: Logical navigation through interactive elements
- **Focus Indicators**: Visible focus states (not just browser defaults)
- **Keyboard Shortcuts**: Where appropriate, with clear documentation
- **Modal Handling**: Proper focus trapping and restoration

## Testing & Validation

### Automated Testing

```bash
npm run test:accessibility:local  # Axe-core automated testing
```

### Manual Testing Checklist

- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces content correctly
- [ ] Focus management is appropriate
- [ ] Color contrast meets 4.5:1 ratio minimum
- [ ] All images have appropriate alt text
- [ ] Form validation provides clear error messages
- [ ] Zoom to 200% maintains functionality
- [ ] Touch targets are at least 44px on mobile

### Browser Testing

- Test with keyboard-only navigation
- Verify screen reader compatibility
- Check high contrast mode support
- Test with browser zoom functionality

## Web Component Accessibility

### Shadow DOM Considerations

- Ensure focus management works across shadow boundaries
- Provide proper ARIA attributes for custom elements
- Test keyboard navigation within components
- Maintain accessibility tree integrity

### Component Documentation

- Document keyboard interactions
- Specify required ARIA attributes
- Include accessibility testing procedures
- Provide screen reader testing guidance

## Forms & Interactive Elements

### Form Accessibility

- Associate labels with form controls
- Provide clear error messages
- Support keyboard form submission
- Implement proper validation feedback

### Dynamic Content

- Use ARIA live regions for status updates
- Provide clear feedback for user actions
- Ensure dynamic content is keyboard accessible
- Maintain focus context during updates

## Resources & References

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Accessibility Resources](https://webaim.org/resources/)
- [Axe-core Documentation](https://github.com/dequelabs/axe-core)

## Validation Checklist

- [ ] WCAG 2.1 AA compliance verified
- [ ] Keyboard accessibility tested
- [ ] Screen reader compatibility confirmed
- [ ] Color contrast ratios validated
- [ ] Touch targets meet minimum size requirements
- [ ] Zoom functionality preserved
- [ ] Automated accessibility tests pass
