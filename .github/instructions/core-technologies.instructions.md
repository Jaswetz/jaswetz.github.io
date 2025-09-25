---
description: Core technologies that this project uses
applyTo: "**"
---

# Core Technologies

## Web Standards Stack

This project is built using fundamental web technologies that ensure long-term compatibility and performance:

### Frontend Technologies

- **HTML5**: Semantic markup with accessibility focus
- **CSS3**: Modern features including CSS Grid, Flexbox, and Cascade Layers
- **Vanilla JavaScript (ES2022)**: No frameworks, native Web Components
- **Web Components**: Custom elements with Shadow DOM encapsulation

### Development Tools

- **Parcel.js 2.15.4**: Zero-config bundler and development server
- **Node.js 23.9.0**: Runtime environment with ES2022 support
- **npm**: Package management with locked dependencies

## Technology Choices Rationale

### Web Standards Focus

- **Future-proofing**: Web standards have longer support lifecycles than frameworks
- **Performance**: Direct browser APIs are faster than abstraction layers
- **Compatibility**: Native features work across all modern browsers
- **Maintainability**: Less dependency management and update cycles

### No Framework Approach

- **Bundle Size**: Eliminates framework overhead (target: <30KB JS gzipped)
- **Learning Curve**: No framework-specific knowledge required
- **Flexibility**: Direct control over implementation details
- **Performance**: No framework runtime overhead

## Browser Support Matrix

- **Chrome**: ≥63 (Web Components, ES2022)
- **Firefox**: ≥63 (Custom Elements, CSS Grid)
- **Safari**: ≥10.1 (Shadow DOM, CSS Custom Properties)
- **Edge**: ≥79 (Chromium-based modern features)

## Development Workflow Integration

### Local Development

```bash
npm run dev  # Start Parcel dev server with hot reload
```

### Build Process

```bash
npm run build    # Production build with optimizations
npm run preview  # Test production build locally
```

### Quality Assurance

- **ESLint**: JavaScript code quality and consistency
- **Stylelint**: CSS linting with modern standards
- **Testing**: Comprehensive test suite with multiple layers

## Migration Considerations

### From Framework-based Projects

- **Learning Curve**: Understanding Web Components and Shadow DOM
- **Tooling**: Adapting to Parcel's zero-config approach
- **Architecture**: Shifting from component libraries to custom elements

### Performance Benefits

- **Faster Initial Load**: No framework bootstrap time
- **Smaller Bundles**: Only includes actually used code
- **Better Caching**: Less frequent dependency updates
- **Direct APIs**: More efficient browser feature usage

## Related Guidelines

- **Component Development**: See `AGENTS.md` for Web Component patterns
- **CSS Architecture**: See main `copilot-instructions.md` for styling approach
- **Build Configuration**: See `package.json` for available scripts
- **Browser Testing**: See `Docs/TESTING.md` for compatibility testing
