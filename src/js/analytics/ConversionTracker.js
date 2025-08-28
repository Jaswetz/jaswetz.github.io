/**
 * Conversion Tracker - Advanced GA4 conversion goals and funnel analysis
 * Extends AnalyticsEventTracker with conversion-focused functionality
 */

export class ConversionTracker {
  constructor(analyticsManager) {
    this.analytics = analyticsManager;
  }

  /**
   * Track conversion milestones with GA4 enhanced ecommerce
   * @param {string} milestone - Conversion milestone name
   * @param {Object} details - Additional conversion details
   */
  trackConversionMilestone(milestone, details = {}) {
    // GA4 conversion event
    this.analytics.gtag("event", "conversion_milestone", {
      milestone_name: milestone,
      funnel_step: this.getFunnelStep(milestone),
      conversion_value: details.conversion_value || 1,
      ...details,
      custom_map: {
        milestone_category: this.getMilestoneCategory(milestone),
        user_intent_level: this.getIntentLevel(milestone),
      },
    });

    // Enhanced ecommerce tracking for high-value conversions
    if (details.conversion_value > 5) {
      this.analytics.gtag("event", "purchase", {
        transaction_id: `conv_${Date.now()}`,
        value: details.conversion_value,
        currency: "USD",
        items: [
          {
            item_name: milestone,
            category: this.getMilestoneCategory(milestone),
            quantity: 1,
            price: details.conversion_value,
          },
        ],
      });
    }
  }

  /**
   * Get funnel step number for conversion tracking
   * @param {string} milestone - Milestone name
   * @returns {number} Funnel step number
   */
  getFunnelStep(milestone) {
    const funnelSteps = {
      // Awareness (Step 1)
      homepage_visit: 1,
      hero_interaction: 1,

      // Interest (Step 2)
      project_view: 2,
      case_study_start: 2,
      content_engagement: 2,

      // Consideration (Step 3)
      case_study_complete: 3,
      contact_page_visit: 3,
      resume_download: 3,
      scroll_depth_75: 3,

      // Action (Step 4)
      contact_form_start: 4,
      contact_form_submit: 4,
      external_link_click: 4,

      // Retention (Step 5)
      return_visit: 5,
      newsletter_signup: 5,
    };

    return funnelSteps[milestone] || 0;
  }

  /**
   * Get milestone category for segmentation
   * @param {string} milestone - Milestone name
   * @returns {string} Category
   */
  getMilestoneCategory(milestone) {
    const categories = {
      // Content Engagement
      project_view: "content",
      case_study_start: "content",
      case_study_complete: "content",
      content_engagement: "content",

      // Lead Generation
      contact_page_visit: "lead",
      contact_form_start: "lead",
      contact_form_submit: "lead",

      // Business Impact
      resume_download: "business",
      external_link_click: "business",

      // User Experience
      homepage_visit: "awareness",
      hero_interaction: "awareness",
      scroll_depth_75: "engagement",
      return_visit: "retention",
    };

    return categories[milestone] || "engagement";
  }

  /**
   * Get user intent level for lead scoring
   * @param {string} milestone - Milestone name
   * @returns {string} Intent level
   */
  getIntentLevel(milestone) {
    const intentLevels = {
      // High Intent
      resume_download: "high",
      contact_form_submit: "high",
      linkedin_click: "high",

      // Medium Intent
      case_study_complete: "medium",
      contact_page_visit: "medium",
      multiple_project_views: "medium",

      // Low Intent
      homepage_visit: "low",
      project_view: "low",
      scroll_depth_75: "low",
    };

    return intentLevels[milestone] || "low";
  }

  /**
   * Track user journey funnel progression
   * @param {string} fromStep - Starting funnel step
   * @param {string} toStep - Target funnel step
   * @param {Object} context - Additional context
   */
  trackFunnelProgression(fromStep, toStep, context = {}) {
    this.analytics.gtag("event", "funnel_progression", {
      event_category: "Conversion Funnel",
      event_label: `${fromStep} → ${toStep}`,
      from_step: fromStep,
      to_step: toStep,
      step_difference:
        this.getFunnelStep(toStep) - this.getFunnelStep(fromStep),
      ...context,
    });
  }

  /**
   * Track conversion attribution
   * @param {string} conversionType - Type of conversion
   * @param {Object} attribution - Attribution data
   */
  trackConversionAttribution(conversionType, attribution = {}) {
    this.analytics.gtag("event", "conversion_attribution", {
      event_category: "Attribution",
      event_label: conversionType,
      conversion_type: conversionType,
      source: attribution.source || "direct",
      medium: attribution.medium || "organic",
      campaign: attribution.campaign || "",
      channel_grouping: this.getChannelGrouping(attribution),
      ...attribution,
    });
  }

