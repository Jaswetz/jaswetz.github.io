# Case Study Navigation Fix Design

## Overview

This design addresses the navigation issues in case study pages by improving the scroll spy functionality and scroll positioning. The solution involves refactoring the existing inline JavaScript into a more robust system that properly handles section detection and scroll offset calculations.

## Architecture

### Current Implementation Analysis

The current implementation uses inline JavaScript at the bottom of `project-adsk-notification.html` with these components:

- Manual section detection using `querySelectorAll("section[id], h2[id]")`
- Basic scroll event listener with offset calculation
- Simple active state management

**Issues Identified:**

1. The scroll detection logic doesn't properly handle all section types
2. The offset calculation (`section.offsetTop - 100`) is inconsistent
3. The intersection detection logic has edge cases that cause highlighting failures
4. The scroll positioning uses a fixed offset that doesn't account for dynamic header heights

### Proposed Architecture

The solution will enhance the existing `SidebarNavigation` component to handle case study pages more effectively:

```
┌─────────────────────────────────────┐
│           Case Study Page           │
├─────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────┐│
│  │  Sidebar Nav    │ │   Content   ││
│  │                 │ │             ││
│  │ • Project Sum.  │ │ <section>   ││
│  │ • The Problem   │ │ <section>   ││
│  │ • Process       │ │ <section>   ││
│  │ • Results       │ │ <section>   ││
│  └─────────────────┘ └─────────────┘│
└─────────────────────────────────────┘
```

## Components and Interfaces

### Enhanced SidebarNavigation Component

**File:** `src/js/components/sidebar-navigation/SidebarNavigation.js`

The existing component will be enhanced with:

#### Improved Section Detection

```javascript
setupNavLinks() {
  const links = this.sidebarNav.querySelectorAll("a[href^=\"#\"]");

  links.forEach((link) => {
    const targetId = link.getAttribute("href").substring(1);
    // Enhanced selector to catch both section[id] and h2[id]
    const targetSection = document.querySelector(`#${targetId}, section:has(#${targetId}), section:has(h2#${targetId})`);

    if (targetSection) {
      this.navLinks.push({
        link: link,
        section: targetSection,
        id: targetId,
      });
      this.sections.push(targetSection);
    }
  });
}
```

#### Dynamic Offset Calculation

```javascript
calculateScrollOffset() {
  const header = document.querySelector('site-header') || document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 0;
  const additionalPadding = 20; // Comfortable reading space
  return headerHeight + additionalPadding;
}
```

#### Improved Intersection Observer

```javascript
setupIntersectionObserver() {
  const dynamicOffset = this.calculateScrollOffset();
  const options = {
    root: null,
    rootMargin: `-${dynamicOffset}px 0px -60% 0px`,
    threshold: [0, 0.1, 0.5, 1.0] // Multiple thresholds for better detection
  };

  this.observer = new IntersectionObserver((entries) => {
    this.handleIntersection(entries);
  }, options);

  this.sections.forEach((section) => {
    this.observer.observe(section);
  });
}
```

### Scroll Positioning Enhancement

#### Smooth Scroll with Dynamic Offset

```javascript
scrollToSection(section) {
  const offset = this.calculateScrollOffset();
  const elementPosition = section.offsetTop;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: Math.max(0, offsetPosition), // Prevent negative scroll
    behavior: "smooth",
  });
}
```

### Fallback for Inline Implementation

For pages that haven't been migrated to use the component, enhance the inline script:

```javascript
// Enhanced inline script with better section detection and offset calculation
function initCaseStudyNavigation() {
  const sections = document.querySelectorAll("section[id], h2[id]");
  const navLinks = document.querySelectorAll(".sidebar-nav a");

  function calculateOffset() {
    const header =
      document.querySelector("site-header") || document.querySelector("header");
    return (header ? header.offsetHeight : 0) + 20;
  }

  function updateActiveNav() {
    let current = "";
    const scrollY = window.pageYOffset;
    const offset = calculateOffset();

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - offset;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  // Throttled scroll handler for better performance
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveNav, 10);
  });

  updateActiveNav();

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const offset = calculateOffset();
        const elementPosition = targetSection.offsetTop;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
      }
    });
  });
}
```

## Data Models

### Navigation Link Model

```javascript
{
  link: HTMLElement,      // The anchor element
  section: HTMLElement,   // The target section element
  id: string,            // The section ID
  isVisible: boolean,    // Current visibility state
  intersectionRatio: number // Current intersection ratio
}
```

### Scroll State Model

```javascript
{
  currentSection: string,    // Currently active section ID
  scrollDirection: string,   // 'up' or 'down'
  headerOffset: number,      // Dynamic header height
  isScrolling: boolean       // Scroll animation state
}
```

## Error Handling

### Missing Elements

- Gracefully handle missing sidebar navigation
- Fallback when target sections don't exist
- Default behavior when JavaScript fails

### Performance Considerations

- Throttle scroll events to prevent excessive calculations
- Use `requestAnimationFrame` for smooth updates
- Cleanup observers on component destruction

### Browser Compatibility

- Feature detection for Intersection Observer API
- Fallback to scroll-based detection for older browsers
- Polyfill for smooth scroll behavior if needed

## Testing Strategy

### Unit Tests

- Test section detection logic with various HTML structures
- Verify offset calculations with different header configurations
- Test active state management with rapid navigation

### Integration Tests

- Test scroll spy functionality across different viewport sizes
- Verify smooth scrolling behavior with various content lengths
- Test navigation highlighting with dynamic content

### Cross-Browser Testing

- Verify functionality in Chrome, Firefox, Safari, and Edge
- Test on mobile devices with touch scrolling
- Validate accessibility with keyboard navigation

### Performance Testing

- Monitor scroll event handler performance
- Test with long case studies (many sections)
- Verify memory cleanup when navigating away from pages
