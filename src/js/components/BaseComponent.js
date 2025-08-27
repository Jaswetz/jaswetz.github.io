/**
 * Base Web Component Class
 * Provides standardized lifecycle management, event handling, and cleanup
 * All custom components should extend this class for consistent behavior
 */

import logger from "../utils/Logger.js";
import { scrollManager } from "../utils/ScrollManager.js";

class BaseComponent extends HTMLElement {
  constructor() {
    super();

    // Create shadow DOM
    this.attachShadow({ mode: "open" });

    // Initialize cleanup tracking
    this.eventListeners = [];
    this.observers = [];
    this.timeouts = [];
    this.intervals = [];
    this.scrollSubscriptions = [];
    this.abortControllers = [];

    // Component state
    this.isConnected = false;
    this.isInitialized = false;

    // Bind methods to maintain context
    this.handleError = this.handleError.bind(this);

    // Set up error boundary
    this.setupErrorBoundary();

    logger.debug(`${this.constructor.name}: Component created`);
  }

  /**
   * Set up error boundary for the component
   */
  setupErrorBoundary() {
    window.addEventListener("error", this.handleError);
    window.addEventListener("unhandledrejection", this.handleError);
  }

  /**
   * Handle component errors
   * @param {Event} event - Error event
   */
  handleError(event) {
    if (event.target === this || this.contains(event.target)) {
      logger.error(
        `${this.constructor.name}: Component error`,
        event.error || event.reason
      );
      this.onError(event.error || event.reason);
    }
  }

  /**
   * Override this method to handle component-specific errors
   * @param {Error} error - The error that occurred
   */
  onError(error) {
    // Default error handling - can be overridden by subclasses
    this.setAttribute("data-error", "true");

    // Optionally show error message in development
    if (logger.isDevelopment) {
      const errorDiv = document.createElement("div");
      errorDiv.style.cssText = `
        background: #fee; 
        border: 1px solid #fcc; 
        padding: 8px; 
        margin: 4px; 
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
        color: #c00;
      `;
      errorDiv.textContent = `Error in ${this.constructor.name}: ${error.message}`;
      this.shadowRoot.appendChild(errorDiv);
    }
  }

