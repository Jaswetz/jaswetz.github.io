/**
 * Accessibility utilities for enhanced user experience
 * Handles reduced motion preferences, focus management, and touch targets
 */

class AccessibilityUtils {
  constructor() {
    this.init();
  }

  init() {
    this.setupReducedMotionDetection();
    this.setupFocusManagement();
    this.setupTouchTargetEnhancement();
    this.setupImageAltTextValidation();
  }

  /**
   * Enhanced reduced motion detection with fallbacks for older browsers
   */
  setupReducedMotionDetection() {
    // Check for prefers-reduced-motion support
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    // Check for update: slow as fallback
    const slowUpdate = window.matchMedia('(update: slow)');

    // Check for connection speed as additional fallback
    const slowConnection =
      navigator.connection &&
      (navigator.connection.effectiveType === 'slow-2g' ||
        navigator.connection.effectiveType === '2g');

    const shouldReduceMotion =
      prefersReducedMotion.matches || slowUpdate.matches || slowConnection;

    if (shouldReduceMotion) {
      document.documentElement.classList.add('reduce-motion');
      this.disableAnimations();
    }

    // Listen for changes in motion preferences
    prefersReducedMotion.addEventListener('change', e => {
      if (e.matches) {
        document.documentElement.classList.add('reduce-motion');
        this.disableAnimations();
      } else {
        document.documentElement.classList.remove('reduce-motion');
        this.enableAnimations();
      }
    });
  }

  /**
   * Disable animations for users who prefer reduced motion
   */
  disableAnimations() {
    const style = document.createElement('style');
    style.id = 'reduced-motion-styles';
    style.textContent = `
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }

      .reduce-motion .logo-2d,
      .reduce-motion .logo-2d__square,
      .reduce-motion .logo-2d__circle,
      .reduce-motion .logo-2d__triangle {
        animation: none !important;
        transform: none !important;
      }

      .reduce-motion .companies-carousel__track {
        animation: none !important;
      }

      .reduce-motion .card:hover,
      .reduce-motion .button:hover,
      .reduce-motion a:hover {
        transform: none !important;
      }
    `;

    if (!document.getElementById('reduced-motion-styles')) {
      document.head.appendChild(style);
    }
  }

  /**
   * Re-enable animations when user preference changes
   */
  enableAnimations() {
    const existingStyle = document.getElementById('reduced-motion-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    document.documentElement.classList.remove('reduce-motion');
  }

  /**
   * Enhanced focus management for better keyboard navigation
   */
  setupFocusManagement() {
    // Skip link functionality
    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Enhance focus visibility for keyboard users
    document.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Trap focus in modals and lightboxes
    this.setupFocusTrap();
  }

  /**
   * Setup focus trap for modal elements
   */
  setupFocusTrap() {
    const focusableElements =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector(
          '.lightbox.active, .modal.active'
        );
        if (activeModal) {
          this.closeFocusTrap(activeModal);
        }
      }

      if (e.key === 'Tab') {
        const activeModal = document.querySelector(
          '.lightbox.active, .modal.active'
        );
        if (activeModal) {
          this.handleFocusTrap(e, activeModal);
        }
      }
    });
  }

  /**
   * Handle focus trapping within modal elements
   */
  handleFocusTrap(e, modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  /**
   * Close focus trap and return focus to trigger element
   */
  closeFocusTrap(modal) {
    const triggerElement = modal.dataset.triggerElement;
    if (triggerElement) {
      const element = document.querySelector(triggerElement);
      if (element) {
        element.focus();
      }
    }
  }

  /**
   * Enhance touch targets for better mobile accessibility
   */
  setupTouchTargetEnhancement() {
    // Add touch target enhancement for small interactive elements
    const smallInteractiveElements = document.querySelectorAll(
      'button, a, input, .tag, .bullet-point__icon'
    );

    smallInteractiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        element.classList.add('enhanced-touch-target');
      }
    });

    // Add CSS for enhanced touch targets
    if (!document.getElementById('touch-target-styles')) {
      const style = document.createElement('style');
      style.id = 'touch-target-styles';
      style.textContent = `
        @media (pointer: coarse) {
          .enhanced-touch-target {
            position: relative;
            min-width: 44px;
            min-height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .enhanced-touch-target::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            min-width: 44px;
            min-height: 44px;
            z-index: -1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Validate and enhance image alt text
   */
  setupImageAltTextValidation() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      // Check for missing alt attribute
      if (!img.hasAttribute('alt')) {
        console.warn('Image missing alt attribute:', img.src);
        img.setAttribute('alt', ''); // Add empty alt for decorative images
      }

      // Check for generic alt text that should be improved
      const alt = img.getAttribute('alt');
      const genericTerms = ['image', 'picture', 'photo', 'graphic'];

      if (
        genericTerms.some(
          term => alt.toLowerCase().includes(term) && alt.length < 20
        )
      ) {
        console.warn(
          'Image may have generic alt text that could be improved:',
          img.src,
          alt
        );
      }
    });
  }

  /**
   * Announce dynamic content changes to screen readers
   */
  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion() {
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(update: slow)').matches ||
      document.documentElement.classList.contains('reduce-motion')
    );
  }

  /**
   * Get appropriate animation duration based on user preferences
   */
  getAnimationDuration(defaultDuration = 300) {
    return this.prefersReducedMotion() ? 0 : defaultDuration;
  }
}

// Initialize accessibility utils when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityUtils = new AccessibilityUtils();
  });
} else {
  window.accessibilityUtils = new AccessibilityUtils();
}

export default AccessibilityUtils;
