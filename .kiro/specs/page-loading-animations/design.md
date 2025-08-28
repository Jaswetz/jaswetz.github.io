# Design Document

## Overview

The page loading animations feature will provide smooth, professional visual feedback during page loads and transitions throughout Jason Swetzoff's UX portfolio. The system will use a minimal, elegant approach that aligns with the portfolio's design language while maintaining optimal performance and accessibility standards.

## Architecture

### Core Components

1. **Loading Overlay Component** - A full-screen overlay that appears during page loads
2. **Animation Controller** - JavaScript module managing animation lifecycle and timing
3. **Accessibility Manager** - Handles motion preferences and screen reader announcements
4. **Performance Monitor** - Ensures animations don't impact Core Web Vitals

### Integration Points

- **CSS Layer System**: Loading animations will be added to the `components` layer in the existing cascade layer architecture
- **Web Components**: The loading system will integrate with existing Web Components (SiteHeader, SiteFooter)
- **Main.js Integration**: Animation controller will be initialized in the main.js entry point
- **Performance Budget**: Must stay within existing limits (JS <30KB, CSS <70KB)

## Components and Interfaces

### 1. PageLoader Web Component

```javascript
class PageLoader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupAnimations();
  }

  show() {
    /* Display loading animation */
  }
  hide() {
    /* Hide loading animation with fade out */
  }
  updateProgress(percentage) {
    /* Optional progress indicator */
  }
}
```

### 2. Animation Controller Module

```javascript
class AnimationController {
  constructor() {
    this.loader = null;
    this.isLoading = false;
    this.respectsReducedMotion = false;
  }

  init() {
    /* Initialize loader and event listeners */
  }
  showLoader() {
    /* Display loading animation */
  }
  hideLoader() {
    /* Hide loading animation */
  }
  checkMotionPreferences() {
    /* Detect prefers-reduced-motion */
  }
}
```

### 3. CSS Animation System

The animations will use CSS custom properties from the existing design system:

- **Colors**: `--color-primary`, `--color-background`
- **Timing**: `--transition-interactive`, `--transition-base`
- **Spacing**: `--space-m`, `--space-l`
- **Typography**: `--font-family-sans`

## Data Models

### Loading State Interface

```typescript
interface LoadingState {
  isVisible: boolean;
  progress?: number;
  message?: string;
  reducedMotion: boolean;
  startTime: number;
  minDisplayTime: number; // Minimum 300ms to prevent flashing
}
```

### Animation Configuration

```typescript
interface AnimationConfig {
  duration: number;
  easing: string;
  fadeInDelay: number;
  fadeOutDelay: number;
  minimumDisplayTime: number;
  respectMotionPreferences: boolean;
}
```

## Animation Design Specifications

### Visual Design

1. **Loading Spinner**: Subtle rotating circle using the primary color (`--color-primary`)
2. **Background Overlay**: Semi-transparent white background (`rgba(255, 255, 255, 0.95)`)
3. **Typography**: Optional loading text using `--font-family-sans`
4. **Positioning**: Fixed overlay covering entire viewport

### Animation Timing

- **Fade In**: 200ms ease-out when loading starts
- **Spinner Rotation**: 1.2s linear infinite rotation
- **Fade Out**: 300ms ease-in when content is ready
- **Minimum Display**: 300ms to prevent flashing on fast loads

### Reduced Motion Support

When `prefers-reduced-motion: reduce` is detected:

- Replace spinner rotation with subtle pulse animation
- Use opacity transitions instead of transforms
- Reduce animation duration by 50%
- Provide static loading indicator as fallback

## Error Handling

### Graceful Degradation

1. **No JavaScript**: Page loads normally without animations
2. **Animation Failure**: Fallback to instant content display
3. **Performance Issues**: Automatic animation disable if frame rate drops
4. **Accessibility Conflicts**: Override animations for assistive technology users

### Error Recovery

```javascript
try {
  // Animation code
} catch (error) {
  console.warn("Loading animation failed:", error);
  // Immediately show content without animation
  this.showContentImmediately();
}
```

## Testing Strategy

### Unit Tests

1. **Animation Controller**: Test show/hide methods, timing, and state management
2. **Motion Preferences**: Verify reduced motion detection and fallbacks
3. **Performance**: Ensure animations don't block main thread

### Integration Tests

1. **Page Load Flow**: Test complete loading sequence from start to content display
2. **Web Component Integration**: Verify compatibility with existing components
3. **Cross-browser**: Test animation performance across supported browsers

### Accessibility Tests

1. **Screen Reader**: Verify loading announcements work correctly
2. **Keyboard Navigation**: Ensure loading state doesn't trap focus
3. **Motion Sensitivity**: Test reduced motion preferences are respected

### Performance Tests

1. **Bundle Size**: Verify addition stays within performance budget
2. **Core Web Vitals**: Ensure no negative impact on LCP, CLS, FID
3. **Animation Performance**: Monitor frame rates during animations

## Implementation Phases

### Phase 1: Core Infrastructure

- Create PageLoader Web Component
- Implement basic show/hide functionality
- Add CSS animations with reduced motion support

### Phase 2: Integration

- Integrate with main.js and existing page structure
- Add animation controller for lifecycle management
- Implement accessibility features

### Phase 3: Enhancement

- Add optional progress indicators
- Optimize animation performance
- Add error handling and fallbacks

### Phase 4: Testing & Polish

- Comprehensive testing across browsers and devices
- Performance optimization
- Documentation and code comments

## Performance Considerations

### CSS Optimizations

- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating layout properties (`width`, `height`, `margin`)
- Use `will-change` property sparingly and remove after animation

### JavaScript Optimizations

- Use `requestAnimationFrame` for smooth animations
- Debounce resize events and motion preference changes
- Lazy load animation assets only when needed

### Bundle Impact

- Estimated CSS addition: ~2KB (well within 70KB budget)
- Estimated JS addition: ~3KB (well within 30KB budget)
- Use tree-shaking to eliminate unused animation code
