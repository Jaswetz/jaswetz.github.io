/**
 * Lazy Loading Utility
 *
 * Provides intersection observer-based lazy loading for components
 * and dynamic imports for better code splitting.
 */

export class LazyLoader {
  constructor() {
    this.observers = new Map();
    this.loadedComponents = new Set();
  }

  /**
   * Create an intersection observer for lazy loading components
   * @param {Object} options - Observer options
   * @returns {IntersectionObserver}
   */
  createObserver(options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
    };

    return new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const componentName = element.dataset.lazyComponent;

            if (componentName && !this.loadedComponents.has(componentName)) {
              this.loadComponent(componentName, element);
            }
          }
        });
      },
      { ...defaultOptions, ...options }
    );
  }

  /**
   * Register an element for lazy loading
   * @param {HTMLElement} element - Element to observe
   * @param {string} componentName - Name of component to load
   * @param {Object} observerOptions - Observer configuration
   */
  observe(element, componentName, observerOptions = {}) {
    element.dataset.lazyComponent = componentName;

    let observer = this.observers.get(JSON.stringify(observerOptions));
    if (!observer) {
      observer = this.createObserver(observerOptions);
      this.observers.set(JSON.stringify(observerOptions), observer);
    }

    observer.observe(element);
  }

  /**
   * Load a component dynamically
   * @param {string} componentName - Name of component to load
   * @param {HTMLElement} element - Element that triggered the load
   */
  async loadComponent(componentName, element) {
    if (this.loadedComponents.has(componentName)) {
      return;
    }

    try {
      this.loadedComponents.add(componentName);

      switch (componentName) {
        case 'image-lightbox':
          await this.loadImageLightbox(element);
          break;
        case 'sidebar-navigation':
          await this.loadSidebarNavigation(element);
          break;
        case 'password-protection':
          await this.loadPasswordProtection(element);
          break;
        default:
          console.warn(`Unknown component: ${componentName}`);
      }
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
      this.loadedComponents.delete(componentName);
    }
  }

  /**
   * Load ImageLightbox component
   * @param {HTMLElement} element - Triggering element
   */
  async loadImageLightbox(element) {
    const { default: ImageLightbox } = await import(
      '../components/ImageLightbox/ImageLightbox.js'
    );

    if (!customElements.get('image-lightbox')) {
      customElements.define('image-lightbox', ImageLightbox);
    }

    // Create and append the lightbox component
    const lightbox = document.createElement('image-lightbox');
    document.body.appendChild(lightbox);

    // Remove the observer since component is loaded
    this.unobserve(element);
  }

  /**
   * Load SidebarNavigation component
   * @param {HTMLElement} element - Triggering element
   */
  async loadSidebarNavigation(element) {
    const { default: SidebarNavigation } = await import(
      '../components/sidebar-navigation/SidebarNavigation.js'
    );

    // Initialize the sidebar navigation
    new SidebarNavigation();

    // Remove the observer since component is loaded
    this.unobserve(element);
  }

  /**
   * Load Password Protection system
   * @param {HTMLElement} element - Triggering element
   */
  async loadPasswordProtection(element) {
    const { initPasswordProtection } = await import(
      '../auth/password-protection.js'
    );

    const caseStudyId = element.dataset.caseStudyId;
    if (caseStudyId) {
      initPasswordProtection(caseStudyId);
    }

    // Remove the observer since component is loaded
    this.unobserve(element);
  }

  /**
   * Stop observing an element
   * @param {HTMLElement} element - Element to stop observing
   */
  unobserve(element) {
    this.observers.forEach(observer => {
      observer.unobserve(element);
    });
  }

  /**
   * Disconnect all observers
   */
  disconnect() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
    this.loadedComponents.clear();
  }
}

// Create a global instance
export const lazyLoader = new LazyLoader();

/**
 * Convenience function to set up lazy loading for common scenarios
 */
export function setupLazyLoading() {
  // Set up lazy loading for image lightbox on project pages
  const projectImages = document.querySelectorAll(
    'figure img.project__img, figure img.project-summary__image'
  );
  if (projectImages.length > 0) {
    const triggerElement =
      projectImages[0].closest('figure') || projectImages[0];
    lazyLoader.observe(triggerElement, 'image-lightbox', {
      rootMargin: '100px',
    });
  }

  // Set up lazy loading for sidebar navigation
  const sidebarNav = document.querySelector('.sidebar-nav');
  if (sidebarNav) {
    lazyLoader.observe(sidebarNav, 'sidebar-navigation', {
      rootMargin: '50px',
    });
  }

  // Set up lazy loading for password protection
  const protectedElements = document.querySelectorAll('[data-case-study-id]');
  protectedElements.forEach(element => {
    lazyLoader.observe(element, 'password-protection', { threshold: 0 });
  });
}
