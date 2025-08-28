# Design Document

## Overview

This design outlines the integration of the Daimler Trucks Fleet Analytics case study (Detroit Connect Direct) into Jason Swetzoff's UX portfolio. The integration follows established patterns from existing case studies while maintaining the portfolio's performance standards and accessibility requirements. The design ensures seamless user experience from discovery on the homepage through detailed case study consumption.

## Architecture

### File Structure

```
src/
├── projects/
│   └── project-daimler-dcd.html          # New case study page
├── img/
│   └── projects/
│       └── dcd/                           # Daimler case study images
│           ├── customer-flow.jpg
│           ├── user-flow.jpg
│           ├── wireframe.jpg
│           ├── first-sketches.jpg
│           ├── whiteboarding.jpg
│           ├── flows.jpg
│           ├── dcd-animation.gif
│           ├── checkbox.gif
│           └── bright-view-macbook.jpg
├── css/
│   └── pages/
│       └── page-daimler-dcd.css          # Page-specific styles (if needed)
└── index.html                            # Updated with new project card
```

### Integration Points

1. **Homepage Project Grid**: Add new project card in featured projects section
2. **Navigation**: Integrate with existing site-header component navigation
3. **Password Protection**: Implement client-side protection for sensitive content
4. **Image Optimization**: Convert all images to WebP with fallbacks
5. **Analytics**: Track case study engagement with existing GA4 setup

## Components and Interfaces

### Homepage Project Card Component

Following the established pattern from existing project cards:

```html
<a href="./projects/project-daimler-dcd.html" class="card-link">
  <article class="project-snippet grid__item card card--vertical">
    <img
      src="./img/projects/dcd/dcd-hero-thumbnail.jpg"
      alt="Daimler Detroit Connect Direct interface mockup"
      class="project-thumbnail card__image"
    />
    <div class="card__content">
      <h3>🔒 Streamlining Data Access: Fleet Analytics for Daimler Trucks</h3>
      <p>
        I designed a data access configuration tool that simplified complex
        fleet analytics for users ranging from interns to data scientists,
        creating an intuitive interface for customizing vehicle data delivery.
      </p>
    </div>
  </article>
</a>
```

### Case Study Page Structure

Based on existing case study patterns, the page will include:

1. **Hero Section**: Project title, client, role, and timeline
2. **Project Summary**: Metadata cards with client, role, platform, challenge
3. **Content Sections**: Brief, assignment, users, process, results
4. **Image Gallery**: Process images with proper captions and lightbox support
5. **Navigation**: Consistent header/footer with other pages

### Content Sections Architecture

```html
<main class="main-content wrapper">
  <article class="article">
    <div class="article__content">
      <!-- Project Summary Cards -->
      <section class="project-summary">
        <div class="project-summary__cards grid grid--auto-fit-md">
          <!-- Metadata cards -->
        </div>
      </section>

      <!-- Content Sections -->
      <section class="project-section">
        <h2>Brief</h2>
        <!-- Content -->
      </section>

      <section class="project-section">
        <h2>Assignment</h2>
        <!-- Content -->
      </section>

      <!-- Additional sections following existing pattern -->
    </div>
  </article>
</main>
```

## Data Models

### Project Metadata

```javascript
const daimlerProject = {
  id: "project-daimler-dcd",
  title: "Streamlining Data Access: Fleet Analytics for Daimler Trucks",
  client: "Daimler Trucks North America",
  role: "Lead UX Designer",
  platform: "Web Application",
  timeline: "Multi-year project",
  challenge:
    "Design a data access configuration tool that is easy to comprehend and enjoyable to use—for everybody from the intern to the data scientist—and can be used by multiple users for different steps.",
  tags: [
    "User Experience",
    "Strategy",
    "Prototyping",
    "Wireframing",
    "User Flows",
    "Design",
    "Animation",
  ],
  protected: true,
  thumbnail: "./img/projects/dcd/dcd-hero-thumbnail.jpg",
  heroImage: "./img/projects/dcd/dcd-hero-background.jpg",
};
```

### Image Assets Structure

```javascript
const daimlerImages = {
  hero: "dcd-hero-background.jpg",
  thumbnail: "dcd-hero-thumbnail.jpg",
  process: [
    "customer-flow.jpg",
    "user-a-b.jpg",
    "first-sketches.jpg",
    "whiteboarding.jpg",
    "wireframe.jpg",
    "flows.jpg",
    "user-flow.jpg",
  ],
  animations: ["dcd-animation.gif", "checkbox.gif"],
  results: "bright-view-macbook.jpg",
};
```

## Error Handling

### Image Loading

- Implement lazy loading for all case study images
- Provide WebP format with JPEG fallbacks
- Include proper alt text for accessibility
- Handle missing images gracefully with placeholder content

### Password Protection

- Implement client-side protection using existing auth system
- Graceful fallback if password protection fails
- Clear error messaging for incorrect passwords
- Maintain protection state across page refreshes

### Performance Monitoring

- Monitor bundle size impact (ensure <30KB JS, <70KB CSS limits)
- Track Core Web Vitals for new page
- Implement error tracking for failed image loads
- Monitor case study engagement metrics

## Testing Strategy

### Accessibility Testing

1. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
2. **Screen Reader Compatibility**: Test with VoiceOver/NVDA for proper content structure
3. **Color Contrast**: Verify WCAG 2.1 AA compliance for all text/background combinations
4. **Focus Management**: Proper focus indicators and logical tab order

### Performance Testing

1. **Bundle Size**: Verify JavaScript and CSS bundles remain under limits
2. **Image Optimization**: Test WebP delivery and fallback mechanisms
3. **Core Web Vitals**: Measure LCP, FID, and CLS for the new case study page
4. **Mobile Performance**: Test on various mobile devices and connection speeds

### Cross-Browser Testing

1. **Modern Browsers**: Chrome 63+, Firefox 63+, Safari 10.1+, Edge 79+
2. **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
3. **Feature Support**: Test Web Components and CSS Grid support
4. **Graceful Degradation**: Ensure functionality without JavaScript

### Content Testing

1. **Password Protection**: Verify protection works correctly for sensitive content
2. **Image Lightbox**: Test image gallery functionality across devices
3. **Responsive Design**: Ensure proper layout on all screen sizes
4. **Navigation**: Test links and navigation flow from homepage to case study

### Integration Testing

1. **Homepage Integration**: Verify new project card displays correctly
2. **Analytics Tracking**: Confirm GA4 events fire properly for case study interactions
3. **Build Process**: Test that new files compile and deploy correctly
4. **SEO**: Verify meta tags and structured data for search optimization

## Implementation Phases

### Phase 1: Content Preparation

- Convert and optimize all images to WebP format
- Structure content following existing case study patterns
- Prepare metadata and project summary information

### Phase 2: Homepage Integration

- Add new project card to homepage grid
- Update navigation if needed
- Test responsive behavior of updated grid

### Phase 3: Case Study Page Development

- Create HTML structure following established patterns
- Implement password protection for sensitive content
- Add proper semantic markup and accessibility features

### Phase 4: Styling and Polish

- Apply consistent styling using existing CSS patterns
- Implement responsive design for all screen sizes
- Add hover states and interactive feedback

### Phase 5: Testing and Optimization

- Conduct comprehensive accessibility testing
- Verify performance metrics and bundle sizes
- Test across all supported browsers and devices
- Implement analytics tracking for engagement metrics
