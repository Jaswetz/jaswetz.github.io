# CSS Modular Component System

This document describes the refactored CSS architecture that extracts reusable components from project-specific styles.

## 🎯 Overview

The CSS has been restructured to be more modular and reusable across different projects and pages. Components have been extracted from the original `projects.css` and organized into logical, reusable modules.

## 📁 New Component Files

### `/css/components/` - New Reusable Components

- **`heroes.css`** - Hero section components with variants
- **`badges.css`** - Badge/tag components for phases, severity levels, etc.
- **`grids.css`** - Reusable grid layout patterns
- **`navigation.css`** - Sidebar and project navigation components
- **`icons.css`** - Icon component styles with variants
- **`sections.css`** - Common section layout patterns
- **`lists.css`** - Bullet points, feature lists, step lists
- **`cards.css`** - Enhanced with project-specific card types

### `/css/layout/` - Simplified

- **`projects.css`** - Now contains ONLY project-specific styles

## 🏗️ Component Categories

### 1. Hero Components (`heroes.css`)
```css
.hero                    /* Base hero */
.hero--project          /* Project-specific hero */
.hero__content          /* Hero content wrapper */
.hero__meta             /* Meta information */
.hero__impact           /* Impact/stats card */
```

### 2. Card Components (`cards.css`)
```css
/* Existing cards + new project cards */
.summary-cards          /* Project summary grid */
.problem-cards          /* Problem definition cards */
.result-card            /* Results/metrics cards */
.learning-card          /* Key learnings cards */
.severity-cards         /* Severity level cards */
.growth-card            /* Professional growth card */
```

### 3. Grid Layouts (`grids.css`)
```css
.grid                   /* Base grid */
.grid--auto-fit         /* Auto-fit columns */
.grid--2-column         /* Two column grid */
.grid--3-column         /* Three column grid */
.grid--2-column--sidebar /* Sidebar layout */
```

### 4. Badge Components (`badges.css`)
```css
.badge                  /* Base badge */
.badge--primary         /* Primary color badge */
.badge--phase           /* Project phase badge */
.badge--severity-high   /* Severity indicators */
```

### 5. Navigation Components (`navigation.css`)
```css
.sidebar-nav            /* Sidebar navigation */
.project-navigation     /* Project pagination */
.back-to-portfolio      /* Back button */
```

### 6. Icon Components (`icons.css`)
```css
.icon                   /* Base icon */
.icon--background       /* Icon with background */
.icon--severity-*       /* Severity level icons */
```

### 7. Section Layouts (`sections.css`)
```css
.section                /* Base section */
.phase                  /* Project phase section */
.content-grid           /* Content grid layouts */
.key-features           /* Feature list layout */
.result-benefits        /* Benefit list layout */
```

### 8. List Components (`lists.css`)
```css
.bullet-points          /* Bullet point lists */
.feature-list           /* Feature lists with checkmarks */
.step-list              /* Numbered step lists */
.grid-list              /* Grid-based lists */
```

## 🎨 Usage Examples

### Hero Section
```html
<section class="hero hero--project">
  <div class="hero__content">
    <h1 class="hero__header">Project Title</h1>
    <div class="hero__meta">
      <span class="hero__role">UX Designer</span>
      <span class="hero__timeline">6 months</span>
    </div>
    <div class="hero__impact">
      <div class="hero__impact-label">Impact</div>
      <div class="hero__impact-value">25%</div>
      <div class="hero__impact-description">Increase in user engagement</div>
    </div>
  </div>
</section>
```

### Problem Cards
```html
<div class="problem-cards">
  <div class="problem-card">
    <div class="problem-card__icon">
      <img src="icon.svg" alt="">
    </div>
    <h3>Problem Title</h3>
    <p>Problem description...</p>
  </div>
</div>
```

### Results Grid
```html
<div class="grid grid--2-column">
  <div class="result-card">
    <div class="result-card__number">50K+</div>
    <div class="result-card__label">Users Impacted</div>
    <div class="result-card__description">Description of the impact</div>
  </div>
</div>
```

## 🔧 Benefits

1. **Reusability** - Components can be used across multiple projects
2. **Consistency** - Standardized design patterns
3. **Maintainability** - Changes in one place affect all instances
4. **Modularity** - Easy to add/remove features
5. **Performance** - Better CSS organization and potential for optimization

## 📝 Migration Notes

### What Was Moved
- Hero sections → `heroes.css`
- All card types → `cards.css` (enhanced existing)
- Grid patterns → `grids.css`
- Navigation → `navigation.css`
- Badges/tags → `badges.css`
- Icons → `icons.css`
- Section layouts → `sections.css`
- Bullet points → `lists.css`

### What Stayed in `projects.css`
- Project case study base layout
- Project-specific hero background images
- Sidebar visibility logic
- Project summary image spacing

## 🚀 Next Steps

1. Update HTML templates to use new class names
2. Test components across different projects
3. Create component documentation/style guide
4. Consider adding more variants as needed
5. Optimize for better performance

## 📚 Related Files

- `main.css` - Updated to import all new components
- `projects.css` - Simplified, project-specific only
- All new component files follow BEM-like naming conventions
- Responsive behavior maintained in each component
