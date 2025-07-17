/**
 * Main Analytics Module - Provides a clean public API for analytics functionality
 * Coordinates AnalyticsManager and AnalyticsEventTracker
 */

import { AnalyticsManager } from "./AnalyticsManager.js";
import { AnalyticsEventTracker } from "./AnalyticsEventTracker.js";

class Analytics {
  constructor() {
    this.manager = new AnalyticsManager();
    this.tracker = new AnalyticsEventTracker(this.manager);
    this.isInitialized = false;
  }

  /**
   * Initialize analytics
   * @returns {Promise<boolean>} Success status
   */
  async init() {
    if (this.isInitialized) {
      return true;
    }

    const success = await this.manager.initialize();
    this.isInitialized = success;

    // Enable auto-tracking by default
    if (success) {
      this.tracker.enableAutoTracking();
    }

    return success;
  }

  /**
   * Manual event tracking methods (delegated to tracker)
   */
  trackProjectClick(projectName, projectType) {
    return this.tracker.trackProjectClick(projectName, projectType);
  }

  trackResumeDownload() {
    return this.tracker.trackResumeDownload();
  }

  trackContactForm(action, method) {
    return this.tracker.trackContactForm(action, method);
  }

  trackExternalLink(url, linkText) {
    return this.tracker.trackExternalLink(url, linkText);
  }

  trackScrollDepth() {
    return this.tracker.trackScrollDepth();
  }

  trackTimeOnPage() {
    return this.tracker.trackTimeOnPage();
  }

  /**
   * Control methods
   */
  enableAutoTracking() {
    return this.tracker.enableAutoTracking();
  }

  disableAutoTracking() {
    return this.tracker.disableAutoTracking();
  }

  /**
   * Utility methods
   */
  isReady() {
    return this.isInitialized && this.manager.isGtagAvailable();
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      gtagAvailable: this.manager.isGtagAvailable(),
      autoTrackingEnabled: this.tracker.isAutoTrackingEnabled,
    };
  }

  /**
   * Direct gtag access for custom events
   * @param {...any} args - Arguments to pass to gtag
   */
  gtag(...args) {
    return this.manager.gtag(...args);
  }
}

// Create and export singleton instance
const analytics = new Analytics();

// Auto-initialize on import
analytics.init().catch((error) => {
  console.warn("Analytics initialization failed:", error);
});

export default analytics;

// Also export for window global access (backward compatibility)
// @ts-ignore - Custom analytics object
window.portfolioAnalytics = {
  trackProjectClick: (...args) => analytics.trackProjectClick(...args),
  trackResumeDownload: () => analytics.trackResumeDownload(),
  trackContactForm: (...args) => analytics.trackContactForm(...args),
  trackExternalLink: (...args) => analytics.trackExternalLink(...args),
  trackScrollDepth: () => analytics.trackScrollDepth(),
  trackTimeOnPage: () => analytics.trackTimeOnPage(),
  getStatus: () => analytics.getStatus(),
};
