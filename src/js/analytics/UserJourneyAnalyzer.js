/**
 * User Journey Analyzer - Analyzes heatmaps and session recordings from Microsoft Clarity
 * Provides insights for user behavior optimization and conversion funnel improvements
 */

export class UserJourneyAnalyzer {
  constructor(clarityTracker, conversionTracker) {
    this.clarityTracker = clarityTracker;
    this.conversionTracker = conversionTracker;
    this.journeyPatterns = new Map();
    this.heatmapData = new Map();
    this.sessionInsights = [];
    this.isInitialized = false;
  }

  /**
   * Initialize user journey analysis
   */
  initialize() {
    if (this.isInitialized) return;

    this.setupJourneyTracking();
    this.setupHeatmapAnalysis();
    this.setupSessionRecordingAnalysis();
    this.isInitialized = true;

    console.log("User journey analyzer initialized");
  }

  /**
   * Setup comprehensive journey tracking
   */
  setupJourneyTracking() {
    this.trackPageSequences();
    this.trackUserFlowPatterns();
    this.trackConversionPaths();
    // Drop-off point tracking is handled within identifyJourneyPatterns()
  }

  /**
   * Track page sequence patterns
   */
  trackPageSequences() {
    let pageSequence = [];
    let startTime = Date.now();

    // Track page views and sequences
    const trackPageView = () => {
      const currentPage = window.location.pathname;
      const timestamp = Date.now();

      pageSequence.push({
        page: currentPage,
        timestamp,
        timeSpent: timestamp - startTime,
      });

      // Analyze sequence patterns
      this.analyzePageSequence(pageSequence);

      startTime = timestamp;
    };

    // Track initial page load
    trackPageView();

    // Track navigation changes
    window.addEventListener("popstate", trackPageView);

    // Track programmatic navigation (for SPAs)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      setTimeout(trackPageView, 100); // Allow page to update
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      setTimeout(trackPageView, 100);
    };
  }

  /**
   * Analyze page sequence patterns
   */
  analyzePageSequence(sequence) {
    if (sequence.length < 2) return;

    const pattern = sequence.map((s) => s.page).join(" → ");
    const existingPattern = this.journeyPatterns.get(pattern) || {
      count: 0,
      totalTime: 0,
      conversions: 0,
    };

    existingPattern.count++;
    existingPattern.totalTime += sequence[sequence.length - 1].timeSpent;

    this.journeyPatterns.set(pattern, existingPattern);

    // Identify common patterns
    this.identifyJourneyPatterns();
  }

  /**
   * Identify common journey patterns and insights
   */
  identifyJourneyPatterns() {
    const patterns = Array.from(this.journeyPatterns.entries());

    // Find most common paths
    const topPaths = patterns
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10);

    // Find high-converting paths
    const highConvertingPaths = patterns
      .filter(([path, data]) => data.conversions > 0)
      .sort(
        (a, b) => b[1].conversions / b[1].count - a[1].conversions / a[1].count
      )
      .slice(0, 5);

    // Find drop-off points
    const dropOffPoints = this.identifyDropOffPoints(patterns);

    this.sessionInsights.push({
      timestamp: new Date().toISOString(),
      topPaths,
      highConvertingPaths,
      dropOffPoints,
      recommendations: this.generateJourneyRecommendations(
        topPaths,
        highConvertingPaths,
        dropOffPoints
      ),
    });
  }

  /**
   * Identify drop-off points in user journeys
   */
  identifyDropOffPoints(patterns) {
    const dropOffs = new Map();

    patterns.forEach(([path, data]) => {
      const pages = path.split(" → ");
      if (pages.length > 1) {
        // Calculate drop-off rate between pages
        const dropOffRate = 1 - data.conversions / data.count;

        if (dropOffRate > 0.5) {
          // High drop-off threshold
          for (let i = 0; i < pages.length - 1; i++) {
            const transition = `${pages[i]} → ${pages[i + 1]}`;
            dropOffs.set(transition, {
              rate: dropOffRate,
              count: data.count,
              conversions: data.conversions,
            });
          }
        }
      }
    });

    return Array.from(dropOffs.entries())
      .sort((a, b) => b[1].rate - a[1].rate)
      .slice(0, 5);
  }

  /**
   * Track user flow patterns
   */
  trackUserFlowPatterns() {
    const flowPatterns = {
      scrollBehavior: [],
      clickPatterns: [],
      timePatterns: [],
      rageClicks: [],
    };

    // Track scroll behavior
    let scrollDepth = 0;
    window.addEventListener("scroll", () => {
      const newDepth = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      if (newDepth > scrollDepth) {
        scrollDepth = newDepth;
        flowPatterns.scrollBehavior.push({
          depth: newDepth,
          timestamp: Date.now(),
        });
      }
    });

    // Track click patterns
    document.addEventListener("click", (e) => {
      flowPatterns.clickPatterns.push({
        element: e.target.tagName,
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });
    });

    // Track rage clicks (rapid clicks in same area)
    let recentClicks = [];
    document.addEventListener("click", (e) => {
      const click = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      };

      recentClicks.push(click);

      // Keep only clicks from last 2 seconds
      recentClicks = recentClicks.filter(
        (c) => Date.now() - c.timestamp < 2000
      );

      // Check for rage clicks (5+ clicks in same area within 2 seconds)
      if (recentClicks.length >= 5) {
        const avgX =
          recentClicks.reduce((sum, c) => sum + c.x, 0) / recentClicks.length;
        const avgY =
          recentClicks.reduce((sum, c) => sum + c.y, 0) / recentClicks.length;

        const isClustered = recentClicks.every(
          (c) => Math.abs(c.x - avgX) < 50 && Math.abs(c.y - avgY) < 50
        );

        if (isClustered) {
          flowPatterns.rageClicks.push({
            x: avgX,
            y: avgY,
            clickCount: recentClicks.length,
            timestamp: Date.now(),
          });
        }
      }
    });

    // Store flow patterns for analysis
    this.flowPatterns = flowPatterns;
  }

  /**
   * Track conversion paths
   */
  trackConversionPaths() {
    // Track which paths lead to conversions
    const conversionPaths = new Map();

    // Listen for conversion events
    document.addEventListener("conversion_milestone", (e) => {
      const milestone = e.detail?.milestone;
      const currentPath = window.location.pathname;

      if (milestone && currentPath) {
        const pathKey = `${currentPath}_${milestone}`;
        const existing = conversionPaths.get(pathKey) || {
          count: 0,
          lastConversion: null,
        };

        existing.count++;
        existing.lastConversion = new Date().toISOString();

        conversionPaths.set(pathKey, existing);
      }
    });

    this.conversionPaths = conversionPaths;
  }

  /**
   * Setup heatmap analysis
   */
  setupHeatmapAnalysis() {
    this.trackClickHeatmap();
    this.trackScrollHeatmap();
    this.trackAttentionHeatmap();
  }

  /**
   * Track click heatmap data
   */
  trackClickHeatmap() {
    const clickData = new Map();

    document.addEventListener("click", (e) => {
      const element = e.target;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const key = `${element.tagName}_${element.className || "no-class"}`;
      const existing = clickData.get(key) || {
        clicks: [],
        element: element.tagName,
        className: element.className,
      };

      existing.clicks.push({ x, y, timestamp: Date.now() });
      clickData.set(key, existing);
    });

    this.clickHeatmap = clickData;
  }

  /**
   * Track scroll heatmap data
   */
  trackScrollHeatmap() {
    const scrollData = [];
    let lastScrollY = 0;

    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollY / maxScroll) * 100);

      // Track scroll velocity and patterns
      const velocity = scrollY - lastScrollY;
      lastScrollY = scrollY;

      scrollData.push({
        scrollY,
        scrollPercent,
        velocity,
        timestamp: Date.now(),
        viewportHeight: window.innerHeight,
      });

      // Keep only last 100 scroll events
      if (scrollData.length > 100) {
        scrollData.shift();
      }
    });

    this.scrollHeatmap = scrollData;
  }

  /**
   * Track attention heatmap (time spent looking at different areas)
   */
  trackAttentionHeatmap() {
    const attentionData = new Map();
    let lastViewportCheck = Date.now();

    const checkViewport = () => {
      const now = Date.now();
      const timeSpent = now - lastViewportCheck;

      // Get elements in viewport
      const elements = document.querySelectorAll("*");
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible =
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0;

        if (isVisible && rect.width > 0 && rect.height > 0) {
          const key = `${element.tagName}_${element.className || "no-class"}`;
          const existing = attentionData.get(key) || {
            totalTime: 0,
            viewCount: 0,
            element: element.tagName,
            className: element.className,
          };

          existing.totalTime += timeSpent;
          existing.viewCount++;
          attentionData.set(key, existing);
        }
      });

      lastViewportCheck = now;
    };

    // Check viewport every second
    setInterval(checkViewport, 1000);

    this.attentionHeatmap = attentionData;
  }

  /**
   * Setup session recording analysis
   */
  setupSessionRecordingAnalysis() {
    this.trackSessionMetrics();
    this.trackUserFrustrationSignals();
    this.trackConversionJourney();
  }

  /**
   * Track session metrics
   */
  trackSessionMetrics() {
    const sessionMetrics = {
      startTime: Date.now(),
      pageViews: 1,
      totalScrollDistance: 0,
      totalClickCount: 0,
      rageClickCount: 0,
      timeOnPage: 0,
    };

    // Track page views
    window.addEventListener("load", () => {
      sessionMetrics.pageViews++;
    });

    // Track scroll distance
    let lastScrollY = 0;
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      sessionMetrics.totalScrollDistance += Math.abs(scrollY - lastScrollY);
      lastScrollY = scrollY;
    });

    // Track clicks
    document.addEventListener("click", () => {
      sessionMetrics.totalClickCount++;
    });

    // Track rage clicks
    document.addEventListener("rageClick", () => {
      sessionMetrics.rageClickCount++;
    });

    // Update time on page
    setInterval(() => {
      sessionMetrics.timeOnPage = Date.now() - sessionMetrics.startTime;
    }, 1000);

    this.sessionMetrics = sessionMetrics;
  }

  /**
   * Track user frustration signals
   */
  trackUserFrustrationSignals() {
    const frustrationSignals = {
      rageClicks: [],
      rapidScrolling: [],
      formAbandonment: [],
      errorInteractions: [],
    };

    // Rage clicks (already tracked in flow patterns)
    document.addEventListener("rageClick", (e) => {
      frustrationSignals.rageClicks.push({
        x: e.detail?.x,
        y: e.detail?.y,
        timestamp: Date.now(),
      });
    });

    // Rapid scrolling (indicates frustration or confusion)
    let scrollEvents = [];
    window.addEventListener("scroll", () => {
      scrollEvents.push(Date.now());

      // Keep only events from last 2 seconds
      scrollEvents = scrollEvents.filter((time) => Date.now() - time < 2000);

      if (scrollEvents.length > 10) {
        // More than 10 scrolls in 2 seconds
        frustrationSignals.rapidScrolling.push({
          scrollCount: scrollEvents.length,
          timestamp: Date.now(),
        });
      }
    });

    // Form abandonment
    document.addEventListener("focusout", (e) => {
      const input = e.target;
      if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
        // Check if form was abandoned (user left without submitting)
        setTimeout(() => {
          if (!document.activeElement?.closest("form")?.contains(input)) {
            frustrationSignals.formAbandonment.push({
              field: input.name || input.id,
              timestamp: Date.now(),
            });
          }
        }, 5000); // Wait 5 seconds to see if they return
      }
    });

    this.frustrationSignals = frustrationSignals;
  }

  /**
   * Track complete conversion journey
   */
  trackConversionJourney() {
    const conversionJourney = {
      touchpoints: [],
      timeToConvert: 0,
      pathEfficiency: 0,
      conversionValue: 0,
    };

    // Track all touchpoints leading to conversion
    const trackTouchpoint = (type, details) => {
      conversionJourney.touchpoints.push({
        type,
        details,
        timestamp: Date.now(),
      });
    };

    // Track various touchpoints
    document.addEventListener("click", (e) => {
      trackTouchpoint("click", {
        element: e.target.tagName,
        x: e.clientX,
        y: e.clientY,
      });
    });

    document.addEventListener("scroll", () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );
      trackTouchpoint("scroll", { percent: scrollPercent });
    });

    // Track conversion completion
    document.addEventListener("conversion_complete", (e) => {
      conversionJourney.timeToConvert =
        Date.now() - conversionJourney.touchpoints[0]?.timestamp || 0;
      conversionJourney.conversionValue = e.detail?.value || 0;
      conversionJourney.pathEfficiency = this.calculatePathEfficiency(
        conversionJourney.touchpoints
      );
    });

    this.conversionJourney = conversionJourney;
  }

  /**
   * Calculate path efficiency
   */
  calculatePathEfficiency(touchpoints) {
    if (touchpoints.length < 2) return 0;

    // Calculate efficiency based on direct path vs. wandering
    const directPathLength = 1; // Ideal path length
    const actualPathLength = touchpoints.length;

    return Math.max(0, (directPathLength / actualPathLength) * 100);
  }

  /**
   * Generate journey recommendations
   */
  generateJourneyRecommendations(topPaths, highConvertingPaths, dropOffPoints) {
    const recommendations = [];

    // Analyze top paths
    if (topPaths.length > 0) {
      recommendations.push({
        type: "optimization",
        priority: "high",
        title: "Optimize Top User Paths",
        description: `The most common user path is: ${topPaths[0][0]}. Consider optimizing this flow.`,
        impact: "High traffic path optimization",
      });
    }

    // Analyze high-converting paths
    if (highConvertingPaths.length > 0) {
      recommendations.push({
        type: "amplification",
        priority: "high",
        title: "Amplify High-Converting Paths",
        description: `Users following: ${
          highConvertingPaths[0][0]
        } have ${Math.round(
          (highConvertingPaths[0][1].conversions /
            highConvertingPaths[0][1].count) *
            100
        )}% conversion rate.`,
        impact: "Increase conversion rate",
      });
    }

    // Analyze drop-off points
    if (dropOffPoints.length > 0) {
      recommendations.push({
        type: "friction_removal",
        priority: "medium",
        title: "Address Drop-off Points",
        description: `High drop-off at: ${dropOffPoints[0][0]} (${Math.round(
          dropOffPoints[0][1].rate * 100
        )}% drop-off rate).`,
        impact: "Reduce bounce rate",
      });
    }

    return recommendations;
  }

  /**
   * Get comprehensive journey analysis
   */
  getJourneyAnalysis() {
    return {
      journeyPatterns: Object.fromEntries(this.journeyPatterns),
      heatmapData: {
        clicks: Object.fromEntries(this.clickHeatmap || new Map()),
        scroll: this.scrollHeatmap || [],
        attention: Object.fromEntries(this.attentionHeatmap || new Map()),
      },
      sessionInsights: this.sessionInsights,
      flowPatterns: this.flowPatterns,
      conversionPaths: Object.fromEntries(this.conversionPaths || new Map()),
      frustrationSignals: this.frustrationSignals,
      sessionMetrics: this.sessionMetrics,
      conversionJourney: this.conversionJourney,
      recommendations:
        this.sessionInsights[this.sessionInsights.length - 1]
          ?.recommendations || [],
    };
  }

  /**
   * Export analysis data
   */
  exportAnalysisData() {
    return {
      timestamp: new Date().toISOString(),
      analysis: this.getJourneyAnalysis(),
      summary: this.generateAnalysisSummary(),
    };
  }

  /**
   * Generate analysis summary
   */
  generateAnalysisSummary() {
    const analysis = this.getJourneyAnalysis();

    return {
      totalPatterns: Object.keys(analysis.journeyPatterns).length,
      totalClicks: Object.values(analysis.heatmapData.clicks).reduce(
        (sum, data) => sum + data.clicks.length,
        0
      ),
      totalScrollEvents: analysis.heatmapData.scroll.length,
      attentionElements: Object.keys(analysis.heatmapData.attention).length,
      frustrationSignals: Object.values(
        analysis.frustrationSignals || {}
      ).reduce((sum, signals) => sum + signals.length, 0),
      recommendationsCount: analysis.recommendations.length,
    };
  }
}
