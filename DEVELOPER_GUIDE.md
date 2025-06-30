# Interactive States Developer Guide

## 🎯 Overview

This guide documents the DRY interactive states system implemented across the website. The system provides consistent, accessible, and maintainable interactive feedback for all user interface elements.

## 📁 System Architecture

### Core Files

- `src/css/variables.css` - Central variable definitions
- `src/css/components/accessibility.css` - Accessibility-specific styles
- Component-specific CSS files implementing the variable system

### Variable Categories

#### Transform Variables

```css
--hover-transform: translateY(-2px); /* Standard hover lift */
--active-transform: scale(0.98); /* Click feedback */
--hover-transform-card: scale(1.02); /* Card hover growth */
```

#### Shadow Variables

```css
--hover-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Standard hover shadow */
--active-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Active/pressed shadow */
--hover-shadow-large: 0 8px 24px rgba(0, 0, 0, 0.2); /* Enhanced hover shadow */
--focus-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2); /* Focus ring shadow */
```

#### Focus Variables

```css
--focus-outline: 2px solid var(--primary); /* Standard focus outline */
--focus-shadow-enhanced: 0 0 0 3px rgba(var(--primary-rgb), 0.3); /* Enhanced focus */
```

#### Transition Variables

```css
--transition-interactive: all 0.2s ease; /* Standard interactive transition */
--transition-quick: all 0.1s ease; /* Quick feedback transition */
```

## 🛠️ Implementation Patterns

### Standard Button Pattern

```css
.button {
  transition: var(--transition-interactive);
}

.button:hover {
  transform: var(--hover-transform);
  box-shadow: var(--hover-shadow);
}

.button:focus {
  outline: var(--focus-outline);
  outline-offset: 2px;
  box-shadow: var(--focus-shadow);
}

.button:active {
  transform: var(--active-transform);
  box-shadow: var(--active-shadow);
}
```

### Card Interaction Pattern

```css
.card {
  transition: var(--transition-interactive);
}

.card:hover {
  transform: var(--hover-transform-card);
  box-shadow: var(--hover-shadow-large);
}

.card:focus-within {
  outline: var(--focus-outline);
  outline-offset: 2px;
}
```

### Form Element Pattern

```css
.form-input {
  transition: var(--transition-interactive);
  border: 2px solid var(--border-color);
}

.form-input:focus {
  outline: var(--focus-outline);
  outline-offset: 2px;
  border-color: var(--primary);
  box-shadow: var(--focus-shadow-enhanced);
}

.form-input:hover {
  border-color: var(--primary-light);
}
```

## 🎨 Customization Guidelines

### Adding New Interactive Elements

1. **Use Existing Variables First**

   ```css
   .new-element:hover {
     transform: var(--hover-transform);
     box-shadow: var(--hover-shadow);
   }
   ```

2. **Create New Variables When Needed**

   ```css
   /* In variables.css */
   --hover-transform-special: scale(1.05) rotate(1deg);

   /* In component CSS */
   .special-element:hover {
     transform: var(--hover-transform-special);
   }
   ```

3. **Follow Naming Convention**
   - `--hover-*` for hover state properties
   - `--focus-*` for focus state properties
   - `--active-*` for active/pressed state properties
   - `--transition-*` for timing functions

### Variable Naming Best Practices

#### ✅ Good Examples

```css
--hover-transform-card
--focus-shadow-enhanced
--transition-interactive
--active-transform-button
```

#### ❌ Avoid

```css
--blue-shadow (too specific)
--big-transform (not semantic)
--fast-transition (unclear context)
```

## 🔧 Maintenance Procedures

### Adding New Interactive States

1. **Identify the Interaction Type**

   - Standard hover/focus/active
   - Specialized component behavior
   - Accessibility requirements

2. **Check Existing Variables**

   - Review `variables.css` for suitable options
   - Test with existing patterns first

3. **Create Variables if Needed**

   - Add to appropriate section in `variables.css`
   - Use semantic naming convention
   - Document the purpose

4. **Implement Consistently**
   - Apply to all similar components
   - Test across different devices
   - Validate accessibility compliance

### Updating Existing States

1. **Change Variables, Not Implementations**

   ```css
   /* ✅ Good - Change in variables.css */
   --hover-transform: translateY(-3px); /* Updated from -2px */

   /* ❌ Avoid - Changing individual components */
   .button:hover {
     transform: translateY(-3px);
   }
   ```

2. **Test Propagation**
   - Verify changes apply across all components
   - Check for any visual conflicts
   - Validate accessibility standards

## 📱 Accessibility Requirements

### Mandatory Features

1. **Focus Management**

   ```css
   .interactive:focus {
     outline: var(--focus-outline);
     outline-offset: 2px;
   }
   ```

2. **Touch Targets**

   ```css
   .touch-target {
     min-height: var(--touch-target-min); /* 44px */
     min-width: var(--touch-target-min);
   }
   ```

3. **Reduced Motion Support**
   ```css
   @media (prefers-reduced-motion: reduce) {
     .interactive {
       transform: none !important;
       transition: color 0.2s ease;
     }
   }
   ```

### Testing Checklist

- [ ] All interactive elements have visible focus indicators
- [ ] Touch targets meet 44px minimum requirement
- [ ] Keyboard navigation works without mouse
- [ ] Screen readers can access all interactive content
- [ ] Reduced motion preferences are respected
- [ ] High contrast mode maintains functionality

## 🚀 Performance Considerations

### Optimized Properties

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, or `position`
- Use `will-change` sparingly and remove after animations

### Efficient Patterns

```css
/* ✅ Good - GPU accelerated */
.element:hover {
  transform: var(--hover-transform);
  opacity: 0.8;
}

/* ❌ Avoid - Causes layout recalculation */
.element:hover {
  width: calc(100% + 10px);
  height: auto;
}
```

## 🔍 Debugging Interactive States

### Common Issues

1. **Variables Not Applied**

   - Check variable is defined in `variables.css`
   - Verify correct variable name spelling
   - Ensure proper CSS cascade order

2. **Focus States Not Visible**

   - Check for `outline: none` overrides
   - Verify focus selector specificity
   - Test with keyboard navigation

3. **Touch Targets Too Small**
   - Use browser dev tools to measure
   - Apply `--touch-target-min` variable
   - Test on actual mobile devices

### Development Tools

- **Browser DevTools**: Inspect computed styles and variable values
- **Accessibility Inspector**: Validate focus management and ARIA
- **Lighthouse**: Audit accessibility and performance

## 📖 Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Custom Properties Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)

---

**System Status**: ✅ Fully Implemented and Documented  
**Last Updated**: Current Implementation  
**Development Server**: http://localhost:8080
