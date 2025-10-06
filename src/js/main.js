// Issue #7: Implement a robust solution for unsupported browsers (Requirement 3.2)
// See: https://github.com/Jaswetz/jaswetz.github.io/issues/7
// Main JavaScript file with Aggressive Code Splitting

// Load CSS normally - simpler approach
import '../css/main.css';

// Import lazy loading utility for intersection observer-based component loading
import { setupLazyLoading } from './utils/lazy-loader.js';

// Import password protection initialization utility
import './auth/password-protection-init.js';

// Import accessibility utilities for enhanced user experience
import './utils/accessibility-utils.js';

// Load critical components dynamically to reduce main bundle
const loadSiteHeaderModule = () =>
  import('./components/site-header/SiteHeader.js');
const loadSiteFooterModule = () =>
  import('./components/site-footer/SiteFooter.js');

// Load font optimization system
const loadFontOptimizerModule = () => import('./utils/font-optimization.js');

// Lazy load non-critical components and systems using dynamic imports
const loadAnalyticsModule = () => import('./analytics/simple-analytics.js');
const loadClarityModule = () => import('./clarity-config.js');
const loadImageLoaderModule = () => import('./enhanced-image-loader.js');

// Remove direct imports - these will be loaded via intersection observer
// const loadImageLightboxModule = () =>
//   import("./components/ImageLightbox/ImageLightbox.js");
// const loadSidebarNavigationModule = () =>
//   import("./components/sidebar-navigation/SidebarNavigation.js");
// const loadPasswordProtectionModule = () =>
//   import("./auth/password-protection.js");

// Global functions to load modules when needed (kept for backward compatibility)
window.loadAnalytics = async () => {
  try {
    await loadAnalyticsModule();
    return window.portfolioAnalytics;
  } catch (error) {
    console.warn('Failed to load Analytics:', error);
    return null;
  }
};

window.loadClarity = async () => {
  try {
    await loadClarityModule();
  } catch (error) {
    console.warn('Failed to load Clarity:', error);
  }
};

window.loadImageLoader = async () => {
  try {
    await loadImageLoaderModule();
    return window.enhancedImageLoader;
  } catch (error) {
    console.warn('Failed to load ImageLoader:', error);
    return null;
  }
};

// Simplified global functions - components now loaded via intersection observer
window.loadImageLightbox = async () => {
  try {
    const { default: ImageLightbox } = await import(
      './components/ImageLightbox/ImageLightbox.js'
    );
    if (!customElements.get('image-lightbox')) {
      customElements.define('image-lightbox', ImageLightbox);
    }
    return ImageLightbox;
  } catch (error) {
    console.warn('Failed to load ImageLightbox:', error);
    return null;
  }
};

window.loadSidebarNavigation = async () => {
  try {
    const { default: SidebarNavigation } = await import(
      './components/sidebar-navigation/SidebarNavigation.js'
    );
    return SidebarNavigation;
  } catch (error) {
    console.warn('Failed to load SidebarNavigation:', error);
    return null;
  }
};

window.loadPasswordProtection = async () => {
  try {
    const { initPasswordProtection } = await import(
      './auth/password-protection.js'
    );
    return initPasswordProtection;
  } catch (error) {
    console.warn('Failed to load PasswordProtection:', error);
    return null;
  }
};

// Minimal browser support check (inline)
if (!('customElements' in window && 'attachShadow' in Element.prototype)) {
  console.warn('Web Components not supported - some features may not work');
}

