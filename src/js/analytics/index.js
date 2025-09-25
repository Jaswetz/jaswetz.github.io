// Analytics System Index - Unified interface for advanced analytics
import { SimpleAnalytics } from './simple-analytics.js';

// Create the main analytics instance
const analyticsInstance = new SimpleAnalytics();

// Create a manager interface
const analyticsManager = {
  gtag: (...args) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag(...args);
    }
  },

  trackEvent: (eventName, parameters = {}) => {
    analyticsInstance._sendToGA4(eventName, parameters);
  },

  trackConversion: (conversionType, data = {}) => {
    analyticsInstance._sendToGA4('conversion', {
      conversion_type: conversionType,
      ...data,
    });
  },

  trackUserJourney: (step, data = {}) => {
    analyticsInstance._sendToGA4('user_journey', {
      step: step,
      ...data,
    });
  },

  trackPerformance: (metric, value) => {
    analyticsInstance._sendToGA4('performance', {
      metric: metric,
      value: value,
    });
  },
};

// Create a tracker interface
const analyticsTracker = {
  track: (event, data = {}) => {
    analyticsInstance._sendToGA4(event, data);
  },

  trackPageView: (pageData = {}) => {
    analyticsInstance._sendToGA4('page_view', {
      page_title: document?.title || '',
      page_location: window?.location?.href || '',
      ...pageData,
    });
  },

  trackUserInteraction: (interactionType, element, data = {}) => {
    analyticsInstance._sendToGA4('user_interaction', {
      interaction_type: interactionType,
      element: element,
      ...data,
    });
  },

  trackError: (error, context = {}) => {
    analyticsInstance._sendToGA4('error', {
      error_message: error.message || error,
      error_context: context,
    });
  },
};

// Export the unified analytics system
const analytics = {
  manager: analyticsManager,
  tracker: analyticsTracker,
  instance: analyticsInstance,

  // Initialize the system
  initialize: async () => {
    await analyticsInstance.init();
    return analytics;
  },
};

export default analytics;
