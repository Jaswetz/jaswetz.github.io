// Issue #7: Implement a robust solution for unsupported browsers (Requirement 3.2)
// See: https://github.com/Jaswetz/jaswetz.github.io/issues/7
// Main JavaScript file with Optimized Bundle Size

// Load CSS normally - simpler approach
import '../css/main.css';

// Load critical components dynamically to reduce main bundle
const loadSiteHeaderModule = () =>
  import('./components/site-header/SiteHeader.js');
const loadSiteFooterModule = () =>
  import('./components/site-footer/SiteFooter.js');

// Lazy load non-critical components and systems
const loadAnalyticsModule = () => import('./analytics/simple-analytics.js');
const loadClarityModule = () => import('./clarity-config.js');
const loadImageLoaderModule = () => import('./enhanced-image-loader.js');
const loadImageLightboxModule = () =>
  import('./components/ImageLightbox/ImageLightbox.js');
const loadSidebarNavigationModule = () =>
  import('./components/sidebar-navigation/SidebarNavigation.js');
const loadPasswordProtectionModule = () =>
  import('./auth/password-protection.js');

// Global functions to load modules when needed
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

window.loadImageLightbox = async () => {
  try {
    const { default: ImageLightbox } = await loadImageLightboxModule();
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
    const { default: SidebarNavigation } = await loadSidebarNavigationModule();
    return SidebarNavigation;
  } catch (error) {
    console.warn('Failed to load SidebarNavigation:', error);
    return null;
  }
};

window.loadPasswordProtection = async () => {
  try {
    await loadPasswordProtectionModule();
  } catch (error) {
    console.warn('Failed to load PasswordProtection:', error);
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
  } catch (error) {
    console.warn('Failed to load critical components:', error);
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

  // Initialize sidebar navigation on pages that have it
  if (document.querySelector('.sidebar-nav')) {
    try {
      const SidebarNavigation = await window.loadSidebarNavigation();
      if (SidebarNavigation) {
        new SidebarNavigation();
      }
    } catch (error) {
      console.warn('Failed to load SidebarNavigation:', error);
    }
  }

  // Initialize ImageLightbox on project pages
  if (document.querySelector('body.project')) {
    try {
      await window.loadImageLightbox();
    } catch (error) {
      console.warn('Failed to load ImageLightbox:', error);
    }
  }

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

// Simple analytics system initialized automatically
// Use window.portfolioAnalytics for manual tracking

// Register Service Worker for caching and offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(new URL('./service-worker.js', import.meta.url))
      .then(registration => {
        console.log(
          'Service Worker registered successfully:',
          registration.scope
        );

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New version available
                console.log('New service worker version available');
                // Optionally show user notification for update
              }
            });
          }
        });
      })
      .catch(error => {
        console.warn('Service Worker registration failed:', error);
      });
  });
}
