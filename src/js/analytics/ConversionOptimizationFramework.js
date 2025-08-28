/**
 * Conversion Optimization Framework - Intelligent recommendations engine
 * Analyzes all analytics data to generate actionable conversion optimization strategies
 */

export class ConversionOptimizationFramework {
  constructor(
    analyticsManager,
    conversionTracker,
    userJourneyAnalyzer,
    userSegmentation,
    performanceMonitor
  ) {
    this.analyticsManager = analyticsManager;
    this.conversionTracker = conversionTracker;
    this.userJourneyAnalyzer = userJourneyAnalyzer;
    this.userSegmentation = userSegmentation;
    this.performanceMonitor = performanceMonitor;

    this.recommendations = [];
    this.insights = [];
    this.priorities = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize the optimization framework
   */
  async initialize() {
    if (this.isInitialized) return;

    this.setupRecommendationEngine();
    this.setupAutomatedAnalysis();
    this.setupInsightGeneration();
    this.isInitialized = true;

    console.log("Conversion optimization framework initialized");

    // Generate initial recommendations
    await this.generateInitialRecommendations();
  }

  /**
   * Setup recommendation engine
   */
  setupRecommendationEngine() {
    this.recommendationRules = {
      // Performance-based recommendations
      performance: {
        lcp_high: {
          condition: (data) => data.performance?.lcp > 4000,
          recommendation: {
            type: "performance_optimization",
            priority: "critical",
            category: "technical",
            title: "Optimize Largest Contentful Paint (LCP)",
            description: "LCP is critically slow and hurting conversions",
            impact: "High",
            effort: "Medium",
            timeframe: "1-2 weeks",
            actions: [
              "Optimize hero image loading and sizing",
              "Implement critical CSS and font loading optimization",
              "Use CDN for static assets",
              "Minimize render-blocking resources",
            ],
            expectedImprovement: "15-25% faster page load",
            metrics: ["page_load_time", "bounce_rate", "conversion_rate"],
          },
        },

        cls_high: {
          condition: (data) => data.performance?.cls > 0.25,
          recommendation: {
            type: "layout_stability",
            priority: "high",
            category: "technical",
            title: "Fix Cumulative Layout Shift (CLS)",
            description: "Layout shifts are causing poor user experience",
            impact: "High",
            effort: "Low",
            timeframe: "3-5 days",
            actions: [
              "Reserve space for dynamic content (images, ads)",
              "Use CSS aspect-ratio for media elements",
              "Preload critical fonts",
              "Avoid inserting content above existing content",
            ],
            expectedImprovement: "20-30% reduction in layout shifts",
            metrics: ["cls_score", "user_engagement", "conversion_rate"],
          },
        },
      },

      // User journey recommendations
      journey: {
        high_dropoff: {
          condition: (data) =>
            data.journey?.dropOffPoints?.some((point) => point.rate > 0.7),
          recommendation: {
            type: "user_experience",
            priority: "critical",
            category: "ux",
            title: "Address Critical User Journey Drop-off",
            description: "Users are abandoning the journey at a critical point",
            impact: "Critical",
            effort: "Medium",
            timeframe: "1-2 weeks",
            actions: [
              "Analyze drop-off point with heatmaps and session recordings",
              "Conduct user testing on the problematic section",
              "Simplify the user flow",
              "Add progress indicators and trust signals",
            ],
            expectedImprovement: "25-40% reduction in drop-off rate",
            metrics: ["dropoff_rate", "conversion_rate", "user_satisfaction"],
          },
        },

        inefficient_path: {
          condition: (data) =>
            data.journey?.conversionJourney?.pathEfficiency < 50,
          recommendation: {
            type: "journey_optimization",
            priority: "high",
            category: "ux",
            title: "Optimize User Journey Efficiency",
            description: "Users are taking inefficient paths to conversion",
            impact: "High",
            effort: "Medium",
            timeframe: "1-3 weeks",
            actions: [
              "Map ideal user journey based on heatmaps",
              "Remove unnecessary steps and distractions",
              "Add clear calls-to-action and navigation cues",
              "Implement progressive disclosure for complex content",
            ],
            expectedImprovement: "30-50% improvement in journey efficiency",
            metrics: ["path_efficiency", "time_to_convert", "conversion_rate"],
          },
        },
      },

      // Segmentation recommendations
      segmentation: {
        high_value_untargeted: {
          condition: (data) => {
            const highValueUsers =
              data.segmentation?.userProfiles?.filter((profile) =>
                (profile.segments || []).includes("high_value_leads")
              ) || [];
            return (
              highValueUsers.length > 10 && !data.segmentation?.targetingActive
            );
          },
          recommendation: {
            type: "personalization",
            priority: "high",
            category: "marketing",
            title: "Implement High-Value User Targeting",
            description: "High-value users are not being targeted effectively",
            impact: "High",
            effort: "Medium",
            timeframe: "1-2 weeks",
            actions: [
              "Create personalized content for high-value segments",
              "Implement dynamic messaging based on user behavior",
              "Set up priority support channels",
              "Develop segment-specific email campaigns",
            ],
            expectedImprovement: "20-35% increase in high-value conversions",
            metrics: [
              "segment_conversion_rate",
              "customer_lifetime_value",
              "engagement_rate",
            ],
          },
        },

        low_engagement_segment: {
          condition: (data) =>
            data.segmentation?.segmentDistribution?.bounce_visitors > 50,
          recommendation: {
            type: "engagement_optimization",
            priority: "medium",
            category: "content",
            title: "Re-engage Low-Engagement Users",
            description:
              "Large segment of users are bouncing without engagement",
            impact: "Medium",
            effort: "Low",
            timeframe: "1 week",
            actions: [
              "Improve above-the-fold content and value proposition",
              "Add compelling calls-to-action",
              "Optimize page load speed for immediate engagement",
              "Test different content layouts and messaging",
            ],
            expectedImprovement: "15-25% reduction in bounce rate",
            metrics: ["bounce_rate", "engagement_rate", "time_on_page"],
          },
        },
      },

      // Content recommendations
      content: {
        low_case_study_engagement: {
          condition: (data) => {
            const caseStudyViews =
              data.journey?.heatmapData?.clicks?.filter(
                (click) =>
                  click.element?.includes("case-study") ||
                  click.element?.includes("project")
              ) || [];
            return caseStudyViews.length < 5;
          },
          recommendation: {
            type: "content_optimization",
            priority: "high",
            category: "content",
            title: "Improve Case Study Engagement",
            description:
              "Case studies are not capturing user interest effectively",
            impact: "High",
            effort: "Medium",
            timeframe: "2-3 weeks",
            actions: [
              "Enhance case study thumbnails and descriptions",
              "Add compelling preview content and social proof",
              "Improve case study discoverability and navigation",
              "Create teaser content for better engagement",
            ],
            expectedImprovement: "40-60% increase in case study engagement",
            metrics: [
              "case_study_views",
              "time_on_case_studies",
              "conversion_rate",
            ],
          },
        },

        contact_cta_ineffective: {
          condition: (data) => {
            const contactClicks =
              data.journey?.heatmapData?.clicks?.filter(
                (click) =>
                  click.element?.includes("contact") ||
                  click.element?.includes("mailto")
              ) || [];
            return contactClicks.length < 3;
          },
          recommendation: {
            type: "cta_optimization",
            priority: "high",
            category: "conversion",
            title: "Optimize Contact Call-to-Actions",
            description: "Contact CTAs are not generating sufficient leads",
            impact: "High",
            effort: "Low",
            timeframe: "3-5 days",
            actions: [
              "Make contact information more prominent",
              "Add multiple contact methods and channels",
              "Create compelling contact incentives",
              "Test different CTA placements and messaging",
            ],
            expectedImprovement: "25-40% increase in contact interactions",
            metrics: [
              "contact_interactions",
              "lead_generation",
              "conversion_rate",
            ],
          },
        },
      },
    };

    this.priorityWeights = {
      critical: 10,
      high: 7,
      medium: 4,
      low: 1,
    };
  }

  /**
   * Setup automated analysis
   */
  setupAutomatedAnalysis() {
    // Analyze data every 30 minutes
    setInterval(() => {
      this.performAutomatedAnalysis();
    }, 30 * 60 * 1000);

    // Analyze on conversion events
    document.addEventListener("conversion_milestone", () => {
      setTimeout(() => this.performAutomatedAnalysis(), 5000);
    });

    // Analyze on significant user interactions
    document.addEventListener("user_segment_updated", () => {
      setTimeout(() => this.performAutomatedAnalysis(), 2000);
    });
  }

  /**
   * Setup insight generation
   */
  setupInsightGeneration() {
    this.insightGenerators = {
      performanceInsights: () => this.generatePerformanceInsights(),
      journeyInsights: () => this.generateJourneyInsights(),
      segmentationInsights: () => this.generateSegmentationInsights(),
      contentInsights: () => this.generateContentInsights(),
      conversionInsights: () => this.generateConversionInsights(),
    };
  }

  /**
   * Generate initial recommendations
   */
  async generateInitialRecommendations() {
    console.log(
      "Generating initial conversion optimization recommendations..."
    );

    const data = await this.collectAllAnalyticsData();
    const recommendations = this.analyzeDataAndGenerateRecommendations(data);

    this.recommendations = recommendations;
    this.prioritizeRecommendations();

    console.log(`Generated ${recommendations.length} initial recommendations`);
  }

  /**
   * Collect all analytics data
   */
  async collectAllAnalyticsData() {
    const data = {
      performance: null,
      journey: null,
      segmentation: null,
      conversion: null,
      timestamp: new Date().toISOString(),
    };

    try {
      // Collect performance data
      if (this.performanceMonitor) {
        data.performance = this.performanceMonitor.exportPerformanceData();
      }

      // Collect journey data
      if (this.userJourneyAnalyzer) {
        data.journey = this.userJourneyAnalyzer.exportAnalysisData();
      }

      // Collect segmentation data
      if (this.userSegmentation) {
        data.segmentation = this.userSegmentation.exportSegmentationData();
      }

      // Collect conversion data
      if (this.conversionTracker) {
        data.conversion = {
          milestones: [], // Would be populated from actual tracking
          attribution: {},
          goals: {},
        };
      }
    } catch (error) {
      console.warn("Error collecting analytics data:", error);
    }

    return data;
  }

  /**
   * Analyze data and generate recommendations
   */
  analyzeDataAndGenerateRecommendations(data) {
    const recommendations = [];

    // Apply each recommendation rule
    Object.entries(this.recommendationRules).forEach(([category, rules]) => {
      Object.entries(rules).forEach(([ruleId, rule]) => {
        if (rule.condition(data)) {
          const recommendation = {
            ...rule.recommendation,
            id: `${category}_${ruleId}_${Date.now()}`,
            category,
            ruleId,
            generatedAt: new Date().toISOString(),
            data: this.extractRelevantData(data, rule),
            confidence: this.calculateRecommendationConfidence(data, rule),
          };

          recommendations.push(recommendation);
        }
      });
    });

    return recommendations;
  }

  /**
   * Extract relevant data for recommendation
   */
  extractRelevantData(data, rule) {
    // Extract data points relevant to the recommendation
    const relevantData = {};

    if (rule.recommendation.metrics) {
      rule.recommendation.metrics.forEach((metric) => {
        relevantData[metric] = this.getMetricValue(data, metric);
      });
    }

    return relevantData;
  }

  /**
   * Get metric value from data
   */
  getMetricValue(data, metric) {
    const metricMappings = {
      page_load_time: data.performance?.performanceData?.find(
        (d) => d.type === "core_web_vitals"
      )?.data?.lcp,
      bounce_rate: data.journey?.analysis?.sessionInsights?.[0]?.bounceRate,
      conversion_rate: data.segmentation?.insights?.conversionBySegment,
      cls_score: data.performance?.performanceData?.find(
        (d) => d.type === "core_web_vitals"
      )?.data?.cls,
      user_engagement: data.journey?.analysis?.flowPatterns,
      dropoff_rate: data.journey?.analysis?.journeyPatterns,
      case_study_views: data.journey?.heatmapData?.clicks?.filter((c) =>
        c.element?.includes("case-study")
      ),
      contact_interactions: data.journey?.heatmapData?.clicks?.filter((c) =>
        c.element?.includes("contact")
      ),
      time_to_convert: data.journey?.conversionJourney?.timeToConvert,
      path_efficiency: data.journey?.conversionJourney?.pathEfficiency,
      segment_conversion_rate: data.segmentation?.insights?.conversionBySegment,
      customer_lifetime_value: data.segmentation?.insights?.segmentPerformance,
      engagement_rate: data.journey?.analysis?.sessionMetrics,
      time_on_page: data.journey?.analysis?.sessionMetrics?.timeOnPage,
      user_satisfaction: data.journey?.frustrationSignals,
    };

    return metricMappings[metric] || null;
  }

  /**
   * Calculate recommendation confidence
   */
  calculateRecommendationConfidence(data, rule) {
    // Calculate confidence based on data quality and recency
    let confidence = 0.5; // Base confidence

    // Increase confidence with more data points
    if (data.performance) confidence += 0.1;
    if (data.journey) confidence += 0.1;
    if (data.segmentation) confidence += 0.1;

    // Increase confidence for recent data
    const dataAge = Date.now() - new Date(data.timestamp).getTime();
    const hoursOld = dataAge / (1000 * 60 * 60);

    if (hoursOld < 1) confidence += 0.2;
    else if (hoursOld < 24) confidence += 0.1;

    // Adjust based on rule priority
    const priorityMultiplier = {
      critical: 1.2,
      high: 1.1,
      medium: 1.0,
      low: 0.9,
    };

    confidence *= priorityMultiplier[rule.recommendation.priority] || 1.0;

    return Math.min(1.0, Math.max(0.1, confidence));
  }

  /**
   * Prioritize recommendations
   */
  prioritizeRecommendations() {
    this.recommendations.sort((a, b) => {
      // Primary sort by priority weight
      const priorityDiff =
        (this.priorityWeights.get(b.priority) || 0) -
        (this.priorityWeights.get(a.priority) || 0);

      if (priorityDiff !== 0) return priorityDiff;

      // Secondary sort by confidence
      return b.confidence - a.confidence;
    });
  }

  /**
   * Perform automated analysis
   */
  async performAutomatedAnalysis() {
    try {
      const data = await this.collectAllAnalyticsData();
      const newRecommendations =
        this.analyzeDataAndGenerateRecommendations(data);

      // Merge with existing recommendations
      this.mergeRecommendations(newRecommendations);

      // Generate insights
      const insights = await this.generateInsights(data);
      this.insights = insights;

      // Track analysis in GA4
      this.analyticsManager.gtag("event", "conversion_analysis_complete", {
        event_category: "Optimization",
        event_label: "Automated Analysis",
        recommendation_count: this.recommendations.length,
        insight_count: insights.length,
        top_priority: this.recommendations[0]?.priority || "none",
      });
    } catch (error) {
      console.warn("Automated analysis failed:", error);
    }
  }

  /**
   * Merge new recommendations with existing ones
   */
  mergeRecommendations(newRecommendations) {
    const existingIds = new Set(this.recommendations.map((r) => r.id));

    newRecommendations.forEach((rec) => {
      if (!existingIds.has(rec.id)) {
        this.recommendations.push(rec);
      }
    });

    this.prioritizeRecommendations();
  }

  /**
   * Generate insights from data
   */
  async generateInsights(data) {
    const insights = [];

    // Generate insights from each category
    Object.values(this.insightGenerators).forEach((generator) => {
      try {
        const categoryInsights = generator(data);
        if (Array.isArray(categoryInsights)) {
          insights.push(...categoryInsights);
        }
      } catch (error) {
        console.warn("Insight generation failed:", error);
      }
    });

    return insights;
  }

  /**
   * Generate performance insights
   */
  generatePerformanceInsights(data) {
    const insights = [];

    if (data.performance?.performanceData) {
      const recentVitals = data.performance.performanceData
        .filter((d) => d.type === "core_web_vitals")
        .slice(-5);

      if (recentVitals.length > 0) {
        const avgLcp =
          recentVitals.reduce((sum, d) => sum + d.data.lcp, 0) /
          recentVitals.length;

        if (avgLcp > 3000) {
          insights.push({
            type: "performance_trend",
            severity: "high",
            title: "Degrading Page Load Performance",
            description: `Average LCP has increased to ${Math.round(avgLcp)}ms`,
            recommendation: "Implement performance optimizations immediately",
            metrics: { avgLcp },
          });
        }
      }
    }

    return insights;
  }

  /**
   * Generate journey insights
   */
  generateJourneyInsights(data) {
    const insights = [];

    if (data.journey?.analysis?.journeyPatterns) {
      const patterns = Object.entries(data.journey.analysis.journeyPatterns);

      if (patterns.length > 0) {
        const [topPath, topData] = patterns[0];

        insights.push({
          type: "journey_pattern",
          severity: "info",
          title: "Primary User Journey Identified",
          description: `Most users follow: ${topPath} (${topData.count} visits)`,
          recommendation: "Optimize this primary path for better conversions",
          metrics: { topPath, visitCount: topData.count },
        });
      }
    }

    return insights;
  }

  /**
   * Generate segmentation insights
   */
  generateSegmentationInsights(data) {
    const insights = [];

    if (data.segmentation?.insights?.topPerformingSegments) {
      const topSegment = data.segmentation.insights.topPerformingSegments[0];

      if (topSegment) {
        insights.push({
          type: "segment_performance",
          severity: "info",
          title: "High-Performing User Segment",
          description: `${topSegment.name} shows ${
            topSegment.avgConversionProbability * 100
          }% conversion probability`,
          recommendation: "Focus marketing efforts on this segment",
          metrics: topSegment,
        });
      }
    }

    return insights;
  }

  /**
   * Generate content insights
   */
  generateContentInsights(data) {
    const insights = [];

    if (data.journey?.heatmapData?.clicks) {
      const clicks = data.journey.heatmapData.clicks;
      const caseStudyClicks = clicks.filter((c) =>
        c.element?.includes("case-study")
      );

      if (caseStudyClicks.length < clicks.length * 0.1) {
        insights.push({
          type: "content_engagement",
          severity: "medium",
          title: "Low Case Study Engagement",
          description: "Case studies are not getting sufficient attention",
          recommendation: "Improve case study visibility and appeal",
          metrics: {
            caseStudyClicks: caseStudyClicks.length,
            totalClicks: clicks.length,
          },
        });
      }
    }

    return insights;
  }

  /**
   * Generate conversion insights
   */
  generateConversionInsights(data) {
    const insights = [];

    // Analyze conversion funnel
    if (data.journey?.conversionJourney) {
      const journey = data.journey.conversionJourney;

      if (journey.timeToConvert > 300000) {
        // 5 minutes
        insights.push({
          type: "conversion_efficiency",
          severity: "medium",
          title: "Long Time to Convert",
          description: `Average time to convert is ${Math.round(
            journey.timeToConvert / 1000
          )} seconds`,
          recommendation: "Streamline the conversion process",
          metrics: { timeToConvert: journey.timeToConvert },
        });
      }
    }

    return insights;
  }

  /**
   * Get top recommendations
   */
  getTopRecommendations(limit = 10) {
    return this.recommendations.slice(0, limit);
  }

  /**
   * Get recommendations by priority
   */
  getRecommendationsByPriority(priority) {
    return this.recommendations.filter((r) => r.priority === priority);
  }

  /**
   * Get recommendations by category
   */
  getRecommendationsByCategory(category) {
    return this.recommendations.filter((r) => r.category === category);
  }

  /**
   * Get recommendation implementation plan
   */
  getImplementationPlan(recommendationId) {
    const recommendation = this.recommendations.find(
      (r) => r.id === recommendationId
    );

    if (!recommendation) return null;

    return {
      recommendation,
      implementationSteps: this.generateImplementationSteps(recommendation),
      timeline: this.generateTimeline(recommendation),
      successMetrics: this.generateSuccessMetrics(recommendation),
      rollbackPlan: this.generateRollbackPlan(recommendation),
    };
  }

  /**
   * Generate implementation steps
   */
  generateImplementationSteps(recommendation) {
    const steps = [];

    recommendation.actions.forEach((action, index) => {
      steps.push({
        step: index + 1,
        action,
        effort: this.estimateEffort(action),
        dependencies: this.identifyDependencies(action),
        testing: this.generateTestingSteps(action),
      });
    });

    return steps;
  }

  /**
   * Estimate effort for an action
   */
  estimateEffort(action) {
    const effortKeywords = {
      low: ["add", "update", "modify", "change", "test"],
      medium: ["implement", "create", "develop", "optimize", "improve"],
      high: ["redesign", "rebuild", "restructure", "migrate", "overhaul"],
    };

    for (const [effort, keywords] of Object.entries(effortKeywords)) {
      if (keywords.some((keyword) => action.toLowerCase().includes(keyword))) {
        return effort;
      }
    }

    return "medium";
  }

  /**
   * Identify dependencies for an action
   */
  identifyDependencies(action) {
    const dependencies = [];

    if (action.includes("analytics") || action.includes("tracking")) {
      dependencies.push("Analytics setup");
    }

    if (action.includes("content") || action.includes("copy")) {
      dependencies.push("Content team");
    }

    if (action.includes("design") || action.includes("UI")) {
      dependencies.push("Design team");
    }

    if (action.includes("development") || action.includes("code")) {
      dependencies.push("Development team");
    }

    return dependencies;
  }

  /**
   * Generate testing steps
   */
  generateTestingSteps(action) {
    const testingSteps = [];

    if (action.includes("performance") || action.includes("speed")) {
      testingSteps.push("Measure Core Web Vitals before and after");
      testingSteps.push("Test on various devices and network conditions");
    }

    if (action.includes("conversion") || action.includes("CTA")) {
      testingSteps.push("A/B test the changes");
      testingSteps.push("Monitor conversion rate changes");
    }

    if (action.includes("user") || action.includes("experience")) {
      testingSteps.push("Conduct user testing sessions");
      testingSteps.push("Analyze heatmaps and session recordings");
    }

    return testingSteps;
  }

  /**
   * Generate timeline
   */
  generateTimeline(recommendation) {
    const baseTimeline = {
      low: { planning: 1, implementation: 3, testing: 2, deployment: 1 },
      medium: { planning: 2, implementation: 7, testing: 3, deployment: 1 },
      high: { planning: 3, implementation: 14, testing: 5, deployment: 2 },
    };

    return baseTimeline[recommendation.effort] || baseTimeline.medium;
  }

  /**
   * Generate success metrics
   */
  generateSuccessMetrics(recommendation) {
    const metrics = [];

    recommendation.metrics.forEach((metric) => {
      metrics.push({
        metric,
        baseline: "Current value (to be measured)",
        target: this.generateTargetValue(recommendation, metric),
        measurement: this.generateMeasurementMethod(metric),
      });
    });

    return metrics;
  }

  /**
   * Generate target value
   */
  generateTargetValue(recommendation, metric) {
    const targets = {
      page_load_time: "Reduce by 20-30%",
      bounce_rate: "Reduce by 15-25%",
      conversion_rate: "Increase by 10-20%",
      cls_score: "Reduce below 0.1",
      user_engagement: "Increase by 25-35%",
      dropoff_rate: "Reduce by 20-30%",
      case_study_views: "Increase by 40-60%",
      contact_interactions: "Increase by 25-40%",
      time_to_convert: "Reduce by 15-25%",
      path_efficiency: "Improve by 30-50%",
    };

    return targets[metric] || "Improve by 15-25%";
  }

  /**
   * Generate measurement method
   */
  generateMeasurementMethod(metric) {
    const methods = {
      page_load_time: "Core Web Vitals tracking",
      bounce_rate: "Google Analytics",
      conversion_rate: "Conversion tracking events",
      cls_score: "Layout shift monitoring",
      user_engagement: "Session duration and interaction tracking",
      dropoff_rate: "Funnel analysis",
      case_study_views: "Click tracking on case study elements",
      contact_interactions: "Contact form submissions and link clicks",
      time_to_convert: "Conversion journey timing",
      path_efficiency: "User flow analysis",
    };

    return methods[metric] || "Analytics tracking";
  }

  /**
   * Generate rollback plan
   */
  generateRollbackPlan(recommendation) {
    return {
      steps: [
        "Revert code changes to previous version",
        "Restore backup of affected files",
        "Clear browser cache and CDN cache if applicable",
        "Monitor metrics to confirm rollback success",
      ],
      timeline: "1-4 hours depending on complexity",
      risk: "Low - standard rollback procedures",
    };
  }

  /**
   * Export optimization framework data
   */
  exportFrameworkData() {
    return {
      recommendations: this.recommendations,
      insights: this.insights,
      priorities: Object.fromEntries(this.priorities),
      summary: {
        totalRecommendations: this.recommendations.length,
        criticalCount: this.recommendations.filter(
          (r) => r.priority === "critical"
        ).length,
        highCount: this.recommendations.filter((r) => r.priority === "high")
          .length,
        topCategories: this.getTopCategories(),
        lastAnalysis: new Date().toISOString(),
      },
    };
  }

  /**
   * Get top recommendation categories
   */
  getTopCategories() {
    const categories = {};

    this.recommendations.forEach((rec) => {
      categories[rec.category] = (categories[rec.category] || 0) + 1;
    });

    return Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }
}