  /**
   * Get channel grouping for attribution
   * @param {Object} attribution - Attribution data
   * @returns {string} Channel grouping
   */
  getChannelGrouping(attribution) {
    const { source, medium } = attribution;

    if (medium === "organic") return "Organic Search";
    if (medium === "email") return "Email";
    if (medium === "social") return "Social";
    if (medium === "referral") return "Referral";
    if (medium === "cpc" || medium === "paid") return "Paid Search";
    if (source === "direct" || !source) return "Direct";

    return "Other";
  }

  /**
   * Track lead quality indicators
   * @param {string} indicator - Quality indicator
   * @param {Object} details - Lead details
   */
  trackLeadQuality(indicator, details = {}) {
    this.analytics.gtag("event", "lead_quality", {
      event_category: "Lead Quality",
      event_label: indicator,
      quality_indicator: indicator,
      quality_score: this.calculateQualityScore(indicator, details),
      lead_stage: details.stage || "awareness",
      ...details,
    });
  }

  /**
   * Calculate lead quality score
   * @param {string} indicator - Quality indicator
   * @param {Object} details - Lead details
   * @returns {number} Quality score (0-100)
   */
  calculateQualityScore(indicator, details) {
    const baseScores = {
      resume_download: 90,
      contact_form_submit: 85,
      linkedin_click: 80,
      case_study_complete: 70,
      contact_page_visit: 60,
      multiple_project_views: 50,
      project_view: 30,
      homepage_visit: 10,
    };

    let score = baseScores[indicator] || 0;

    // Adjust based on engagement duration
    if (details.duration > 300) score += 10; // 5+ minutes
    else if (details.duration > 120) score += 5; // 2+ minutes

    // Adjust based on scroll depth
    if (details.scrollDepth > 75) score += 10;
    else if (details.scrollDepth > 50) score += 5;

    // Adjust based on return visits
    if (details.returnVisitor) score += 15;

    return Math.min(100, score);
  }

  /**
   * Track conversion funnel drop-off points
   * @param {string} dropOffPoint - Where users dropped off
   * @param {Object} context - Drop-off context
   */
  trackFunnelDropOff(dropOffPoint, context = {}) {
    this.analytics.gtag("event", "funnel_dropoff", {
      event_category: "Funnel Analysis",
      event_label: dropOffPoint,
      dropoff_point: dropOffPoint,
      funnel_step: this.getFunnelStep(dropOffPoint),
      time_spent: context.timeSpent || 0,
      scroll_depth: context.scrollDepth || 0,
      ...context,
    });
  }

  /**
   * Track conversion goal achievement
   * @param {string} goalName - Name of the achieved goal
   * @param {Object} goalData - Goal achievement data
   */
  trackGoalAchievement(goalName, goalData = {}) {
    this.analytics.gtag("event", "goal_achievement", {
      event_category: "Goals",
      event_label: goalName,
      goal_name: goalName,
      goal_value: goalData.value || 1,
      goal_category: this.getGoalCategory(goalName),
      primary_goal: goalData.primary || false,
      ...goalData,
    });
  }

  /**
   * Get goal category for organization
   * @param {string} goalName - Goal name
   * @returns {string} Category
   */
  getGoalCategory(goalName) {
    const categories = {
      // Primary Business Goals
      resume_download: "primary_business",
      contact_form_submit: "primary_business",
      linkedin_click: "primary_business",

      // Secondary Goals
      case_study_complete: "secondary",
      contact_page_visit: "secondary",
      project_view: "secondary",

      // Micro Goals
      scroll_depth_75: "micro",
      time_on_page_60s: "micro",
      homepage_visit: "micro",
    };

    return categories[goalName] || "engagement";
  }

  /**
   * Setup conversion funnel tracking
   */
  setupConversionFunnelTracking() {
    // Track homepage visits as funnel start
    if (
      window.location.pathname === "/" ||
      window.location.pathname === "/index.html"
    ) {
      this.trackConversionMilestone("homepage_visit");
    }

    // Track hero section interactions
    const heroSection = document.querySelector("#hero, .hero-section");
    if (heroSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              this.trackConversionMilestone("hero_interaction");
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(heroSection);
    }

    // Track contact page visits
    if (window.location.pathname.includes("contact")) {
      this.trackConversionMilestone("contact_page_visit");
    }
  }
}
