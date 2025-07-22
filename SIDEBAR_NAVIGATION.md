# Sidebar Navigation System

## Overview

The sidebar navigation system provides smooth scrolling and automatic section highlighting for case study pages. It consists of both a reusable Web Component and inline implementations for enhanced user experience when reading long-form content.

## Architecture

### Components

1. **SidebarNavigation Web Component** (`src/js/components/sidebar-navigation/SidebarNavigation.js`)

   - Reusable component for general sidebar navigation
   - Uses Intersection Observer API for performance
   - Handles scroll spy and smooth scrolling

2. **Inline Navigation Scripts** (in case study HTML files)
   - Page-specific implementations for case studies
   - Enhanced offset calculations for proper scroll positioning
   - Optimized for case study content structure

## Features

### Scroll Spy Functionality

- **Automatic Highlighting**: Navigation links automatically highlight as users scroll through sections
- **Intersection Observer**: Uses modern browser API for efficient scroll detection
- **Multiple Thresholds**: Supports various section detection scenarios

### Smooth Scrolling

- **Dynamic Offset Calculation**: Accounts for fixed headers and optimal reading position
- **Cross-Browser Support**: Works consistently across modern browsers
- **Keyboard Accessible**: Full keyboard navigation support

### Performance Optimizations

- **Throttled Events**: Scroll events are optimized to prevent performance issues
- **Efficient Detection**: Uses Intersection Observer instead of scroll event listeners where possible
- **Memory Management**: Proper cleanup of observers and event listeners

## Implementation

### Case Study Pages

Case study pages use enhanced inline scripts with the following features:

```javascript
// Dynamic offset calculation
function calculateOffset() {
  const header =
    document.querySelector("site-header") || document.querySelector("header");
  return (header ? header.offsetHeight : 0) + 20;
}

// Enhanced section detection
const sections = document.querySelectorAll("section[id], h2[id]");

// Improved scroll positioning
const offsetPosition = elementPosition - calculateOffset();
window.scrollTo({
  top: Math.max(0, offsetPosition),
  behavior: "smooth",
});
```

### Web Component Usage

For general pages, use the SidebarNavigation component:

```javascript
import SidebarNavigation from "./components/sidebar-navigation/SidebarNavigation.js";

// Initialize on pages with sidebar navigation
if (document.querySelector(".sidebar-nav")) {
  new SidebarNavigation();
}
```

## Current Issues & Implementation Status

### Issue 1: Scroll Spy Highlighting

**Problem**: The "The Problem" section and other sections aren't being highlighted correctly during scroll.

**Status**: 🔄 **In Progress** - Enhanced section detection logic is being implemented in the SidebarNavigation component.

**Current Implementation**:

- 🔄 Enhanced `setupNavLinks()` method with multiple fallback strategies for section detection (Task 1 - In Progress)
- ⏳ Improved intersection observer with multiple thresholds and dynamic root margins (Task 3 - Planned)
- ⏳ Better handling of various HTML structures (`section[id]`, `h2[id]`, nested elements) (Task 1 - In Progress)
- ❌ Scroll positioning still needs dynamic offset calculation for proper header clearance

### Issue 2: Scroll Positioning

**Problem**: Section headers appear too low on the page when clicking navigation links due to fixed header overlap.

**Status**: 🔄 **In Progress** - Dynamic offset calculation system is being developed.

**Current Implementation**:

- ✅ Basic dynamic offset calculation in intersection observer setup
- ❌ Click handler still uses basic `scrollIntoView()` without proper offset
- ❌ Inline script implementations need updating with enhanced logic

**Planned Solution**:

- Implement `calculateScrollOffset()` method that dynamically calculates header height
- Account for site-header web component height and additional padding
- Update scroll positioning to use dynamic offset instead of fixed values

### Implementation Progress

See [.kiro/specs/case-study-navigation-fix/tasks.md](/.kiro/specs/case-study-navigation-fix/tasks.md) for detailed implementation progress and task tracking.

## Browser Support

- **Modern Browsers**: Full support with Intersection Observer API
- **Legacy Browsers**: Graceful fallback to scroll-based detection
- **Mobile Devices**: Touch-friendly scrolling with proper offset calculations

## Testing

### Manual Testing Checklist

- [ ] All navigation links highlight correctly when scrolling
- [ ] Clicking navigation links scrolls to proper position
- [ ] Section headers are not hidden behind fixed header
- [ ] Smooth scrolling works consistently
- [ ] Keyboard navigation functions properly
- [ ] Mobile touch scrolling works correctly

### Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Mobile Chrome

## Future Enhancements

### Planned Improvements

- [ ] Unified component system for all pages
- [ ] Enhanced accessibility features
- [ ] Progress indicator for long case studies
- [ ] Improved mobile navigation experience

### Performance Optimizations

- [ ] Lazy loading for long case studies
- [ ] Virtual scrolling for extensive content
- [ ] Reduced JavaScript bundle size

## Troubleshooting

### Common Issues

**Navigation not highlighting**

- Check that sections have proper `id` attributes
- Verify navigation links use correct `href="#section-id"` format
- Ensure Intersection Observer is supported or fallback is working

**Incorrect scroll positioning**

- Verify header height calculation is accurate
- Check for CSS transforms that might affect `offsetTop` calculations
- Test with different viewport sizes

**Performance issues**

- Monitor scroll event frequency
- Check for memory leaks in observer cleanup
- Verify throttling is working correctly

## Related Files

- `src/js/components/sidebar-navigation/SidebarNavigation.js` - Main component
- `src/projects/project-adsk-notification.html` - Example implementation
- `src/css/components/navigation.css` - Navigation styling
- `.kiro/specs/case-study-navigation-fix/` - Implementation specifications
