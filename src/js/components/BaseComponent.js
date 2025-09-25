/**
 * BaseComponent - Base class for Web Components
 * Provides common functionality for resource management, event handling, and utilities
 */

class BaseComponent extends HTMLElement {
  constructor() {
    super();

    // Resource tracking for cleanup
    this.eventListeners = [];
    this.observers = [];
    this.timeouts = [];
    this.intervals = [];
    this.scrollSubscriptions = [];
    this.abortControllers = [];

    // Component state
    this._errorState = false;
  }

  /**
   * Add event listener with automatic cleanup tracking
   * @param {EventTarget} target - Element to attach listener to
   * @param {string} event - Event type
   * @param {Function} handler - Event handler function
   * @param {Object} options - Event listener options
   * @returns {Function} Cleanup function
   */
  addEventListenerWithCleanup(target, event, handler, options = {}) {
    if (!target || !event || typeof handler !== 'function') {
      return () => {}; // Return no-op cleanup function
    }

    try {
      target.addEventListener(event, handler, options);

      const cleanup = () => {
        target.removeEventListener(event, handler, options);
        const index = this.eventListeners.indexOf(cleanup);
        if (index > -1) {
          this.eventListeners.splice(index, 1);
        }
      };

      this.eventListeners.push(cleanup);
      return cleanup;
    } catch (error) {
      console.warn('Failed to add event listener:', error);
      return () => {};
    }
  }

  /**
   * Add timeout with automatic cleanup tracking
   * @param {Function} callback - Callback function
   * @param {number} delay - Delay in milliseconds
   * @returns {number} Timeout ID
   */
  addTimeoutWithCleanup(callback, delay) {
    const timeoutId = setTimeout(callback, delay);
    this.timeouts.push(timeoutId);
    return timeoutId;
  }

  /**
   * Add interval with automatic cleanup tracking
   * @param {Function} callback - Callback function
   * @param {number} delay - Interval in milliseconds
   * @returns {number} Interval ID
   */
  addIntervalWithCleanup(callback, delay) {
    const intervalId = setInterval(callback, delay);
    this.intervals.push(intervalId);
    return intervalId;
  }

  /**
   * Add scroll listener with cleanup tracking
   * @param {Function} callback - Scroll callback
   * @returns {Function} Unsubscribe function
   */
  addScrollListenerWithCleanup(callback) {
    // Simple scroll listener implementation
    const unsubscribe = () => {
      window.removeEventListener('scroll', callback);
      const index = this.scrollSubscriptions.indexOf(unsubscribe);
      if (index > -1) {
        this.scrollSubscriptions.splice(index, 1);
      }
    };

    window.addEventListener('scroll', callback, { passive: true });
    this.scrollSubscriptions.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Create abortable fetch request
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise} Fetch promise
   */
  createAbortableFetch(url, options = {}) {
    const controller = new AbortController();
    this.abortControllers.push(controller);

    return fetch(url, {
      ...options,
      signal: controller.signal,
    });
  }

  /**
   * Safe DOM query within shadow root
   * @param {string} selector - CSS selector
   * @returns {Element|null} Found element or null
   */
  query(selector) {
    try {
      return this.shadowRoot?.querySelector(selector) || null;
    } catch (error) {
      console.warn('Invalid selector:', selector, error);
      return null;
    }
  }

  /**
   * Safely set HTML content
   * @param {Element} element - Target element
   * @param {string} html - HTML content
   */
  safeSetHTML(element, html) {
    if (element && typeof html === 'string') {
      element.innerHTML = html;
    }
  }

  /**
   * Get configuration from data attributes
   * @param {Object} defaults - Default configuration values
   * @returns {Object} Merged configuration
   */
  getConfig(defaults = {}) {
    const config = { ...defaults };

    // Parse data attributes
    if (this.attributes) {
      for (const attr of this.attributes) {
        if (attr.name.startsWith('data-')) {
          const key = attr.name
            .slice(5)
            .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

          try {
            // Try to parse as JSON first
            config[key] = JSON.parse(attr.value);
          } catch {
            // Fall back to string value
            config[key] = attr.value;
          }
        }
      }
    }

    return config;
  }

  /**
   * Clean up all tracked resources
   */
  cleanup() {
    // Clean up event listeners
    this.eventListeners.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Error cleaning up event listener:', error);
      }
    });
    this.eventListeners = [];

    // Clean up observers
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Error disconnecting observer:', error);
      }
    });
    this.observers = [];

    // Clean up timeouts
    this.timeouts.forEach(timeoutId => {
      try {
        clearTimeout(timeoutId);
      } catch (error) {
        console.warn('Error clearing timeout:', error);
      }
    });
    this.timeouts = [];

    // Clean up intervals
    this.intervals.forEach(intervalId => {
      try {
        clearInterval(intervalId);
      } catch (error) {
        console.warn('Error clearing interval:', error);
      }
    });
    this.intervals = [];

    // Clean up scroll subscriptions
    this.scrollSubscriptions.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.warn('Error unsubscribing from scroll:', error);
      }
    });
    this.scrollSubscriptions = [];

    // Clean up abort controllers
    this.abortControllers.forEach(controller => {
      try {
        controller.abort();
      } catch (error) {
        console.warn('Error aborting controller:', error);
      }
    });
    this.abortControllers = [];
  }

  /**
   * Get debug information about the component
   * @returns {Object} Debug information
   */
  getDebugInfo() {
    return {
      name: this.constructor.name,
      isConnected: this.isConnected,
      isInitialized: this.isInitialized || false,
      eventListeners: this.eventListeners.length,
      observers: this.observers.length,
      timeouts: this.timeouts.length,
      intervals: this.intervals.length,
      scrollSubscriptions: this.scrollSubscriptions.length,
      abortControllers: this.abortControllers.length,
      hasError: this._errorState || this.getAttribute('data-error') === 'true',
    };
  }

  /**
   * Called when component is disconnected from DOM
   * Override in subclasses and call super.disconnectedCallback()
   */
  disconnectedCallback() {
    this.cleanup();
  }
}

export default BaseComponent;
