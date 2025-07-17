/**
 * Analytics Manager - Handles Google Analytics 4 initialization and configuration
 * Separates initialization logic from event tracking for better maintainability
 */

export class AnalyticsManager {
  constructor(measurementId = "G-Z5DNDF44NG") {
    this.measurementId = measurementId;
    this.isDevelopment = this._checkDevelopmentEnvironment();
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  /**
   * Check if we're in a development environment
   * @private
   */
  _checkDevelopmentEnvironment() {
    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("127.0.0.1") ||
      window.location.port !== ""
    );
  }

  /**
   * Check if GA4 should be enabled
   * @private
   */
  _shouldEnableGA4() {
    return !this.isDevelopment || window.location.search.includes("ga=true");
  }

  /**
   * Initialize Google Analytics 4
   * @returns {Promise<boolean>} Resolves to true if GA4 was successfully initialized
   */
  async initialize() {
    // Return existing promise if already initializing
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // Return immediately if already initialized
    if (this.isInitialized) {
      return Promise.resolve(true);
    }

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  /**
   * Perform the actual initialization
   * @private
   */
  async _performInitialization() {
    if (this._shouldEnableGA4()) {
      try {
        await this._waitForGA4Script();
        this._configureGA4();
        this.isInitialized = true;
        console.log("Google Analytics 4 initialized");
        return true;
      } catch (error) {
        console.warn("Failed to initialize GA4:", error);
        this._createMockGtag();
        return false;
      }
    } else {
      this._createMockGtag();
      console.log("Google Analytics disabled in development environment");
      return false;
    }
  }

  /**
   * Wait for GA4 script to load
   * @private
   */
  _waitForGA4Script() {
    return new Promise((resolve, reject) => {
      // Check if gtag is already available
      // @ts-ignore - Google Analytics gtag
      if (window.gtag) {
        resolve();
        return;
      }

      let attempts = 0;
      const maxAttempts = 20; // 2 seconds with 100ms intervals

      const checkGA4 = setInterval(() => {
        attempts++;

        if (
          // @ts-ignore - Google Analytics gtag
          window.gtag ||
          document.querySelector("script[src*=\"googletagmanager.com/gtag/js\"]")
        ) {
          clearInterval(checkGA4);
          // Give the script a moment to fully initialize
          setTimeout(resolve, 100);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkGA4);
          reject(new Error("GA4 script failed to load within timeout"));
        }
      }, 100);
    });
  }

  /**
   * Configure Google Analytics 4
   * @private
   */
  _configureGA4() {
    // Initialize dataLayer and gtag if not already present
    // @ts-ignore - Google Analytics dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // @ts-ignore - Google Analytics gtag
    if (!window.gtag) {
      function gtag() {
        // @ts-ignore - Google Analytics dataLayer
        dataLayer.push(arguments);
      }
      // @ts-ignore - Google Analytics gtag
      window.gtag = gtag;
    }

    // @ts-ignore - Google Analytics gtag
    window.gtag("js", new Date());

    // Configure GA4 with enhanced measurement
    // @ts-ignore - Google Analytics gtag
    window.gtag("config", this.measurementId, {
      // Enable enhanced measurement features
      enhanced_measurement: true,
      // Track page views automatically
      page_title: document.title,
      page_location: window.location.href,
      // Enable demographic reports (optional)
      allow_ad_personalization_signals: false,
      // Enable Google Signals for cross-device tracking (optional)
      allow_google_signals: true,
    });
  }

  /**
   * Create mock gtag function for development/fallback
   * @private
   */
  _createMockGtag() {
    // @ts-ignore - Mock function for development
    window.gtag = function () {
      console.log("GA4 (dev mode):", arguments);
    };
    // @ts-ignore - Google Analytics dataLayer
    window.dataLayer = window.dataLayer || [];
  }

  /**
   * Check if gtag is available and functional
   * @returns {boolean}
   */
  isGtagAvailable() {
    // @ts-ignore - Google Analytics gtag
    return typeof window.gtag === "function";
  }

  /**
   * Safe wrapper for gtag calls
   * @param {...any} args - Arguments to pass to gtag
   */
  gtag(...args) {
    if (this.isGtagAvailable()) {
      // @ts-ignore - Google Analytics gtag
      return window.gtag.apply(window, args);
    } else {
      console.log("GA4 not available, event not tracked:", args);
    }
  }

  /**
   * Get initialization status
   * @returns {boolean}
   */
  getInitializationStatus() {
    return this.isInitialized;
  }
}