// Immediate scroll handler for header (before component loads)
function handleHeaderScroll() {
  const header = document.querySelector('site-header');
  if (header) {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
}

// Add immediate scroll listener
window.addEventListener('scroll', handleHeaderScroll, { passive: true });

// Initialize critical systems and lazy load non-critical ones
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize font optimization early for better performance
  try {
    await loadFontOptimizerModule();
    // Font optimizer is automatically initialized
  } catch (error) {
    console.warn('Failed to load font optimizer:', error);
  }

  // Load critical components
  try {
    const [{ default: SiteHeader }, { default: SiteFooter }] =
      await Promise.all([loadSiteHeaderModule(), loadSiteFooterModule()]);

    // Define critical custom elements
    if (window.customElements) {
      if (!customElements.get('site-header')) {
        customElements.define('site-header', SiteHeader);
        // Remove the immediate scroll handler once the component is defined
        window.removeEventListener('scroll', handleHeaderScroll);
      }
      if (!customElements.get('site-footer')) {
        customElements.define('site-footer', SiteFooter);
      }
    }
  } catch (_error) {
    console.warn('Failed to load critical components');
  }
  // Load analytics system and set up tracking (non-blocking)
  window.loadAnalytics().then(() => {
    // Set up minimal event tracking
    document.querySelectorAll('[data-track-project-name]').forEach(card => {
      card.addEventListener('click', () => {
        const projectName = card.getAttribute('data-track-project-name');
        const projectType = card.getAttribute('data-track-project-type');
        window.portfolioAnalytics?.trackProjectClick(projectName, projectType);
      });
    });

    document.querySelectorAll('a[href*="Resume.pdf"]').forEach(link => {
      link.addEventListener('click', () => {
        window.portfolioAnalytics?.trackResumeDownload();
      });
    });

    document.querySelectorAll("a[href^='http']").forEach(link => {
      if (
        link instanceof HTMLAnchorElement &&
        link.hostname !== window.location.hostname
      ) {
        link.addEventListener('click', () => {
          window.portfolioAnalytics?.trackExternalLink(
            link.href,
            link.textContent?.trim() || ''
          );
        });
      }
    });
  });

  // Load other systems (non-blocking)
  window.loadClarity();
  window.loadImageLoader();

  // Set up intersection observer-based lazy loading for components
  setupLazyLoading();

  // Add click functionality to the animated 2D logo
  const logo2d = document.querySelector('.logo-2d');
  if (logo2d !== null && logo2d instanceof HTMLElement) {
    // Make the logo clickable by adding cursor pointer style
    logo2d.style.cursor = 'pointer';

    // Add click event listener
    logo2d.addEventListener('click', e => {
      e.preventDefault();

      // Find the featured projects section
      const featuredProjectsSection =
        document.querySelector('#featured-projects');
      if (featuredProjectsSection instanceof HTMLElement) {
        // Smooth scroll to the featured projects section
        featuredProjectsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Optional: Update URL hash
        window.history.pushState(null, null, '#featured-projects');
      }
    });

    // Add keyboard accessibility (Enter and Space keys)
    logo2d.addEventListener('keydown', e => {
      if (e instanceof KeyboardEvent && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        logo2d.click(); // Trigger the click event
      }
    });

    // Make it focusable for keyboard navigation
    logo2d.setAttribute('tabindex', '0');
    logo2d.setAttribute('role', 'button');
    logo2d.setAttribute('aria-label', 'Scroll to featured projects section');
  }
});

// --- Debug Styles Toggle ---
document.addEventListener('keydown', function (event) {
  // Check for Ctrl+Shift+D
  if (event.ctrlKey && event.shiftKey && event.key === 'D') {
    event.preventDefault(); // Prevent default browser action for this shortcut

    const body = document.body;
    const layoutClass = 'debug-layout-outlines';
    const rhythmClass = 'debug-typographic-rhythm';

    // Toggle layout outlines
    body.classList.toggle(layoutClass);
    // Toggle typographic rhythm
    body.classList.toggle(rhythmClass);

    // Debug styles toggled (silent operation for production)
  }
});
// --- End Debug Styles Toggle ---

// Enhanced Image Loader is auto-initialized in its own module

// Initialize Advanced Analytics System (commented out - experimental)
// document.addEventListener("DOMContentLoaded", async () => {
//   try {
// Simplified Analytics System - Load dynamically
// Analytics is already initialized in simple-analytics.js
// Global window.portfolioAnalytics API is available

//     // Advanced Analytics System initialized successfully

//     // Make modules globally available for debugging (remove in production)
//     if (
//       window.location.hostname === "localhost" ||
//       window.location.hostname === "127.0.0.1"
//     ) {
//       window.analyticsSystem = {
//         analytics,
//         conversionTracker,
//         crossPlatformIntegration,
//         userJourneyAnalyzer,
//         userSegmentation,
//         performanceMonitor,
//         optimizationFramework,
//         abTestingFramework,
//         conversionDashboard,
//         // Utility functions
//         exportData: () => ({
//           journey: userJourneyAnalyzer.exportAnalysisData(),
//           segments: userSegmentation.exportSegmentationData(),
//           performance: performanceMonitor.exportPerformanceData(),
//           recommendations: optimizationFramework.exportFrameworkData(),
//           experiments: abTestingFramework.exportTestingData(),
//           dashboard: conversionDashboard.exportDashboardData(),
//         }),
//         resetAll: () => {
//           localStorage.clear();
//           // All analytics data reset
//         },
//       };
//     }
//   } catch (error) {
//     // Failed to initialize Advanced Analytics System - basic analytics will continue
//   }
// });

// Register Service Worker for Core Web Vitals optimization and offline support
if ('serviceWorker' in navigator) {
  // Register immediately for better caching performance
  navigator.serviceWorker
    .register(new URL('./service-worker.js', import.meta.url))
    .then(registration => {
      // Service Worker registered successfully for Core Web Vitals optimization

      // Handle updates for better performance
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // New version available - skip waiting for immediate activation
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        }
      });

      // Listen for controlling service worker changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Service worker updated - reload for better performance
        if (navigator.serviceWorker.controller) {
          window.location.reload();
        }
      });
    })
    .catch(_error => {
      // Service Worker registration failed - continue without caching
    });
}
