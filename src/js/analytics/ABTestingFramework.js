/**
 * A/B Testing Framework - Data-driven conversion optimization through experimentation
 * Runs controlled experiments to validate conversion optimization recommendations
 */

export class ABTestingFramework {
  constructor(analyticsManager, conversionTracker) {
    this.analyticsManager = analyticsManager;
    this.conversionTracker = conversionTracker;

    this.activeExperiments = new Map();
    this.experimentResults = new Map();
    this.userAssignments = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize A/B testing framework
   */
  initialize() {
    if (this.isInitialized) return;

    this.setupExperimentEngine();
    this.setupUserAssignment();
    this.setupResultTracking();
    this.loadExistingExperiments();
    this.isInitialized = true;

    console.log("A/B testing framework initialized");
  }

  /**
   * Setup experiment engine
   */
  setupExperimentEngine() {
    this.experimentTemplates = {
      // CTA Optimization
      cta_text: {
        type: "text_variation",
        element: "button, a",
        variations: [
          { id: "control", text: "Original Text" },
          { id: "variant1", text: "Improved Text 1" },
          { id: "variant2", text: "Improved Text 2" },
        ],
        metrics: ["click_rate", "conversion_rate"],
        sampleSize: 1000,
      },

      // Hero Section
      hero_headline: {
        type: "content_variation",
        element: ".hero h1",
        variations: [
          { id: "control", content: "Original Headline" },
          { id: "variant1", content: "Improved Headline 1" },
          { id: "variant2", content: "Improved Headline 2" },
        ],
        metrics: ["engagement_rate", "time_on_page", "conversion_rate"],
        sampleSize: 1500,
      },

      // Layout Changes
      layout_positioning: {
        type: "layout_variation",
        element: ".featured-projects",
        variations: [
          { id: "control", className: "original-layout" },
          { id: "variant1", className: "improved-layout-1" },
          { id: "variant2", className: "improved-layout-2" },
        ],
        metrics: ["scroll_depth", "engagement_rate", "conversion_rate"],
        sampleSize: 1200,
      },

      // Color Scheme
      color_scheme: {
        type: "styling_variation",
        element: "body",
        variations: [
          { id: "control", className: "original-colors" },
          { id: "variant1", className: "warm-colors" },
          { id: "variant2", className: "cool-colors" },
        ],
        metrics: ["engagement_rate", "conversion_rate", "bounce_rate"],
        sampleSize: 800,
      },

      // Content Length
      content_length: {
        type: "content_variation",
        element: ".project-description",
        variations: [
          { id: "control", content: "Original length" },
          { id: "variant1", content: "Shorter version" },
          { id: "variant2", content: "Longer version" },
        ],
        metrics: ["read_completion", "engagement_rate", "conversion_rate"],
        sampleSize: 1000,
      },
    };
  }

  /**
   * Setup user assignment system
   */
  setupUserAssignment() {
    this.assignmentStrategy = "random"; // random, consistent, weighted
    this.trafficAllocation = {
      control: 0.5, // 50% control
      variant1: 0.25, // 25% variant 1
      variant2: 0.25, // 25% variant 2
    };
  }

  /**
   * Setup result tracking
   */
  setupResultTracking() {
    this.resultMetrics = {
      click_rate: {
        name: "Click Rate",
        calculation: (experiment) => {
          const controlClicks = experiment.results.control?.clicks || 0;
          const controlViews = experiment.results.control?.views || 1;
          const variantClicks = experiment.results.variant1?.clicks || 0;
          const variantViews = experiment.results.variant1?.views || 1;

          return {
            control: (controlClicks / controlViews) * 100,
            variant1: (variantClicks / variantViews) * 100,
            improvement:
              ((variantClicks / variantViews - controlClicks / controlViews) /
                (controlClicks / controlViews)) *
              100,
          };
        },
      },

      conversion_rate: {
        name: "Conversion Rate",
        calculation: (experiment) => {
          const controlConversions =
            experiment.results.control?.conversions || 0;
          const controlVisitors = experiment.results.control?.visitors || 1;
          const variantConversions =
            experiment.results.variant1?.conversions || 0;
          const variantVisitors = experiment.results.variant1?.visitors || 1;

          return {
            control: (controlConversions / controlVisitors) * 100,
            variant1: (variantConversions / variantVisitors) * 100,
            improvement:
              ((variantConversions / variantVisitors -
                controlConversions / controlVisitors) /
                (controlConversions / controlVisitors)) *
              100,
          };
        },
      },

      engagement_rate: {
        name: "Engagement Rate",
        calculation: (experiment) => {
          const controlEngagement =
            experiment.results.control?.engagementTime || 0;
          const controlVisitors = experiment.results.control?.visitors || 1;
          const variantEngagement =
            experiment.results.variant1?.engagementTime || 0;
          const variantVisitors = experiment.results.variant1?.visitors || 1;

          return {
            control: controlEngagement / controlVisitors,
            variant1: variantEngagement / variantVisitors,
            improvement:
              ((variantEngagement / variantVisitors -
                controlEngagement / controlVisitors) /
                (controlEngagement / controlVisitors)) *
              100,
          };
        },
      },
    };
  }

  /**
   * Create new experiment
   */
  createExperiment(config) {
    const experiment = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: config.name,
      type: config.type,
      element: config.element,
      variations: config.variations,
      metrics: config.metrics,
      sampleSize: config.sampleSize || 1000,
      status: "draft",
      createdAt: new Date().toISOString(),
      results: {
        control: {
          views: 0,
          clicks: 0,
          conversions: 0,
          engagementTime: 0,
          visitors: 0,
        },
        variant1: {
          views: 0,
          clicks: 0,
          conversions: 0,
          engagementTime: 0,
          visitors: 0,
        },
        variant2: {
          views: 0,
          clicks: 0,
          conversions: 0,
          engagementTime: 0,
          visitors: 0,
        },
      },
      significance: null,
      winner: null,
    };

    this.activeExperiments.set(experiment.id, experiment);
    this.saveExperiment(experiment);

    return experiment.id;
  }

