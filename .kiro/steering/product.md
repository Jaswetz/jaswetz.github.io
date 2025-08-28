---
inclusion: always
---

# UX Portfolio Product Guidelines

This is Jason Swetzoff's professional UX portfolio - a performance-optimized showcase of design work and case studies built with modern web standards.

## Core Product Principles

- **Performance First**: Maintain bundle size limits (JS: <30KB, CSS: <70KB)
- **Accessibility Compliance**: WCAG 2.1 AA standards required for all features
- **Mobile-First Design**: All components must work seamlessly on mobile devices
- **Client Confidentiality**: Sensitive case studies require password protection
- **Professional Presentation**: Clean, minimal design reflecting UX expertise

## Key Features & Implementation

### Interactive 2D Logo Navigation

- Located in site header, built as Web Component
- Three geometric shapes (triangle, circle, square) link to featured projects
- CSS animations should be performant and accessible (respect `prefers-reduced-motion`)

### Password Protection System

- Client-side only (no server dependencies)
- Use `protectCaseStudy("case-study-id")` for protected pages
- Configuration in `src/js/auth/password-config.js`
- Never expose actual passwords in code comments or console logs

### Case Study Structure

- Each project gets dedicated HTML page in `src/projects/`
- Follow naming convention: `project-[company]-[project].html`
- Include hero section, problem statement, process, and outcomes
- Use semantic HTML with proper heading hierarchy

## Content Guidelines

### Professional Tone

- Write in third person when describing Jason's work
- Focus on measurable outcomes and business impact
- Use UX terminology appropriately (user research, personas, wireframes, etc.)
- Include specific metrics when available (conversion rates, user satisfaction scores)

### Image Standards

- All project images must be optimized (WebP with fallbacks)
- Use descriptive alt text for accessibility
- Maintain consistent aspect ratios within project sections
- Store project-specific images in `src/img/projects/[project-name]/`

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

### Browser Support

- Chrome/Edge 63+, Firefox 63+, Safari 10.1+
- Progressive enhancement for older browsers
- No polyfills for modern JavaScript features

### Analytics & Privacy

- Google Analytics 4 for traffic insights
- Microsoft Clarity for user behavior analysis
- GDPR-compliant configuration (anonymized IPs, consent-aware)
- No tracking of password-protected content

## Development Rules

### Component Creation

- All interactive elements must be Web Components
- Shadow DOM encapsulation required for styling isolation
- Register components in `src/js/main.js`
- Include both light and dark theme support

### Styling Conventions

- Use CSS Cascade Layers for style organization
- Design tokens defined in `variables.css`
- BEM methodology for component classes
- Mobile-first responsive breakpoints

### Content Updates

- New case studies require both HTML page and navigation updates
- Update project thumbnails in homepage grid
- Maintain consistent project card structure
- Test password protection before deploying protected content
