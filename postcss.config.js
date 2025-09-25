export default {
  plugins: {
    // '@fullhuman/postcss-purgecss': {
    //   content: [
    //     './src/**/*.html',
    //     './src/**/*.js',
    //     './src/**/*.ts',
    //     './dist/**/*.html',
    //     './dist/**/*.js'
    //   ],
    //   defaultExtractor: content => {
    //     // Extract class names, IDs, and other CSS selectors
    //     const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
    //     const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
    //     return broadMatches.concat(innerMatches);
    //   },
    //   safelist: {
    //     // Standard CSS selectors that should never be purged
    //     standard: [
    //       // HTML elements
    //       'html', 'body', 'main', 'header', 'footer', 'nav', 'section', 'article',
    //       'aside', 'div', 'span', 'p', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    //       'ul', 'ol', 'li', 'button', 'form', 'input', 'textarea', 'select', 'option',
    //
    //       // Common utility classes
    //       'hidden', 'visible', 'block', 'inline', 'flex', 'grid',
    //       'sr-only', 'visually-hidden',
    //
    //       // Animation and transition states
    //       'active', 'inactive', 'disabled', 'enabled', 'loading', 'loaded',
    //       'open', 'closed', 'expanded', 'collapsed',
    //
    //       // Form states
    //       'valid', 'invalid', 'required', 'optional', 'focus', 'blur',
    //
    //       // Layout utilities
    //       'container', 'wrapper', 'content',
    //
    //       // Debug classes (conditional)
    //       'debug-layout-outlines', 'debug-typographic-rhythm',
    //
    //       // Web component selectors (they use shadow DOM)
    //       'site-header', 'site-footer', 'sidebar-navigation', 'image-lightbox',
    //
    //       // Dynamic classes that might be added via JavaScript
    //       'scrolled', 'menu-open', 'lightbox-open', 'modal-open',
    //       'fade-in', 'fade-out', 'slide-in', 'slide-out',
    //
    //       // Password protection states
    //       'password-protected', 'access-granted',
    //
    //       // Project-specific classes that might be dynamic
    //       'project-card', 'hero-section', 'featured-projects', 'project-snippet',
    //
    //       // Responsive utility classes
    //       /^(xs|sm|md|lg|xl):/,
    //
    //       // Spacing utilities (common patterns)
    //       /^(m|p)(t|r|b|l|x|y)?-\d+$/,
    //
    //       // Typography utilities
    //       /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/,
    //       /^font-(thin|light|normal|medium|semibold|bold|extrabold|black)$/,
    //
    //       // Color utilities (if using utility-first approach)
    //       /^(text|bg|border)-(primary|secondary|accent|gray|white|black)-?\d*$/,
    //     ],
    //
    //     // Deep selectors (for nested components)
    //     deep: [
    //       // Pseudo-classes and pseudo-elements
    //       /:(hover|focus|active|visited|disabled|checked|invalid|valid|first|last|nth)/,
    //       /::(before|after|first-line|first-letter|placeholder|selection)/,
    //
    //       // Attribute selectors
    //       /\[.*\]/,
    //
    //       // CSS Grid and Flexbox utilities
    //       /^(grid|flex)-/,
    //       /^(justify|items|content|self)-/,
    //       /^(col|row)-(span|start|end)-/,
    //
    //       // Animation keyframes and classes
    //       /@keyframes/,
    //       /^animate-/,
    //       /^transition-/,
    //
    //       // Component state classes
    //       /^(is|has)-/,
    //
    //       // BEM-style modifiers (for Web Components)
    //       /^[a-zA-Z0-9_-]+--[a-zA-Z0-9_-]+$/,
    //       /^[a-zA-Z0-9_-]+__[a-zA-Z0-9_-]+$/,
    //     ],
    //
    //     // Greedy patterns (be careful with these)
    //     greedy: [
    //       // Layer names (CSS @layer)
    //       /^(reset|base|theme|layout|components|utilities|debug)$/,
    //
    //       // CSS custom properties (CSS variables)
    //       /^--[a-zA-Z0-9_-]+$/,
    //
    //       // Theme-related classes
    //       /^theme-/,
    //       /^dark:/,
    //       /^light:/,
    //     ]
    //   },
    //
    //   // Skip purging for certain files
    //   skippedContentGlobs: [
    //     'node_modules/**',
    //     '.parcel-cache/**',
    //     'dist/**'
    //   ],
    //
    //   // Reject patterns - classes that should definitely be removed
    //   reject: [
    //     // Development/debug classes that shouldn't be in production
    //     /^debug-(?!layout-outlines|typographic-rhythm)/,
    //     /^test-/,
    //     /^temp-/,
    //     /^placeholder-/,
    //   ],
    //
    //   // Variables (preserve CSS custom properties)
    //   variables: true,
    //
    //   // Keyframes (preserve animation keyframes)
    //   keyframes: true,
    //
    //   // Font faces
    //   fontFace: true,
    // },
    cssnano: {
      preset: [
        'default',
        {
          // Preserve important comments
          discardComments: {
            removeAll: false,
          },
          // Don't merge rules that might break cascade layers
          mergeRules: false,
          // Preserve CSS custom properties
          reduceIdents: false,
          // Don't minify CSS Grid properties aggressively
          minifyGridTemplateRows: false,
          minifyGridTemplateColumns: false,
        },
      ],
    },
  },
};
