/**
 * Minimal Analytics - Ultra-lightweight analytics solution
 * Target size: <3KB, essential tracking only
 */

class SimpleAnalytics {
  constructor(options = {}) {
    this.measurementId = options.measurementId || "G-Z5DNDF44NG";
    this.isInitialized = false;
    this.consentGiven = this._checkConsent();
    this.isDevelopment = this._isDevelopment();
    this.queue = [];
    this.fallbackMode = false;
  }

  /**
   * Initialize analytics
   */
  async init() {
    if (this.isInitialized) return true;

    try {
      // Wait for gtag to be available or create fallback
      await this._waitForGtag();

      if (!this.fallbackMode) {
        this._configureGA4();
      }

      this.isInitialized = true;

      // Process queued events
      this._processQueue();

      // Enable auto-tracking
      this._enableAutoTracking();

      return true;
    } catch (error) {
      this._handleError("initialization", error);
      this.fallbackMode = true;
      this.isInitialized = true; // Allow fallback mode
      return false;
    }
  }

  /**
   * Wait for Google Analytics gtag to load
   */
  _waitForGtag() {
    return new Promise((resolve) => {
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        this.fallbackMode = true;
        resolve();
        return;
      }

      if (this.fallbackMode) {
        resolve();
        return;
      }

      // Check if gtag already exists
      if (window.gtag) {
        resolve();
        return;
      }

      // Wait for script to load
      let attempts = 0;
      const maxAttempts = 20;

      const checkGtag = setInterval(() => {
        attempts++;

        if (window.gtag) {
          clearInterval(checkGtag);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkGtag);
          this.fallbackMode = true;
          resolve(); // Resolve in fallback mode
        }
      }, 100);
    });
  }

  /**
   * Configure Google Analytics 4
   */
  _configureGA4() {
    if (this.fallbackMode || typeof document === "undefined") return;

    // Initialize dataLayer if needed
    window.dataLayer = window.dataLayer || [];

    // Configure GA4
    window.gtag("js", new Date());
    window.gtag("config", this.measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      allow_ad_personalization_signals: false,
      allow_google_signals: false, // Privacy-first
      send_page_view: true,
    });
  }

  /**
   * Check if user has given consent
   */
  _checkConsent() {
    try {
      const consent = localStorage.getItem("analytics-consent");
      return consent === "granted";
    } catch {
      return false; // Default to no consent if localStorage fails
    }
  }

  /**
   * Set user consent
   */
  setConsent(granted) {
    try {
      localStorage.setItem("analytics-consent", granted ? "granted" : "denied");
      this.consentGiven = granted;

      if (granted && this.isInitialized) {
        this._processQueue();
      }
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Check if in development environment
   */
  _isDevelopment() {
    if (typeof window === "undefined") {
      return true; // Assume development if no window (Node.js environment)
    }
    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.port !== ""
    );
  }

  /**
   * Enable automatic tracking
   */
  _enableAutoTracking() {
    if (typeof document === "undefined") return;

    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.trackTimeOnPage();
      }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener("scroll", () => {
      const scrollDepth = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (scrollDepth % 25 === 0) {
          // Track at 25%, 50%, 75%, 100%
          this.trackScrollDepth(scrollDepth);
        }
      }
    });

    // Initialize Core Web Vitals monitoring
    this._initCoreWebVitals();
  }

  /**
   * Initialize Core Web Vitals monitoring (simplified)
   */
  _initCoreWebVitals() {
    if (typeof window === "undefined" || this.isDevelopment) return;

    // Simplified LCP tracking
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            this.trackCoreWebVital("LCP", lastEntry.startTime);
          }
        });
        observer.observe({ entryTypes: ["largest-contentful-paint"] });
        setTimeout(() => observer.disconnect(), 5000);
      } catch (error) {
        this._handleError("Core Web Vitals", error);
      }
    }
  }

  /**
   * Send event to Google Analytics 4
   */
  _sendToGA4(eventName, parameters = {}) {
    if (!this.consentGiven || this.fallbackMode) {
      // Queue for later if no consent, or log in fallback mode
      if (!this.consentGiven) {
        this.queue.push({ eventName, parameters });
      } else if (this.fallbackMode) {
        console.log("Analytics (fallback):", eventName, parameters);
      }
      return;
    }

    try {
      window.gtag("event", eventName, parameters);
    } catch (error) {
      this._handleError("sendToGA4", error);
    }
  }

  /**
   * Process queued events
   */
  _processQueue() {
    if (!this.consentGiven) return;

    this.queue.forEach(({ eventName, parameters }) => {
      this._sendToGA4(eventName, parameters);
    });
    this.queue = [];
  }

  /**
   * Handle errors gracefully
   */
  _handleError(context, error) {
    console.warn(`Analytics error in ${context}:`, error);
    // Could send to error reporting service here if needed
  }

  // ===== PUBLIC API METHODS =====

  /**
   * Track project clicks/views
   */
  trackProjectClick(projectName, projectType = "unknown") {
    this._sendToGA4("project_interaction", {
      project_name: projectName,
      project_type: projectType,
      interaction_type: "click",
    });
  }

  /**
   * Track resume downloads
   */
  trackResumeDownload() {
    this._sendToGA4("file_download", {
      file_name: "resume",
      file_type: "pdf",
    });
  }

  /**
   * Track contact form interactions
   */
  trackContactForm(action, method = "unknown") {
    this._sendToGA4("contact_form", {
      action: action,
      method: method,
    });
  }

  /**
   * Track external link clicks
   */
  trackExternalLink(url, linkText = "") {
    this._sendToGA4("external_link", {
      link_url: url,
      link_text: linkText,
    });
  }

  /**
   * Track scroll depth (simplified)
   */
  trackScrollDepth(depth = null) {
    const scrollDepth =
      depth ||
      Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );
    this._sendToGA4("scroll_depth", { scroll_depth: scrollDepth });
  }

  /**
   * Track time on page (simplified)
   */
  trackTimeOnPage() {
    if (!this.pageStartTime) {
      this.pageStartTime = Date.now();
      return;
    }
    const timeSpent = Math.round((Date.now() - this.pageStartTime) / 1000);
    this._sendToGA4("time_on_page", { time_spent_seconds: timeSpent });
  }

  /**
   * Track Core Web Vitals
   */
  trackCoreWebVital(metric, value) {
    this._sendToGA4("core_web_vitals", {
      metric: metric,
      value: Math.round(value * 100) / 100, // Round to 2 decimal places
      page_path: window.location.pathname,
    });
  }

  /**
   * Get analytics status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      consentGiven: this.consentGiven,
      fallbackMode: this.fallbackMode,
      isDevelopment: this.isDevelopment,
      queueLength: this.queue.length,
    };
  }
}

// Create singleton instance
const analytics = new SimpleAnalytics();

// Auto-initialize only in browser environment
if (typeof window !== "undefined") {
  // Set up global API immediately (synchronously)
  const globalAPI = {
    trackProjectClick: (...args) => analytics.trackProjectClick(...args),
    trackResumeDownload: () => analytics.trackResumeDownload(),
    trackContactForm: (...args) => analytics.trackContactForm(...args),
    trackExternalLink: (...args) => analytics.trackExternalLink(...args),
    trackScrollDepth: () => analytics.trackScrollDepth(),
    trackTimeOnPage: () => analytics.trackTimeOnPage(),
    trackCaseStudyInteraction: (...args) =>
      analytics.trackCaseStudyInteraction(...args),
    trackImageLightbox: (...args) => analytics.trackImageLightbox(...args),
    trackCaseStudyCompletion: (...args) =>
      analytics.trackCaseStudyCompletion(...args),
    setConsent: (granted) => analytics.setConsent(granted),
    getStatus: () => analytics.getStatus(),
  };

  // Expose global API
  window.portfolioAnalytics = globalAPI;

  // Initialize analytics asynchronously
  analytics
    .init()
    .then((success) => {
      if (success) {
        console.log("Portfolio Analytics initialized successfully");
      } else {
        console.log("Portfolio Analytics initialized in fallback mode");
      }
    })
    .catch((error) => {
      console.warn("Portfolio Analytics initialization failed:", error);
    });
}

// Export for ES modules
export default analytics;

// Also export the class for testing
export { SimpleAnalytics };