  /**
   * Start experiment
   */
  startExperiment(experimentId) {
    const experiment = this.activeExperiments.get(experimentId);
    if (!experiment) return false;

    experiment.status = "running";
    experiment.startedAt = new Date().toISOString();

    // Apply experiment to page
    this.applyExperiment(experiment);

    // Track experiment start
    this.analyticsManager.gtag("event", "experiment_started", {
      event_category: "A/B Testing",
      event_label: experiment.name,
      experiment_id: experimentId,
      experiment_type: experiment.type,
    });

    this.saveExperiment(experiment);
    return true;
  }

  /**
   * Apply experiment to page
   */
  applyExperiment(experiment) {
    const userVariant = this.getUserVariant(experiment.id);

    if (userVariant === "control") return; // Control gets original content

    const elements = document.querySelectorAll(experiment.element);
    elements.forEach((element) => {
      this.applyVariant(
        element,
        experiment.variations.find((v) => v.id === userVariant)
      );
    });

    // Track that user is in experiment
    this.analyticsManager.gtag("event", "experiment_participant", {
      event_category: "A/B Testing",
      event_label: experiment.name,
      experiment_id: experiment.id,
      variant: userVariant,
    });
  }

  /**
   * Apply variant to element
   */
  applyVariant(element, variant) {
    if (!variant) return;

    switch (variant.type || "text") {
      case "text":
        if (variant.text) element.textContent = variant.text;
        break;

      case "html":
        if (variant.html) element.innerHTML = variant.html;
        break;

      case "class":
        if (variant.className) element.className = variant.className;
        break;

      case "style":
        if (variant.styles) {
          Object.assign(element.style, variant.styles);
        }
        break;
    }
  }

  /**
   * Get user variant assignment
   */
  getUserVariant(experimentId) {
    const userId = this.getUserId();

    // Check if user already assigned
    if (this.userAssignments.has(`${userId}_${experimentId}`)) {
      return this.userAssignments.get(`${userId}_${experimentId}`);
    }

    // Assign new variant
    const variant = this.assignVariant(experimentId);
    this.userAssignments.set(`${userId}_${experimentId}`, variant);

    // Persist assignment
    this.saveUserAssignment(userId, experimentId, variant);

    return variant;
  }

  /**
   * Assign variant to user
   */
  assignVariant(experimentId) {
    const random = Math.random();

    if (random < this.trafficAllocation.control) {
      return "control";
    } else if (
      random <
      this.trafficAllocation.control + this.trafficAllocation.variant1
    ) {
      return "variant1";
    } else {
      return "variant2";
    }
  }

