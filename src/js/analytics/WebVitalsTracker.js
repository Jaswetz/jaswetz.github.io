/**
 * Web Vitals Tracker - Monitors and reports Core Web Vitals metrics
 * Integrates with existing AnalyticsManager for comprehensive tracking
 */

export class WebVitalsTracker {
  constructor(analyticsManager) {
    this.analyticsManager = analyticsManager;
    this.isInitialized = false;
  }

  /**
   * Initialize Web Vitals tracking
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Dynamically import web-vitals to avoid bundle bloat if not supported
      const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import("web-vitals");

      // Track Core Web Vitals
      onCLS((metric) => this.trackMetric("CLS", metric));
      onINP((metric) => this.trackMetric("INP", metric)); // INP replaces FID
      onFCP((metric) => this.trackMetric("FCP", metric));
      onLCP((metric) => this.trackMetric("LCP", metric));
      onTTFB((metric) => this.trackMetric("TTFB", metric));

      this.isInitialized = true;
      console.log("Web Vitals tracking initialized");
    } catch (error) {
      console.warn("Failed to initialize Web Vitals tracking:", error);
    }
  }

  /**
   * Track a Web Vitals metric
   * @param {string} name - Metric name (CLS, INP, FCP, LCP, TTFB)
   * @param {Object} metric - Web Vitals metric object
   */
  trackMetric(name, metric) {
    const { value, rating } = metric;

    // Log to console for development
    console.log(`Web Vitals ${name}:`, {
      value: this.formatValue(name, value),
      rating,
      timestamp: new Date().toISOString(),
    });

    // Send to analytics if available
    if (this.analyticsManager && this.analyticsManager.isGtagAvailable()) {
      this.analyticsManager.gtag("event", `web_vitals_${name}`, {
        event_category: "Web Vitals",
        event_label: rating,
        value: Math.round(value),
        custom_map: {
          metric_name: name,
          metric_value: value,
          metric_rating: rating,
        },
      });
    }

    // Store in localStorage for debugging/performance monitoring
    this.storeMetric(name, metric);
  }

  /**
   * Format metric value for display
   * @param {string} name - Metric name
   * @param {number} value - Raw metric value
   * @returns {string} Formatted value
   */
  formatValue(name, value) {
    switch (name) {
      case "CLS":
        return value.toFixed(4);
      case "INP":
      case "FCP":
      case "LCP":
        return `${Math.round(value)}ms`;
      case "TTFB":
        return `${Math.round(value)}ms`;
      default:
        return value.toString();
    }
  }

  /**
   * Store metric in localStorage for debugging
   * @param {string} name - Metric name
   * @param {Object} metric - Metric object
   */
  storeMetric(name, metric) {
    try {
      const key = "web_vitals_metrics";
      const stored = JSON.parse(localStorage.getItem(key) || "{}");

      if (!stored[name] || metric.value > stored[name].value) {
        stored[name] = {
          value: metric.value,
          rating: metric.rating,
          timestamp: new Date().toISOString(),
        };
      }

      localStorage.setItem(key, JSON.stringify(stored));
    } catch (error) {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Get stored metrics for debugging
   * @returns {Object} Stored metrics
   */
  getStoredMetrics() {
    try {
      return JSON.parse(localStorage.getItem("web_vitals_metrics") || "{}");
    } catch (error) {
      return {};
    }
  }

  /**
   * Clear stored metrics
   */
  clearStoredMetrics() {
    try {
      localStorage.removeItem("web_vitals_metrics");
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Check if Web Vitals are supported
   * @returns {boolean}
   */
  isSupported() {
    return typeof PerformanceObserver !== "undefined";
  }
}
