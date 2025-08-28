/**
 * Cross-Platform Integration - Synchronizes events between Microsoft Clarity and Google Analytics 4
 * Ensures unified tracking and prevents duplicate events while maintaining data integrity
 */

export class CrossPlatformIntegration {
  constructor(analyticsManager, clarityTracker) {
    this.analyticsManager = analyticsManager;
    this.clarityTracker = clarityTracker;
    this.eventMappings = new Map();
    this.isInitialized = false;
    this.duplicatePrevention = new Set();
  }

  /**
   * Initialize cross-platform integration
   */
  initialize() {
    if (this.isInitialized) return;

    this.setupEventMappings();
    this.setupEventForwarding();
    this.setupDuplicatePrevention();
    this.isInitialized = true;

    console.log("Cross-platform integration initialized");
  }

  /**
   * Setup event mappings between Clarity and GA4
   */
  setupEventMappings() {
    // Map Clarity events to GA4 events
    this.eventMappings.set("homepage_visit", {
      ga4: "page_view",
      category: "engagement",
      value: 1,
    });

    this.eventMappings.set("project_view", {
      ga4: "project_view",
      category: "engagement",
      value: 2,
    });

    this.eventMappings.set("case_study_complete", {
      ga4: "case_study_complete",
      category: "engagement",
      value: 10,
    });

    this.eventMappings.set("contact_page_visit", {
      ga4: "contact_page_visit",
      category: "lead_generation",
      value: 5,
    });

    this.eventMappings.set("resume_download", {
      ga4: "file_download",
      category: "business",
      value: 25,
    });

    this.eventMappings.set("external_link_click", {
      ga4: "click",
      category: "engagement",
      value: 3,
    });

    this.eventMappings.set("scroll_depth_75", {
      ga4: "scroll",
      category: "engagement",
      value: 1,
    });
  }

  /**
   * Setup automatic event forwarding
   */
  setupEventForwarding() {
    // Forward Clarity events to GA4
    this.setupClarityToGA4Forwarding();

    // Forward GA4 events to Clarity (selective)
    this.setupGA4ToClarityForwarding();
  }

  /**
   * Forward Clarity events to GA4
   */
  setupClarityToGA4Forwarding() {
    // Override Clarity's event tracking to also send to GA4
    const originalClarityEvent = window.clarity?.event;

    if (originalClarityEvent) {
      window.clarity.event = (eventName, properties = {}) => {
        // Call original Clarity event
        originalClarityEvent.call(window.clarity, eventName, properties);

        // Forward to GA4 if mapping exists
        this.forwardClarityEventToGA4(eventName, properties);
      };
    }
  }

  /**
   * Forward GA4 events to Clarity (selective forwarding)
   */
  setupGA4ToClarityForwarding() {
    // Only forward high-value GA4 events to Clarity
    const highValueEvents = [
      "file_download",
      "contact_form_submit",
      "purchase",
      "conversion_milestone",
    ];

    // Hook into GA4 event tracking (if available)
    const originalGtag = window.gtag;
    if (originalGtag) {
      window.gtag = (...args) => {
        // Call original gtag
        originalGtag.apply(window, args);

        // Forward high-value events to Clarity
        const [command, eventName, parameters] = args;
        if (command === "event" && highValueEvents.includes(eventName)) {
          this.forwardGA4EventToClarity(eventName, parameters);
        }
      };
    }
  }

  /**
   * Forward Clarity event to GA4
   */
  forwardClarityEventToGA4(eventName, properties = {}) {
    const mapping = this.eventMappings.get(eventName);
    if (!mapping) return;

    // Prevent duplicate events
    const eventKey = `clarity_${eventName}_${Date.now()}`;
    if (this.duplicatePrevention.has(eventKey)) return;
    this.duplicatePrevention.add(eventKey);

    // Send to GA4
    this.analyticsManager.gtag("event", mapping.ga4, {
      event_category: mapping.category,
      event_label: eventName,
      value: mapping.value,
      clarity_source: true,
      ...properties,
    });

    // Clean up duplicate prevention set (keep last 100 events)
    if (this.duplicatePrevention.size > 100) {
      const oldestKey = this.duplicatePrevention.values().next().value;
      this.duplicatePrevention.delete(oldestKey);
    }
  }

  /**
   * Forward GA4 event to Clarity
   */
  forwardGA4EventToClarity(eventName, parameters = {}) {
    if (!window.clarity?.event) return;

    // Prevent duplicate events
    const eventKey = `ga4_${eventName}_${Date.now()}`;
    if (this.duplicatePrevention.has(eventKey)) return;
    this.duplicatePrevention.add(eventKey);

    // Map GA4 event to Clarity event
    const clarityEventName = this.mapGA4ToClarityEvent(eventName);

    // Send to Clarity
    window.clarity.event(clarityEventName, {
      ga4_source: true,
      ...parameters,
    });
  }

  /**
   * Map GA4 events to Clarity events
   */
  mapGA4ToClarityEvent(ga4Event) {
    const mapping = {
      file_download: "business_conversion",
      contact_form_submit: "lead_conversion",
      purchase: "revenue_conversion",
      conversion_milestone: "funnel_milestone",
    };

    return mapping[ga4Event] || ga4Event;
  }

  /**
   * Setup duplicate prevention mechanisms
   */
  setupDuplicatePrevention() {
    // Clean up duplicate prevention set periodically
    setInterval(() => {
      if (this.duplicatePrevention.size > 50) {
        // Keep only the most recent 50 events
        const recentEvents = Array.from(this.duplicatePrevention).slice(-50);
        this.duplicatePrevention.clear();
        recentEvents.forEach((event) => this.duplicatePrevention.add(event));
      }
    }, 30000); // Clean up every 30 seconds
  }

  /**
   * Track synchronized conversion event
   */
  trackSynchronizedConversion(conversionType, details = {}) {
    const eventId = `sync_${conversionType}_${Date.now()}`;

    // Track in both systems
    this.trackClarityConversion(conversionType, {
      ...details,
      sync_id: eventId,
    });
    this.trackGA4Conversion(conversionType, { ...details, sync_id: eventId });

    return eventId;
  }

  /**
   * Track conversion in Clarity
   */
  trackClarityConversion(conversionType, details = {}) {
    if (
      this.clarityTracker &&
      typeof this.clarityTracker.trackConversionMilestone === "function"
    ) {
      this.clarityTracker.trackConversionMilestone(conversionType, details);
    }
  }

  /**
   * Track conversion in GA4
   */
  trackGA4Conversion(conversionType, details = {}) {
    const mapping = this.eventMappings.get(conversionType);
    if (mapping) {
      this.analyticsManager.gtag("event", mapping.ga4, {
        event_category: mapping.category,
        event_label: conversionType,
        value: mapping.value,
        ...details,
      });
    }
  }

  /**
   * Get integration status
   */
  getIntegrationStatus() {
    return {
      initialized: this.isInitialized,
      clarityAvailable: typeof window.clarity === "function",
      ga4Available: this.analyticsManager.isGtagAvailable(),
      eventMappingsCount: this.eventMappings.size,
      duplicatePreventionSize: this.duplicatePrevention.size,
    };
  }

  /**
   * Export integration data for debugging
   */
  exportIntegrationData() {
    return {
      status: this.getIntegrationStatus(),
      eventMappings: Object.fromEntries(this.eventMappings),
      recentDuplicates: Array.from(this.duplicatePrevention).slice(-10),
    };
  }

  /**
   * Reset integration state (for testing)
   */
  reset() {
    this.duplicatePrevention.clear();
    this.isInitialized = false;
    console.log("Cross-platform integration reset");
  }
}