  /**
   * Add event listener with automatic cleanup
   * @param {EventTarget} target - Event target
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {Object|boolean} options - Event options
   * @returns {Function} Cleanup function
   */
  addEventListenerWithCleanup(target, event, handler, options = {}) {
    if (!target || typeof handler !== "function") {
      logger.warn(
        `${this.constructor.name}: Invalid event listener parameters`
      );
      return () => {};
    }

    // Create abort controller for this listener
    const abortController = new AbortController();
    const listenerOptions = {
      ...options,
      signal: abortController.signal,
    };

    target.addEventListener(event, handler, listenerOptions);

    const listenerInfo = {
      target,
      event,
      handler,
      options: listenerOptions,
      abortController,
    };

    this.eventListeners.push(listenerInfo);
    this.abortControllers.push(abortController);

    // Return cleanup function
    return () => {
      abortController.abort();
      const index = this.eventListeners.indexOf(listenerInfo);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  /**
   * Add timeout with automatic cleanup
   * @param {Function} callback - Callback function
   * @param {number} delay - Delay in milliseconds
   * @returns {number} Timeout ID
   */
  addTimeoutWithCleanup(callback, delay) {
    const timeoutId = setTimeout(() => {
      callback();
      // Remove from tracking array when it executes
      const index = this.timeouts.indexOf(timeoutId);
      if (index > -1) {
        this.timeouts.splice(index, 1);
      }
    }, delay);

    this.timeouts.push(timeoutId);
    return timeoutId;
  }

  /**
   * Add interval with automatic cleanup
   * @param {Function} callback - Callback function
   * @param {number} interval - Interval in milliseconds
   * @returns {number} Interval ID
   */
  addIntervalWithCleanup(callback, interval) {
    const intervalId = setInterval(callback, interval);
    this.intervals.push(intervalId);
    return intervalId;
  }

  /**
   * Add observer with automatic cleanup
   * @param {Object} observer - Observer instance (MutationObserver, IntersectionObserver, etc.)
   * @returns {Object} The observer instance
   */
  addObserverWithCleanup(observer) {
    if (!observer || typeof observer.disconnect !== "function") {
      logger.warn(`${this.constructor.name}: Invalid observer`);
      return observer;
    }

    this.observers.push(observer);
    return observer;
  }

  /**
   * Subscribe to scroll events with automatic cleanup
   * @param {Function} callback - Scroll callback
   * @param {Object} options - Scroll options
   * @returns {Function} Unsubscribe function
   */
  addScrollListenerWithCleanup(callback, options = {}) {
    const unsubscribe = scrollManager.subscribe(callback, {
      id: `${this.constructor.name}_${Date.now()}`,
      ...options,
    });

    this.scrollSubscriptions.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Create a fetch request with automatic abort on cleanup
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @returns {Promise} Fetch promise
   */
  createAbortableFetch(url, options = {}) {
    const abortController = new AbortController();
    this.abortControllers.push(abortController);

    return fetch(url, {
      ...options,
      signal: abortController.signal,
    });
  }

  /**
   * Safely query elements within the component
   * @param {string} selector - CSS selector
   * @param {boolean} all - Whether to return all matches
   * @returns {Element|NodeList|null} Query result
   */
  query(selector, all = false) {
    try {
      return all
        ? this.shadowRoot.querySelectorAll(selector)
        : this.shadowRoot.querySelector(selector);
    } catch (error) {
      logger.error(
        `${this.constructor.name}: Invalid selector "${selector}"`,
        error
      );
      return all ? [] : null;
    }
  }

  /**
   * Safely set innerHTML with error handling
   * @param {Element} element - Target element
   * @param {string} html - HTML content
   */
  safeSetHTML(element, html) {
    if (!element) {
      logger.warn(`${this.constructor.name}: Cannot set HTML on null element`);
      return;
    }

    try {
      element.innerHTML = html;
    } catch (error) {
      logger.error(`${this.constructor.name}: Error setting HTML`, error);
      element.textContent = "Error loading content";
    }
  }

  /**
   * Emit custom event from component
   * @param {string} eventName - Event name
   * @param {*} detail - Event detail data
   * @param {Object} options - Event options
   */
  emit(eventName, detail = null, options = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true,
      ...options,
    });

    this.dispatchEvent(event);
    logger.debug(
      `${this.constructor.name}: Emitted event "${eventName}"`,
      detail
    );
  }

  /**
   * Get component configuration from attributes
   * @param {Object} defaults - Default configuration
   * @returns {Object} Merged configuration
   */
  getConfig(defaults = {}) {
    const config = { ...defaults };

    // Parse data attributes
    for (const attr of this.attributes) {
      if (attr.name.startsWith("data-")) {
        const key = attr.name
          .slice(5)
          .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        let value = attr.value;

        // Try to parse as JSON, fallback to string
        try {
          value = JSON.parse(value);
        } catch {
          // Keep as string
        }

        config[key] = value;
      }
    }

    return config;
  }

  /**
   * Standard lifecycle method - called when element is added to DOM
   */
  connectedCallback() {
    this.isConnected = true;

    try {
      this.init();
      this.isInitialized = true;
      logger.debug(`${this.constructor.name}: Connected and initialized`);
    } catch (error) {
      logger.error(
        `${this.constructor.name}: Error during initialization`,
        error
      );
      this.onError(error);
    }
  }

  /**
   * Standard lifecycle method - called when element is removed from DOM
   */
  disconnectedCallback() {
    this.isConnected = false;

    try {
      this.cleanup();
      logger.debug(`${this.constructor.name}: Disconnected and cleaned up`);
    } catch (error) {
      logger.error(`${this.constructor.name}: Error during cleanup`, error);
    }
  }

  /**
   * Standard lifecycle method - called when attributes change
   * @param {string} name - Attribute name
   * @param {string} oldValue - Old value
   * @param {string} newValue - New value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isInitialized) {
      try {
        this.onAttributeChanged(name, oldValue, newValue);
      } catch (error) {
        logger.error(
          `${this.constructor.name}: Error handling attribute change`,
          error
        );
        this.onError(error);
      }
    }
  }

  /**
   * Override this method to initialize the component
   * This is called automatically when the component is connected
   */
  init() {
    // Override in subclasses
    logger.debug(`${this.constructor.name}: Default init called`);
  }

  /**
   * Override this method to handle attribute changes
   * @param {string} name - Attribute name
   * @param {string} oldValue - Old value
   * @param {string} newValue - New value
   */
  onAttributeChanged(name, oldValue, newValue) {
    // Override in subclasses
    logger.debug(
      `${this.constructor.name}: Attribute "${name}" changed from "${oldValue}" to "${newValue}"`
    );
  }

  /**
   * Cleanup all resources
   */
  cleanup() {
    // Abort all controllers
    this.abortControllers.forEach((controller) => {
      try {
        controller.abort();
      } catch (error) {
        logger.warn(
          `${this.constructor.name}: Error aborting controller`,
          error
        );
      }
    });

    // Clean up observers
    this.observers.forEach((observer) => {
      try {
        observer.disconnect();
      } catch (error) {
        logger.warn(
          `${this.constructor.name}: Error disconnecting observer`,
          error
        );
      }
    });

    // Clean up timeouts
    this.timeouts.forEach((timeoutId) => {
      try {
        clearTimeout(timeoutId);
      } catch (error) {
        logger.warn(`${this.constructor.name}: Error clearing timeout`, error);
      }
    });

    // Clean up intervals
    this.intervals.forEach((intervalId) => {
      try {
        clearInterval(intervalId);
      } catch (error) {
        logger.warn(`${this.constructor.name}: Error clearing interval`, error);
      }
    });

    // Clean up scroll subscriptions
    this.scrollSubscriptions.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch (error) {
        logger.warn(
          `${this.constructor.name}: Error unsubscribing from scroll`,
          error
        );
      }
    });

    // Remove error listeners
    window.removeEventListener("error", this.handleError);
    window.removeEventListener("unhandledrejection", this.handleError);

    // Clear arrays
    this.eventListeners = [];
    this.observers = [];
    this.timeouts = [];
    this.intervals = [];
    this.scrollSubscriptions = [];
    this.abortControllers = [];

    // Remove error state
    this.removeAttribute("data-error");
  }

  /**
   * Get component debug information
   * @returns {Object} Debug information
   */
  getDebugInfo() {
    return {
      name: this.constructor.name,
      isConnected: this.isConnected,
      isInitialized: this.isInitialized,
      eventListeners: this.eventListeners.length,
      observers: this.observers.length,
      timeouts: this.timeouts.length,
      intervals: this.intervals.length,
      scrollSubscriptions: this.scrollSubscriptions.length,
      abortControllers: this.abortControllers.length,
      hasError: this.hasAttribute("data-error"),
    };
  }
}

export default BaseComponent;
