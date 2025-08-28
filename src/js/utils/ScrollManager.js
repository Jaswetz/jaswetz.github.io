/**
 * Centralized scroll event management
 * Replaces multiple scroll listeners with a single optimized handler
 * Provides throttling and callback management
 */

import logger from "./Logger.js";

class ScrollManager {
  constructor() {
    this.callbacks = new Set();
    this.isScrolling = false;
    this.lastScrollY = 0;
    this.scrollDirection = "down";
    this.throttleDelay = 16; // ~60fps

    // Bind methods to maintain context
    this.handleScroll = this.handleScroll.bind(this);
    this.throttledHandler = this.throttle(
      this.handleScroll,
      this.throttleDelay
    );

    // Set up single scroll listener
    this.init();

    logger.debug("ScrollManager initialized");
  }

  /**
   * Initialize scroll event listener
   */
  init() {
    window.addEventListener("scroll", this.throttledHandler, {
      passive: true,
      capture: false,
    });
  }

  /**
   * Subscribe to scroll events
   * @param {Function} callback - Function to call on scroll
   * @param {Object} options - Optional configuration
   * @param {string} options.id - Unique identifier for the callback
   * @param {number} options.throttle - Custom throttle delay for this callback
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback, options = {}) {
    if (typeof callback !== "function") {
      logger.error("ScrollManager: Callback must be a function");
      return () => {};
    }

    const callbackWrapper = {
      fn: callback,
      id: options.id || `callback_${Date.now()}_${Math.random()}`,
      throttle: options.throttle || 0,
      lastCalled: 0,
    };

    this.callbacks.add(callbackWrapper);

    logger.debug(`ScrollManager: Subscribed callback ${callbackWrapper.id}`);

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callbackWrapper);
      logger.debug(
        `ScrollManager: Unsubscribed callback ${callbackWrapper.id}`
      );
    };
  }

  /**
   * Unsubscribe callback by ID
   * @param {string} id - Callback ID to remove
   */
  unsubscribe(id) {
    for (const callback of this.callbacks) {
      if (callback.id === id) {
        this.callbacks.delete(callback);
        logger.debug(`ScrollManager: Unsubscribed callback ${id}`);
        return true;
      }
    }
    logger.warn(`ScrollManager: Callback ${id} not found`);
    return false;
  }

  /**
   * Handle scroll events and notify callbacks
   */
  handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - this.lastScrollY;

    // Determine scroll direction
    if (scrollDelta > 0) {
      this.scrollDirection = "down";
    } else if (scrollDelta < 0) {
      this.scrollDirection = "up";
    }

    const scrollData = {
      scrollY: currentScrollY,
      lastScrollY: this.lastScrollY,
      scrollDelta,
      direction: this.scrollDirection,
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      scrollPercentage: this.getScrollPercentage(currentScrollY),
    };

    const now = performance.now();

    // Call all subscribed callbacks
    this.callbacks.forEach((callbackWrapper) => {
      // Apply individual throttling if specified
      if (callbackWrapper.throttle > 0) {
        if (now - callbackWrapper.lastCalled < callbackWrapper.throttle) {
          return;
        }
        callbackWrapper.lastCalled = now;
      }

      try {
        callbackWrapper.fn(scrollData);
      } catch (error) {
        logger.error(
          `ScrollManager: Error in callback ${callbackWrapper.id}:`,
          error
        );
      }
    });

    this.lastScrollY = currentScrollY;
  }

  /**
   * Calculate scroll percentage
   * @param {number} scrollY - Current scroll position
   * @returns {number} Scroll percentage (0-100)
   */
  getScrollPercentage(scrollY) {
    const documentHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const maxScroll = documentHeight - viewportHeight;

    if (maxScroll <= 0) return 0;

    return Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
  }

  /**
   * Throttle function to limit callback frequency
   * @param {Function} func - Function to throttle
   * @param {number} limit - Throttle limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Debounce function for scroll end detection
   * @param {Function} func - Function to debounce
   * @param {number} delay - Debounce delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Subscribe to scroll end events (when scrolling stops)
   * @param {Function} callback - Function to call when scrolling ends
   * @param {number} delay - Delay to wait after scrolling stops (default: 150ms)
   * @returns {Function} Unsubscribe function
   */
  onScrollEnd(callback, delay = 150) {
    const debouncedCallback = this.debounce(callback, delay);
    return this.subscribe(
      () => {
        debouncedCallback(this.lastScrollY);
      },
      { id: `scrollEnd_${Date.now()}` }
    );
  }

  /**
   * Get current scroll information
   * @returns {Object} Current scroll data
   */
  getCurrentScroll() {
    return {
      scrollY: window.scrollY,
      direction: this.scrollDirection,
      percentage: this.getScrollPercentage(window.scrollY),
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
    };
  }

  /**
   * Scroll to specific position with smooth animation
   * @param {number} targetY - Target scroll position
   * @param {Object} options - Scroll options
   */
  scrollTo(targetY, options = {}) {
    const {
      behavior = "smooth",
      block = "start",
      inline = "nearest",
    } = options;

    window.scrollTo({
      top: targetY,
      behavior,
      block,
      inline,
    });
  }

  /**
   * Scroll to element with offset
   * @param {Element|string} target - Element or selector to scroll to
   * @param {number} offset - Offset from element position
   */
  scrollToElement(target, offset = 0) {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;

    if (!element) {
      logger.warn("ScrollManager: Target element not found");
      return;
    }

    const elementTop = element.offsetTop;
    const targetPosition = elementTop - offset;

    this.scrollTo(targetPosition);
  }

  /**
   * Clean up scroll manager
   */
  destroy() {
    window.removeEventListener("scroll", this.throttledHandler);
    this.callbacks.clear();
    logger.debug("ScrollManager destroyed");
  }

  /**
   * Get debug information
   * @returns {Object} Debug information
   */
  getDebugInfo() {
    return {
      callbackCount: this.callbacks.size,
      lastScrollY: this.lastScrollY,
      direction: this.scrollDirection,
      throttleDelay: this.throttleDelay,
      callbacks: Array.from(this.callbacks).map((cb) => ({
        id: cb.id,
        hasThrottle: cb.throttle > 0,
      })),
    };
  }
}

// Create singleton instance
const scrollManager = new ScrollManager();

export default scrollManager;
export { scrollManager };