  /**
   * Get or create user ID for experiments
   */
  getUserId() {
    let userId = localStorage.getItem("ab_test_user_id");

    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("ab_test_user_id", userId);
    }

    return userId;
  }

  /**
   * Track experiment event
   */
  trackExperimentEvent(experimentId, eventType, data = {}) {
    const experiment = this.activeExperiments.get(experimentId);
    if (!experiment || experiment.status !== "running") return;

    const userVariant = this.getUserVariant(experimentId);
    const variantKey = userVariant;

    // Update results
    if (!experiment.results[variantKey]) {
      experiment.results[variantKey] = {
        views: 0,
        clicks: 0,
        conversions: 0,
        engagementTime: 0,
        visitors: 0,
      };
    }

    switch (eventType) {
      case "view":
        experiment.results[variantKey].views++;
        break;

      case "click":
        experiment.results[variantKey].clicks++;
        break;

      case "conversion":
        experiment.results[variantKey].conversions++;
        break;

      case "engagement":
        experiment.results[variantKey].engagementTime += data.duration || 0;
        break;

      case "visitor":
        experiment.results[variantKey].visitors++;
        break;
    }

    // Check if experiment should end
    this.checkExperimentCompletion(experiment);

    this.saveExperiment(experiment);
  }

  /**
   * Check if experiment should be completed
   */
  checkExperimentCompletion(experiment) {
    const totalParticipants = Object.values(experiment.results).reduce(
      (sum, variant) => sum + (variant.visitors || 0),
      0
    );

    if (totalParticipants >= experiment.sampleSize) {
      this.completeExperiment(experiment.id);
    }
  }

  /**
   * Complete experiment and determine winner
   */
  completeExperiment(experimentId) {
    const experiment = this.activeExperiments.get(experimentId);
    if (!experiment) return;

    experiment.status = "completed";
    experiment.completedAt = new Date().toISOString();

    // Calculate results for each metric
    const finalResults = {};
    experiment.metrics.forEach((metric) => {
      if (this.resultMetrics[metric]) {
        finalResults[metric] =
          this.resultMetrics[metric].calculation(experiment);
      }
    });

    experiment.finalResults = finalResults;

    // Determine winner for each metric
    experiment.winners = {};
    experiment.metrics.forEach((metric) => {
      if (finalResults[metric]) {
        const improvement = finalResults[metric].improvement;
        if (Math.abs(improvement) > 5) {
          // 5% improvement threshold
          experiment.winners[metric] = improvement > 0 ? "variant1" : "control";
        } else {
          experiment.winners[metric] = "no_clear_winner";
        }
      }
    });

    // Calculate overall winner
    experiment.overallWinner = this.determineOverallWinner(experiment);

    // Track experiment completion
    this.analyticsManager.gtag("event", "experiment_completed", {
      event_category: "A/B Testing",
      event_label: experiment.name,
      experiment_id: experimentId,
      winner: experiment.overallWinner,
      confidence_level: this.calculateConfidence(experiment),
    });

    this.saveExperiment(experiment);
  }

  /**
   * Determine overall winner
   */
  determineOverallWinner(experiment) {
    const winners = Object.values(experiment.winners);
    const variant1Wins = winners.filter((w) => w === "variant1").length;
    const controlWins = winners.filter((w) => w === "control").length;

    if (variant1Wins > controlWins) return "variant1";
    if (controlWins > variant1Wins) return "control";
    return "tie";
  }

  /**
   * Calculate statistical confidence
   */
  calculateConfidence(experiment) {
    // Simplified confidence calculation
    const totalParticipants = Object.values(experiment.results).reduce(
      (sum, variant) => sum + (variant.visitors || 0),
      0
    );

    if (totalParticipants < 100) return "low";
    if (totalParticipants < 500) return "medium";
    return "high";
  }

  /**
   * Get experiment results
   */
  getExperimentResults(experimentId) {
    const experiment = this.activeExperiments.get(experimentId);
    if (!experiment) return null;

    return {
      id: experiment.id,
      name: experiment.name,
      status: experiment.status,
      results: experiment.results,
      finalResults: experiment.finalResults,
      winners: experiment.winners,
      overallWinner: experiment.overallWinner,
      confidence: experiment.confidence,
      createdAt: experiment.createdAt,
      startedAt: experiment.startedAt,
      completedAt: experiment.completedAt,
    };
  }

  /**
   * Get all active experiments
   */
  getActiveExperiments() {
    return Array.from(this.activeExperiments.values()).filter(
      (exp) => exp.status === "running"
    );
  }

  /**
   * Get completed experiments
   */
  getCompletedExperiments() {
    return Array.from(this.activeExperiments.values()).filter(
      (exp) => exp.status === "completed"
    );
  }

  /**
   * Create experiment from recommendation
   */
  createExperimentFromRecommendation(recommendation) {
    const template =
      this.getExperimentTemplateForRecommendation(recommendation);

    if (!template) return null;

    const config = {
      name: `${recommendation.title} - A/B Test`,
      type: template.type,
      element: template.element,
      variations: template.variations,
      metrics: template.metrics,
      sampleSize: template.sampleSize,
      source: "recommendation",
      recommendationId: recommendation.id,
    };

    return this.createExperiment(config);
  }

  /**
   * Get experiment template for recommendation
   */
  getExperimentTemplateForRecommendation(recommendation) {
    const mapping = {
      cta_optimization: "cta_text",
      content_optimization: "content_length",
      layout_optimization: "layout_positioning",
      hero_optimization: "hero_headline",
      color_optimization: "color_scheme",
    };

    const templateKey = mapping[recommendation.type] || "cta_text";
    return this.experimentTemplates[templateKey];
  }

  /**
   * Save experiment to storage
   */
  saveExperiment(experiment) {
    try {
      localStorage.setItem(
        `ab_experiment_${experiment.id}`,
        JSON.stringify(experiment)
      );
    } catch (error) {
      console.warn("Could not save experiment:", error);
    }
  }

  /**
   * Save user assignment
   */
  saveUserAssignment(userId, experimentId, variant) {
    try {
      const assignments = JSON.parse(
        localStorage.getItem("ab_assignments") || "{}"
      );
      assignments[`${userId}_${experimentId}`] = variant;
      localStorage.setItem("ab_assignments", JSON.stringify(assignments));
    } catch (error) {
      console.warn("Could not save user assignment:", error);
    }
  }

  /**
   * Load existing experiments
   */
  loadExistingExperiments() {
    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith("ab_experiment_")
      );

      keys.forEach((key) => {
        const experiment = JSON.parse(localStorage.getItem(key));
        this.activeExperiments.set(experiment.id, experiment);
      });

      // Load user assignments
      const assignments = JSON.parse(
        localStorage.getItem("ab_assignments") || "{}"
      );
      Object.entries(assignments).forEach(([key, variant]) => {
        this.userAssignments.set(key, variant);
      });
    } catch (error) {
      console.warn("Could not load existing experiments:", error);
    }
  }

  /**
   * Export A/B testing data
   */
  exportTestingData() {
    return {
      activeExperiments: Array.from(this.activeExperiments.values()),
      completedExperiments: this.getCompletedExperiments(),
      userAssignments: Object.fromEntries(this.userAssignments),
      summary: {
        totalExperiments: this.activeExperiments.size,
        runningExperiments: this.getActiveExperiments().length,
        completedExperiments: this.getCompletedExperiments().length,
        totalParticipants: Array.from(this.activeExperiments.values()).reduce(
          (sum, exp) =>
            sum +
            Object.values(exp.results).reduce(
              (s, variant) => s + (variant.visitors || 0),
              0
            ),
          0
        ),
      },
    };
  }

  /**
   * Get experiment recommendations
   */
  getExperimentRecommendations() {
    const recommendations = [];

    // Recommend experiments for common optimization areas
    recommendations.push({
      type: "cta_optimization",
      title: "Test Call-to-Action Variations",
      description: "Test different CTA text, colors, and positioning",
      expectedImpact: "Medium",
      effort: "Low",
      template: "cta_text",
    });

    recommendations.push({
      type: "content_optimization",
      title: "Test Content Length Variations",
      description: "Test shorter vs longer content for better engagement",
      expectedImpact: "Medium",
      effort: "Medium",
      template: "content_length",
    });

    recommendations.push({
      type: "layout_optimization",
      title: "Test Layout Variations",
      description: "Test different layouts for improved user flow",
      expectedImpact: "High",
      effort: "High",
      template: "layout_positioning",
    });

    return recommendations;
  }
}
