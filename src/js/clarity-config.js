/**
 * Microsoft Clarity Advanced Configuration
 * Enhanced tracking for conversion funnel analysis and user journey optimization
 */

// Microsoft Clarity tracking code with enhanced configuration
(function (c, l, a, r, i, t, y) {
  // Only load in production
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.port !== ""
  ) {
    c[a] = () => {};
    return;
  }

  c[a] =
    c[a] ||
    function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
  t = l.createElement(r);
  t.async = 1;
  t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);

  // Add error handling and logging for Clarity script loading
  t.onerror = function () {
    console.warn(
      "Clarity tracking unavailable - likely blocked by ad blocker or privacy extension:",
      {
        url: t.src,
        error: "ERR_BLOCKED_BY_CLIENT",
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        note: "This is expected behavior with privacy tools and won't affect site functionality",
      }
    );

    // Set a global flag to indicate Clarity is blocked
    window.clarityBlocked = true;
  };

  t.onload = function () {
    console.log("Clarity tracking initialized successfully:", {
      url: t.src,
      timestamp: new Date().toISOString(),
    });

    // Set a global flag to indicate Clarity is available
    window.clarityBlocked = false;
  };
})(window, document, "clarity", "script", "s7dys3l8mm");

/**
 * Enhanced Clarity Event Tracking System
 * Comprehensive conversion funnel and user journey tracking
 */
class ClarityEventTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userJourney = [];
    this.conversionEvents = new Set();
    this.isInitialized = false;

    this.init();
  }

  /**
   * Initialize Clarity event tracking
   */
  init() {
    if (this.isInitialized) {return;}

    // Wait for Clarity to load
    this.waitForClarity().then(() => {
      this.setupAutoTracking();
      this.trackSessionStart();
      this.isInitialized = true;
      console.log("Enhanced Clarity tracking initialized");
    });
  }

  /**
   * Wait for Clarity to be available
   */
  waitForClarity() {
    return new Promise((resolve) => {
      if (typeof window.clarity === "function") {
        resolve();
        return;
      }

      const checkClarity = setInterval(() => {
        if (typeof window.clarity === "function") {
          clearInterval(checkClarity);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkClarity);
        console.warn("Clarity not available within timeout");
        resolve();
      }, 10000);
    });
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Track session start
   */
  trackSessionStart() {
    this.trackEvent("session_start", {
      session_id: this.sessionId,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      landing_page: window.location.href,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Enhanced event tracking with conversion funnel context
   */
  trackEvent(eventName, properties = {}) {
    // Check if Clarity is blocked or unavailable
    if (
      typeof window.clarity !== "function" ||
      window.clarityBlocked === true
    ) {
      console.log(
        `Clarity tracking skipped for ${eventName} (Clarity unavailable)`
      );
      return;
    }

    // Add session context to all events
    const enhancedProperties = {
      ...properties,
      session_id: this.sessionId,
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // Track in Clarity
    window.clarity("event", eventName, enhancedProperties);

    // Track user journey for funnel analysis
    this.userJourney.push({
      event: eventName,
      properties: enhancedProperties,
      timestamp: Date.now(),
    });

    console.log(`Clarity Event: ${eventName}`, enhancedProperties);
  }

  /**
   * Track conversion funnel milestones
   */
  trackConversionMilestone(milestone, details = {}) {
    const eventName = `conversion_${milestone}`;
    this.conversionEvents.add(milestone);

    this.trackEvent(eventName, {
      milestone,
      funnel_step: this.getFunnelStep(milestone),
      ...details,
    });
  }

  /**
   * Get funnel step number for milestone
   */
  getFunnelStep(milestone) {
    const funnelSteps = {
      // Awareness
      homepage_visit: 1,
      hero_interaction: 1,

      // Interest
      project_view: 2,
      case_study_start: 2,
      content_engagement: 2,

      // Consideration
      case_study_complete: 3,
      contact_page_visit: 3,
      resume_download: 3,

      // Action
      contact_form_start: 4,
      contact_form_submit: 4,
      external_link_click: 4,

      // Retention
      return_visit: 5,
      newsletter_signup: 5,
    };

    return funnelSteps[milestone] || 0;
  }

  /**
   * Track user intent signals
   */
  trackIntentSignal(signal, strength = "medium") {
    this.trackEvent("user_intent", {
      signal,
      strength, // low, medium, high
      intent_type: this.categorizeIntent(signal),
    });
  }

  /**
   * Categorize intent signals
   */
  categorizeIntent(signal) {
    const intentCategories = {
      // High intent signals
      resume_download: "job_inquiry",
      contact_form_submit: "direct_contact",
      linkedin_click: "professional_networking",
      portfolio_view: "career_interest",

      // Medium intent signals
      case_study_complete: "project_interest",
      long_session: "content_engagement",
      multiple_project_views: "comprehensive_research",

      // Low intent signals
      homepage_visit: "initial_awareness",
      social_share: "content_appreciation",
      scroll_depth: "content_engagement",
    };

    return intentCategories[signal] || "general_engagement";
  }

  /**
   * Track content engagement
   */
  trackContentEngagement(contentType, contentId, action, details = {}) {
    this.trackEvent("content_engagement", {
      content_type: contentType,
      content_id: contentId,
      action, // view, read, share, save, etc.
      engagement_duration: details.duration || 0,
      scroll_depth: details.scrollDepth || 0,
      ...details,
    });
  }

  /**
   * Track micro-conversions
   */
  trackMicroConversion(conversionType, value = 1) {
    this.trackEvent("micro_conversion", {
      conversion_type: conversionType,
      value,
      conversion_category: this.getConversionCategory(conversionType),
    });
  }

  /**
   * Get conversion category
   */
  getConversionCategory(conversionType) {
    const categories = {
      // Content engagement
      case_study_view: "content",
      project_click: "content",
      scroll_depth_75: "content",

      // Lead generation
      contact_page_visit: "lead",
      email_click: "lead",
      linkedin_click: "lead",

      // Business impact
      resume_download: "business",
      contact_form_submit: "business",
      return_visit: "business",
    };

    return categories[conversionType] || "engagement";
  }

  /**
   * Setup automatic tracking for common interactions
   */
  setupAutoTracking() {
    this.trackScrollDepth();
    this.trackTimeOnPage();
    this.trackOutboundLinks();
    this.trackProjectInteractions();
    this.trackContactInteractions();
    this.trackContentMilestones();
  }

  /**
   * Track scroll depth milestones
   */
  trackScrollDepth() {
    let maxScrollDepth = 0;
    const milestones = [25, 50, 75, 90, 100];

    window.addEventListener("scroll", () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;

        milestones.forEach((milestone) => {
          if (
            scrollPercent >= milestone &&
            !this.conversionEvents.has(`scroll_${milestone}`)
          ) {
            this.conversionEvents.add(`scroll_${milestone}`);
            this.trackMicroConversion(`scroll_depth_${milestone}`, milestone);
          }
        });
      }
    });
  }

  /**
   * Track time on page milestones
   */
  trackTimeOnPage() {
    const milestones = [30, 60, 120, 300]; // seconds

    milestones.forEach((seconds) => {
      setTimeout(() => {
        if (!this.conversionEvents.has(`time_${seconds}s`)) {
          this.conversionEvents.add(`time_${seconds}s`);
          this.trackEvent("time_on_page", {
            duration_seconds: seconds,
            duration_minutes: Math.round((seconds / 60) * 10) / 10,
            milestone: `${seconds}s`,
          });
        }
      }, seconds * 1000);
    });
  }

  /**
   * Track outbound link clicks
   */
  trackOutboundLinks() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link && link.href) {
        const url = new URL(link.href, window.location.origin);

        // Check if it's an external link
        if (url.origin !== window.location.origin) {
          this.trackEvent("outbound_link_click", {
            destination_url: link.href,
            link_text: link.textContent?.trim() || "",
            link_type: this.getLinkType(link.href),
          });
        }
      }
    });
  }

  /**
   * Get link type for categorization
   */
  getLinkType(url) {
    if (url.includes("linkedin.com")) {return "professional";}
    if (url.includes("github.com")) {return "technical";}
    if (url.includes("mailto:")) {return "contact";}
    if (url.includes("twitter.com") || url.includes("x.com")) {return "social";}
    return "external";
  }

  /**
   * Track project card interactions
   */
  trackProjectInteractions() {
    document.addEventListener("click", (e) => {
      const projectCard = e.target.closest(".card-link, .project-snippet");
      if (projectCard) {
        const link = projectCard.querySelector("a");
        const projectName =
          projectCard.querySelector("h3, h2")?.textContent?.trim() ||
          "Unknown Project";

        if (link) {
          this.trackConversionMilestone("project_view", {
            project_name: projectName,
            project_url: link.href,
            project_type: this.getProjectType(link.href),
          });
        }
      }
    });
  }

  /**
   * Get project type from URL
   */
  getProjectType(url) {
    if (url.includes("autodesk")) {return "enterprise";}
    if (url.includes("intel")) {return "technology";}
    if (url.includes("daimler")) {return "automotive";}
    return "portfolio";
  }

  /**
   * Track contact page interactions
   */
  trackContactInteractions() {
    // Track contact page visits
    if (window.location.pathname.includes("contact")) {
      this.trackConversionMilestone("contact_page_visit");
    }

    // Track contact link clicks
    document.addEventListener("click", (e) => {
      const contactLink = e.target.closest(
        "a[href*='mailto:'], a[href*='linkedin'], a[href*='github']"
      );
      if (contactLink) {
        const href = contactLink.getAttribute("href");
        const linkType = this.getLinkType(href);

        this.trackEvent("contact_interaction", {
          contact_type: linkType,
          contact_url: href,
          link_text: contactLink.textContent?.trim() || "",
        });
      }
    });
  }

  /**
   * Track content milestones for case studies
   */
  trackContentMilestones() {
    // Track case study section views
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target;
            const sectionId = section.id;
            const sectionName =
              section.querySelector("h2, h3")?.textContent?.trim() || sectionId;

            if (
              sectionId &&
              !this.conversionEvents.has(`section_${sectionId}`)
            ) {
              this.conversionEvents.add(`section_${sectionId}`);
              this.trackContentEngagement(
                "case_study_section",
                sectionId,
                "view",
                {
                  section_name: sectionName,
                }
              );
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all sections
    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });
  }

  /**
   * Get user journey summary
   */
  getUserJourneySummary() {
    return {
      session_id: this.sessionId,
      total_events: this.userJourney.length,
      conversion_events: Array.from(this.conversionEvents),
      journey_duration:
        this.userJourney.length > 0
          ? this.userJourney[this.userJourney.length - 1].timestamp -
            this.userJourney[0].timestamp
          : 0,
      funnel_progress: Math.max(
        ...Array.from(this.conversionEvents).map(
          (event) =>
            this.getFunnelStep(event.split("_").slice(1).join("_")) || 0
        )
      ),
      events: this.userJourney.slice(-20), // Last 20 events
    };
  }

  /**
   * Export journey data for analysis
   */
  exportJourneyData() {
    return {
      summary: this.getUserJourneySummary(),
      full_journey: this.userJourney,
      conversion_funnel: this.analyzeConversionFunnel(),
    };
  }

  /**
   * Analyze conversion funnel performance
   */
  analyzeConversionFunnel() {
    const funnel = {
      awareness:
        this.conversionEvents.has("homepage_visit") ||
        this.conversionEvents.has("hero_interaction"),
      interest: Array.from(this.conversionEvents).some(
        (event) =>
          event.includes("project_view") ||
          event.includes("case_study") ||
          event.includes("content_engagement")
      ),
      consideration: Array.from(this.conversionEvents).some(
        (event) =>
          event.includes("contact_page") ||
          event.includes("resume_download") ||
          event.includes("case_study_complete")
      ),
      action: Array.from(this.conversionEvents).some(
        (event) =>
          event.includes("contact_form_submit") ||
          event.includes("external_link_click")
      ),
      retention:
        this.conversionEvents.has("return_visit") ||
        this.conversionEvents.has("newsletter_signup"),
    };

    return {
      funnel,
      completion_rate:
        Object.values(funnel).filter(Boolean).length /
        Object.keys(funnel).length,
      bottleneck: this.identifyBottleneck(funnel),
    };
  }

  /**
   * Identify funnel bottleneck
   */
  identifyBottleneck(funnel) {
    const stages = Object.entries(funnel);
    for (let i = 0; i < stages.length - 1; i++) {
      if (stages[i][1] && !stages[i + 1][1]) {
        return stages[i + 1][0];
      }
    }
    return null;
  }
}

// Create and export singleton instance
const clarityTracker = new ClarityEventTracker();

// Export for use in other scripts
if (typeof window !== "undefined") {
  window.clarityTracking = {
    trackEvent: (eventName, properties) =>
      clarityTracker.trackEvent(eventName, properties),
    trackConversionMilestone: (milestone, details) =>
      clarityTracker.trackConversionMilestone(milestone, details),
    trackIntentSignal: (signal, strength) =>
      clarityTracker.trackIntentSignal(signal, strength),
    trackContentEngagement: (type, id, action, details) =>
      clarityTracker.trackContentEngagement(type, id, action, details),
    trackMicroConversion: (type, value) =>
      clarityTracker.trackMicroConversion(type, value),
    getUserJourneySummary: () => clarityTracker.getUserJourneySummary(),
    exportJourneyData: () => clarityTracker.exportJourneyData(),
  };
}

export default clarityTracker;
