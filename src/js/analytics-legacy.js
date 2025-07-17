
/**
 * Google Analytics 4 Configuration and Custom Event Tracking
 * Refactored version using modular architecture
 * Measurement ID: G-Z5DNDF44NG
 */

import analytics from "./analytics/index.js";

// The analytics module handles all initialization and setup automatically
// This file maintains backward compatibility and provides the same global interface

/**
 * Legacy function exports for backward compatibility
 * These functions delegate to the new analytics module
 */

// Track project card clicks
function trackProjectClick(projectName, projectType) {
  return analytics.trackProjectClick(projectName, projectType);
}

// Track resume downloads
function trackResumeDownload() {
  return analytics.trackResumeDownload();
}

// Track contact form interactions
function trackContactForm(action, method = "") {
  return analytics.trackContactForm(action, method);
}

// Track external link clicks
function trackExternalLink(url, linkText) {
  return analytics.trackExternalLink(url, linkText);
}

// Track scroll depth (custom implementation)
function trackScrollDepth() {
  return analytics.trackScrollDepth();
}

// Track time on page
function trackTimeOnPage() {
  return analytics.trackTimeOnPage();
}

// Safe gtag wrapper that checks if gtag is available
function safeGtag() {
  return analytics.gtag.apply(analytics, arguments);
}

/**
 * Export functions for manual tracking if needed
 * Maintains the same API as the original implementation
 */
// @ts-ignore - Custom analytics object for backward compatibility
window.portfolioAnalytics = window.portfolioAnalytics || {
  trackProjectClick,
  trackResumeDownload,
  trackContactForm,
  trackExternalLink,
  trackScrollDepth,
  trackTimeOnPage,
  safeGtag,
  // Add new methods from modular implementation
  getStatus: () => analytics.getStatus(),
  enableAutoTracking: () => analytics.enableAutoTracking(),
  disableAutoTracking: () => analytics.disableAutoTracking(),
};

// Export analytics instance as default for ES6 imports
export default analytics;

// Named exports for backward compatibility
export {
  trackProjectClick,
  trackResumeDownload,
  trackContactForm,
  trackExternalLink,
  trackScrollDepth,
  trackTimeOnPage,
  safeGtag,
};
