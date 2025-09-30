# Font Loading Optimization

This document describes the font loading optimization implementation for the portfolio.

## Overview

The font loading optimization system implements three key strategies:

1. **Font-display: swap** for better perceived performance
2. **Preloading critical font files** to reduce loading time
3. **Progressive enhancement** with fallbacks for accessibility

## Implementation

### 1. Font-display: swap

All Google Fonts are loaded with `display=swap` parameter, which allows the browser to show fallback fonts immediately while web fonts are loading.

```html
<!-- Google Fonts with font-display: swap -->
<link
  href="https://fonts.googleapis.com/css2?family=Gentium+Plus:wght@400;700&family=Laila:wght@400;600&family=PT+Sans:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

### 2. Critical Font Preloading

The most important font files are preloaded to start downloading immediately:

```html
<!-- Preload critical font files -->
<link
  rel="preload"
  href="https://fonts.gstatic.com/s/gentiumplus/v6/Iura6YBj_oCad4hzLCCbvw.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="https://fonts.gstatic.com/s/laila/v13/LYjMdG_8nE8jDIRdiidIrEIu.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="https://fonts.gstatic.com/s/ptsans/v17/jizaRExUiTo99u79D0KExcOPIDU.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

### 3. Progressive Enhancement

The system uses multiple loading strategies for maximum compatibility:

- **Primary**: Preload with JavaScript fallback
- **Fallback**: Print media with JavaScript switch
- **Accessibility**: Noscript fallback for users without JavaScript

## Font Stack

The portfolio uses three font families:

- **Headings**: Laila (serif) with Times New Roman fallback
- **Body text**: Gentium Plus (serif) with Times New Roman fallback
- **UI elements**: PT Sans (sans-serif) with system font fallback

## CSS Implementation

### Font Loading States

```css
/* Before fonts load */
.fonts-loading {
  --font-family-heading: "Times New Roman", serif;
  --font-family-body: "Times New Roman", serif;
}

/* After fonts load */
.fonts-loaded {
  --font-family-heading: "Laila", "Times New Roman", serif;
  --font-family-body: "Gentium Plus", "Times New Roman", serif;
}
```

### Font Display Optimization

```css
/* Ensure font-display: swap for all text */
@supports (font-display: swap) {
  .fonts-loading * {
    font-display: swap;
  }
}
```

## JavaScript Font Optimizer

The `FontOptimizer` class provides advanced font loading features:

### Key Features

- **Performance monitoring**: Tracks font loading duration
- **Error handling**: Graceful fallbacks for failed font loads
- **Status tracking**: Monitors which fonts have loaded
- **Event system**: Dispatches `fontsloaded` event when ready

### Usage

```javascript
import { fontOptimizer } from "./utils/font-optimization.js";

// Check font loading status
const status = fontOptimizer.getStatus();
console.log("Loaded fonts:", status.loadedFonts);

// Wait for critical fonts
await fontOptimizer.waitForCriticalFonts();

// Listen for fonts loaded event
document.addEventListener("fontsloaded", (event) => {
  console.log("All fonts loaded:", event.detail.loadedFonts);
});
```

## Performance Benefits

### Core Web Vitals Impact

- **LCP (Largest Contentful Paint)**: Reduced by using system fonts initially
- **CLS (Cumulative Layout Shift)**: Minimized with font-display: swap
- **FCP (First Contentful Paint)**: Improved with immediate fallback rendering

### Bundle Size

- **Font optimizer**: ~3KB gzipped
- **CSS additions**: ~1KB gzipped
- **Total overhead**: <5KB for significant performance gains

## Browser Support

- **Modern browsers**: Full support with preload and font-display
- **Legacy browsers**: Graceful degradation to standard font loading
- **No JavaScript**: Noscript fallback ensures fonts still load

## Maintenance

### Adding New Fonts

1. Update the critical fonts list in `FontOptimizer.preloadCriticalFonts()`
2. Add preload links to HTML templates
3. Update CSS font stacks in `variables.css`
4. Run `npm run optimize:fonts` to update all HTML files

### Performance Monitoring

The system automatically logs warnings if font loading takes >1000ms:

```javascript
// Automatic performance monitoring
if (measure.duration > 1000) {
  console.warn(
    `Font loading took ${Math.round(measure.duration)}ms - consider optimizing`
  );
}
```

## Scripts

- `npm run optimize:fonts` - Apply font optimization to all HTML files
- `npm run test:bundle-size` - Verify font loading doesn't exceed budgets

## Files

- `src/js/utils/font-optimization.js` - Main font optimizer class
- `src/css/base/font-loading.css` - Font loading CSS
- `scripts/optimize-font-loading.js` - HTML optimization script
- `tests/unit/font-optimization.test.js` - Unit tests

## Best Practices

1. **Always preload critical fonts** used above the fold
2. **Use font-display: swap** for better perceived performance
3. **Provide system font fallbacks** with similar metrics
4. **Monitor font loading performance** in production
5. **Test without JavaScript** to ensure accessibility

This optimization reduces font loading impact on Core Web Vitals while maintaining excellent typography and accessibility.
