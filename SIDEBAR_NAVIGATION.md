# Sidebar Navigation Implementation Guide

## Overview

The sidebar navigation component provides automatic scroll spy functionality that highlights the current section in view and enables smooth scrolling between sections. This component is designed to work on any page with a sidebar navigation structure.

## Features

- **Scroll Spy**: Automatically highlights the navigation item corresponding to the section currently in view
- **Smooth Scrolling**: Clicking navigation links smoothly scrolls to the target section
- **Responsive Design**: Adapts to different screen sizes (horizontal layout on mobile/tablet)
- **URL Hash Support**: Supports direct linking to sections via URL fragments (e.g., `#challenge`)
- **Intersection Observer**: Uses modern browser APIs for efficient scroll tracking
- **Accessible**: Maintains proper focus states and keyboard navigation

## HTML Structure

To implement sidebar navigation on a page, use the following HTML structure:

```html
<div class="sidebar grid grid--2-column--sidebar">
  <div class="article__content">
    <!-- Main content with sections -->
    <section id="section-1">
      <h2>Section Title</h2>
      <!-- Section content -->
    </section>

    <section id="section-2">
      <h2>Another Section</h2>
      <!-- Section content -->
    </section>
  </div>

  <div class="article__sidebar">
    <nav class="sidebar-nav">
      <ul>
        <li><a href="#section-1">Section Title</a></li>
        <li><a href="#section-2">Another Section</a></li>
      </ul>
    </nav>
  </div>
</div>
```

## Key Requirements

### 1. Section IDs

Each section that should be tracked **must** have a unique `id` attribute:

```html
<section id="unique-section-id">
  <h2>Section Title</h2>
</section>
```

### 2. Navigation Links

Navigation links **must** use anchor links that match the section IDs:

```html
<a href="#unique-section-id">Section Title</a>
```

### 3. CSS Classes

The sidebar navigation **must** use the `.sidebar-nav` class:

```html
<nav class="sidebar-nav">
  <ul>
    <li><a href="#section-id">Link Text</a></li>
  </ul>
</nav>
```

## JavaScript Implementation

The sidebar navigation is automatically initialized by the main JavaScript file when a `.sidebar-nav` element is detected on the page. No additional setup is required.

### How It Works

1. **Initialization**: On page load, the component scans for all navigation links and their corresponding sections
2. **Intersection Observer**: Sets up observers to track when sections enter/exit the viewport
3. **Active State Management**: Adds/removes the `.active` class on navigation links based on the current section
4. **Smooth Scrolling**: Handles click events to smoothly scroll to target sections

### Viewport Tracking

The component uses the following intersection observer settings:

- **Root Margin**: `-20% 0px -60% 0px`
  - Sections are considered "active" when they're 20% from the top of the viewport
  - This provides good visual feedback as users scroll

## CSS Styling

### Base Styles

The sidebar navigation includes:

- Sticky positioning on desktop
- Hover effects with smooth transitions
- Active state highlighting
- Border accents for visual feedback

### Responsive Behavior

- **Desktop (>1024px)**: Vertical sticky sidebar
- **Tablet/Mobile (≤1024px)**: Horizontal navigation bar with flex layout

### Active State

Navigation links with the `.active` class receive:

- Enhanced background color
- Primary color text
- Thicker left border (desktop) or enhanced background (mobile)
- Slightly bolder font weight
- Subtle transform animation

## Adding to New Pages

To add sidebar navigation to a new page:

1. **Create the HTML structure** following the pattern above
2. **Ensure section IDs are unique** and descriptive
3. **Match navigation hrefs to section IDs** exactly
4. **Include the CSS classes** (`.sidebar-nav`, `.article__sidebar`, etc.)
5. **The JavaScript will automatically initialize** when the page loads

## Example Implementation

Here's a complete example for a project page:

```html
<main class="project-case-study wrapper">
  <article class="article">
    <div class="sidebar grid grid--2-column--sidebar">
      <div class="article__content">
        <section id="overview">
          <h2>Project Overview</h2>
          <!-- Content -->
        </section>

        <section id="challenge">
          <h2>Challenge</h2>
          <!-- Content -->
        </section>

        <section id="solution">
          <h2>Solution</h2>
          <!-- Content -->
        </section>

        <section id="results">
          <h2>Results</h2>
          <!-- Content -->
        </section>
      </div>

      <div class="article__sidebar">
        <nav class="sidebar-nav">
          <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#challenge">Challenge</a></li>
            <li><a href="#solution">Solution</a></li>
            <li><a href="#results">Results</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </article>
</main>
```

## Browser Support

The component uses modern web APIs:

- **Intersection Observer**: Supported in all modern browsers
- **CSS Custom Properties**: Supported in all modern browsers
- **Smooth Scrolling**: Supported in all modern browsers

For older browsers, the navigation will still function but without smooth scrolling and intersection observer features.

## Troubleshooting

### Navigation not highlighting

- Check that section IDs match navigation hrefs exactly
- Ensure sections have content and are visible
- Verify the `.sidebar-nav` class is present

### Smooth scrolling not working

- Check that `scroll-behavior: smooth` is set in CSS
- Ensure sections have proper IDs
- Verify JavaScript is loading without errors

### Responsive layout issues

- Confirm CSS media queries are loading
- Check that grid classes are properly applied
- Verify viewport meta tag is present in HTML head
