---
inclusion: always
---

# UX Portfolio Product Guidelines

_AI agent guidance for maintaining product consistency and user experience_

## Project Overview

This is Jason Swetzoff's professional UX portfolio - a performance-first showcase built with modern web standards. Key constraints:

- **Bundle Size**: JS <30KB, CSS <70KB (gzipped)
- **Performance**: LCP <2.5s, CLS <0.1, FID <100ms
- **Accessibility**: WCAG 2.1 AA compliance required
- **Tech Stack**: Vanilla JavaScript, Web Components, CSS Cascade Layers

## Core Product Principles

### Performance First

- Maintain bundle size limits (JS: <30KB, CSS: <70KB)
- Ensure Core Web Vitals meet targets (LCP <2.5s, CLS <0.1, FID <100ms)
- Optimize images to WebP with fallbacks
- Minimize dependencies and framework overhead

### Accessibility Compliance

- WCAG 2.1 AA standards required for all features
- Full keyboard navigation support
- Screen reader compatibility with semantic HTML and ARIA labels
- Respect `prefers-reduced-motion` for animations

### Mobile-First Design

- All components must work seamlessly on mobile devices
- Responsive breakpoints using `rem` units
- Touch targets minimum 44px for mobile
- Progressive enhancement for larger screens

### Client Confidentiality

- Sensitive case studies require password protection
- Client-side only protection suitable for portfolio access
- Never expose actual passwords in code comments or console logs
- 24-hour session management with localStorage

## Key Features & Implementation

### Interactive 2D Logo Navigation

- Located in site header, built as Web Component
- Three geometric shapes (triangle, circle, square) link to featured projects
- CSS animations should be performant and accessible (respect `prefers-reduced-motion`)
- Built using CSS transforms and transitions for smooth performance

### Password Protection System

- Client-side only (no server dependencies)
- Use `protectCaseStudy("case-study-id")` for protected pages
- Configuration in `src/js/auth/password-config.js`
- Session management with localStorage
- User-friendly password prompt interface

### Case Study Structure

- Each project gets dedicated HTML page in `src/projects/`
- Follow naming convention: `project-[company]-[project].html`
- Include hero section, problem statement, process, and outcomes
- Use semantic HTML with proper heading hierarchy
- Optimize images and implement lazy loading

## Content Guidelines

### Professional Tone

- Write in third person when describing Jason's work
- Focus on measurable outcomes and business impact
- Use UX terminology appropriately (user research, personas, wireframes, etc.)
- Include specific metrics when available (conversion rates, user satisfaction scores)
- Maintain consistent voice across all case studies

### Image Standards

- All project images must be optimized (WebP with fallbacks)
- Use descriptive alt text for accessibility
- Maintain consistent aspect ratios within project sections
- Store project-specific images in `src/img/projects/[project-name]/`
- Implement lazy loading for performance

### Case Study Protection Levels

- **Public**: General portfolio pieces, no protection needed
- **Protected**: Client work requiring password (Autodesk, Intel projects)
- **Confidential**: Most sensitive work, additional access controls

## Technical Constraints

### Performance Budgets

- JavaScript bundle: Maximum 30KB gzipped
- CSS bundle: Maximum 70KB gzipped
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- First Input Delay: <100ms

### Browser Support

- Chrome/Edge 63+, Firefox 63+, Safari 10.1+
- Progressive enhancement for older browsers
- No polyfills for modern JavaScript features
- Test across all supported browsers

### Analytics & Privacy

- Google Analytics 4 for traffic insights
- Microsoft Clarity for user behavior analysis
- GDPR-compliant configuration (anonymized IPs, consent-aware)
- No tracking of password-protected content
- Privacy-first approach with PII masking

## Development Rules

### Component Creation

- All interactive elements must be Web Components
- Shadow DOM encapsulation required for styling isolation
- Register components in `src/js/main.js`
- Include both light and dark theme support
- Follow BEM methodology within component scope

### Styling Conventions

- Use CSS Cascade Layers for style organization
- Design tokens defined in `variables.css`
- BEM methodology for component classes
- Mobile-first responsive breakpoints
- Utility classes in dedicated layer

### Content Updates

- New case studies require both HTML page and navigation updates
- Update project thumbnails in homepage grid
- Maintain consistent project card structure
- Test password protection before deploying protected content
- Update style guide with new components

## Quality Assurance

### Testing Requirements

- All tests must pass before deployment
- Accessibility testing with axe-core
- Performance testing with Lighthouse
- Cross-browser testing with Playwright
- Bundle size validation

### Code Review Checklist

- [ ] Follows established coding standards
- [ ] Includes appropriate error handling
- [ ] Maintains performance budgets
- [ ] Meets accessibility requirements
- [ ] Includes comprehensive tests
- [ ] Updates documentation as needed

## Related Documentation

- **AGENTS.md**: Main AI agent instructions
- **Tech Stack**: See `.kiro/steering/tech.md`
- **Project Structure**: See `.kiro/steering/structure.md`
- **Architecture**: See `Docs/ARCHITECTURE.md`
- **Testing**: See `Docs/TESTING.md`
- **Password Protection**: See `Docs/PASSWORD_PROTECTION.md`

---

_This file follows the agents.md format for AI coding agent guidance._
