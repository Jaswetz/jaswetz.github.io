/**
 * Conversion Dashboard - Real-time analytics insights and optimization interface
 * Comprehensive dashboard for monitoring conversion performance and optimization opportunities
 */

export class ConversionDashboard {
  constructor(
    analyticsManager,
    conversionTracker,
    userJourneyAnalyzer,
    userSegmentation,
    performanceMonitor,
    optimizationFramework,
    abTestingFramework
  ) {
    this.analyticsManager = analyticsManager;
    this.conversionTracker = conversionTracker;
    this.userJourneyAnalyzer = userJourneyAnalyzer;
    this.userSegmentation = userSegmentation;
    this.performanceMonitor = performanceMonitor;
    this.optimizationFramework = optimizationFramework;
    this.abTestingFramework = abTestingFramework;

    this.dashboard = null;
    this.updateInterval = 30000; // 30 seconds
    this.isVisible = false;
    this.isInitialized = false;
  }

  /**
   * Initialize dashboard
   */
  async initialize() {
    if (this.isInitialized) return;

    this.createDashboardContainer();
    this.setupDashboardStructure();
    this.setupRealTimeUpdates();
    this.setupEventListeners();
    this.loadInitialData();
    this.isInitialized = true;

    // Conversion dashboard initialized
  }

  /**
   * Create dashboard container
   */
  createDashboardContainer() {
    // Check if dashboard should be shown (development or analytics=true parameter)
    const isProduction =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1" &&
      !window.location.port;
    const showAnalytics = isProduction
      ? new URLSearchParams(window.location.search).get("analytics") === "true"
      : true; // Always show in development

    // Create dashboard container
    const dashboard = document.createElement("div");
    dashboard.id = "conversion-dashboard";
    dashboard.className = "conversion-dashboard";
    dashboard.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 400px;
      max-height: 80vh;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      overflow: hidden;
      display: none;
    `;

    // Only create toggle button if analytics should be shown
    if (showAnalytics) {
      // Add toggle button
      const toggleButton = document.createElement("button");
      toggleButton.id = "dashboard-toggle";
      toggleButton.textContent = "📊 Analytics";
      toggleButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4285f4;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 12px;
        z-index: 10001;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;

      document.body.appendChild(toggleButton);
      this.toggleButton = toggleButton;
    }

    document.body.appendChild(dashboard);
    this.dashboard = dashboard;
  }

  /**
   * Setup dashboard structure
   */
  setupDashboardStructure() {
    this.dashboard.innerHTML = `
      <div class="dashboard-header">
        <h3 style="margin: 0; color: #333; font-size: 16px;">Conversion Analytics</h3>
        <div class="dashboard-controls">
          <button id="refresh-btn" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">↻</button>
          <button id="close-btn" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">✕</button>
        </div>
      </div>

      <div class="dashboard-content" style="max-height: calc(80vh - 60px); overflow-y: auto; padding: 16px;">
        <!-- Real-time Metrics -->
        <div class="dashboard-section">
          <h4 style="margin: 0 0 12px 0; color: #666; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Real-time Metrics</h4>
          <div id="realtime-metrics" class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Page Views</div>
              <div class="metric-value" id="page-views">0</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Conversions</div>
              <div class="metric-value" id="conversions">0</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Conversion Rate</div>
              <div class="metric-value" id="conversion-rate">0%</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Avg. Session</div>
              <div class="metric-value" id="avg-session">0s</div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="dashboard-section">
          <h4 style="margin: 16px 0 12px 0; color: #666; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Performance</h4>
          <div id="performance-metrics" class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">LCP</div>
              <div class="metric-value" id="lcp-score">-</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">CLS</div>
              <div class="metric-value" id="cls-score">-</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">FID</div>
              <div class="metric-value" id="fid-score">-</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">TTFB</div>
              <div class="metric-value" id="ttfb-score">-</div>
            </div>
          </div>
        </div>

        <!-- Top Recommendations -->
        <div class="dashboard-section">
          <h4 style="margin: 16px 0 12px 0; color: #666; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Top Recommendations</h4>
          <div id="recommendations-list" class="recommendations-list">
            <div class="loading">Loading recommendations...</div>
          </div>
        </div>

        <!-- Active Experiments -->
        <div class="dashboard-section">
          <h4 style="margin: 16px 0 12px 0; color: #666; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Active Experiments</h4>
          <div id="experiments-list" class="experiments-list">
            <div class="loading">Loading experiments...</div>
          </div>
        </div>

        <!-- User Segments -->
        <div class="dashboard-section">
          <h4 style="margin: 16px 0 12px 0; color: #666; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 8px;">User Segments</h4>
          <div id="segments-overview" class="segments-overview">
            <div class="loading">Loading segments...</div>
          </div>
        </div>

        <!-- Journey Insights -->
        <div class="dashboard-section">
          <h4 style="margin: 16px 0 12px 0; color: #666; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Journey Insights</h4>
          <div id="journey-insights" class="journey-insights">
            <div class="loading">Loading insights...</div>
          </div>
        </div>
      </div>
    `;

    // Add CSS styles
    this.addDashboardStyles();
  }

  /**
   * Add dashboard styles
   */
  addDashboardStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .conversion-dashboard .metrics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 16px;
      }

      .conversion-dashboard .metric-card {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 6px;
        padding: 12px;
        text-align: center;
      }

      .conversion-dashboard .metric-label {
        font-size: 11px;
        color: #666;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .conversion-dashboard .metric-value {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }

      .conversion-dashboard .recommendations-list,
      .conversion-dashboard .experiments-list {
        max-height: 200px;
        overflow-y: auto;
      }

      .conversion-dashboard .recommendation-item,
      .conversion-dashboard .experiment-item {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 8px;
        font-size: 12px;
      }

      .conversion-dashboard .recommendation-item.critical {
        border-left: 4px solid #dc3545;
        background: #fff5f5;
      }

      .conversion-dashboard .recommendation-item.high {
        border-left: 4px solid #fd7e14;
        background: #fffbf0;
      }

      .conversion-dashboard .recommendation-item.medium {
        border-left: 4px solid #ffc107;
        background: #fffef0;
      }

      .conversion-dashboard .loading {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 20px;
      }

      .conversion-dashboard .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #eee;
        background: #f8f9fa;
      }

      .conversion-dashboard .dashboard-controls {
        display: flex;
        gap: 8px;
      }

      .conversion-dashboard .segments-overview {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .conversion-dashboard .segment-card {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        padding: 8px;
        text-align: center;
        font-size: 12px;
      }

      .conversion-dashboard .journey-insights {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        padding: 12px;
        font-size: 12px;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Setup real-time updates
   */
  setupRealTimeUpdates() {
    // Update dashboard every 30 seconds
    this.updateIntervalId = setInterval(() => {
      if (this.isVisible) {
        this.updateDashboard();
      }
    }, this.updateInterval);

    // Listen for conversion events
    document.addEventListener("conversion_milestone", () => {
      if (this.isVisible) {
        setTimeout(() => this.updateDashboard(), 1000);
      }
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Only setup listeners if toggle button exists
    if (!this.toggleButton) return;

    // Toggle dashboard visibility
    this.toggleButton.addEventListener("click", () => {
      this.toggleDashboard();
    });

    // Close button
    const closeBtn = this.dashboard.querySelector("#close-btn");
    closeBtn.addEventListener("click", () => {
      this.hideDashboard();
    });

    // Refresh button
    const refreshBtn = this.dashboard.querySelector("#refresh-btn");
    refreshBtn.addEventListener("click", () => {
      this.updateDashboard();
    });

    // Keyboard shortcut (Ctrl+Shift+A)
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        this.toggleDashboard();
      }
    });
  }

  /**
   * Load initial data
   */
  async loadInitialData() {
    try {
      await this.updateDashboard();
    } catch (error) {
      console.warn("Failed to load initial dashboard data:", error);
    }
  }

  /**
   * Update dashboard with latest data
   */
  async updateDashboard() {
    try {
      // Update real-time metrics
      await this.updateRealTimeMetrics();

      // Update performance metrics
      await this.updatePerformanceMetrics();

      // Update recommendations
      await this.updateRecommendations();

      // Update experiments
      await this.updateExperiments();

      // Update segments
      await this.updateSegments();

      // Update journey insights
      await this.updateJourneyInsights();
    } catch (error) {
      console.warn("Failed to update dashboard:", error);
    }
  }

  /**
   * Update real-time metrics
   */
  async updateRealTimeMetrics() {
    try {
      // Get data from various sources
      const journeyData = this.userJourneyAnalyzer?.getJourneyAnalysis();
      const segmentationData = this.userSegmentation?.exportSegmentationData();

      // Calculate metrics
      const pageViews = journeyData?.sessionMetrics?.pageViews || 0;
      const conversions = journeyData?.conversionJourney?.conversionValue || 0;
      const conversionRate =
        pageViews > 0 ? ((conversions / pageViews) * 100).toFixed(1) : "0.0";
      const avgSession = journeyData?.sessionMetrics?.timeOnPage || 0;

      // Update DOM
      this.updateElement("page-views", pageViews.toString());
      this.updateElement("conversions", conversions.toString());
      this.updateElement("conversion-rate", `${conversionRate}%`);
      this.updateElement("avg-session", `${Math.round(avgSession)}s`);
    } catch (error) {
      console.warn("Failed to update real-time metrics:", error);
    }
  }

  /**
   * Update performance metrics
   */
  async updatePerformanceMetrics() {
    try {
      const performanceData = this.performanceMonitor?.exportPerformanceData();
      const latestVitals = performanceData?.performanceData
        ?.filter((d) => d.type === "core_web_vitals")
        ?.slice(-1)[0];

      if (latestVitals?.data) {
        const { lcp, cls, fid, ttfb } = latestVitals.data;

        this.updateElement("lcp-score", lcp ? `${Math.round(lcp)}ms` : "-");
        this.updateElement("cls-score", cls ? cls.toFixed(3) : "-");
        this.updateElement("fid-score", fid ? `${Math.round(fid)}ms` : "-");
        this.updateElement("ttfb-score", ttfb ? `${Math.round(ttfb)}ms` : "-");
      }
    } catch (error) {
      console.warn("Failed to update performance metrics:", error);
    }
  }

  /**
   * Update recommendations
   */
  async updateRecommendations() {
    try {
      const recommendations =
        this.optimizationFramework?.getTopRecommendations(5) || [];

      const recommendationsList = this.dashboard.querySelector(
        "#recommendations-list"
      );

      if (recommendations.length === 0) {
        recommendationsList.innerHTML =
          "<div class='loading'>No recommendations available</div>";
        return;
      }

      const recommendationsHtml = recommendations
        .map(
          (rec) => `
        <div class="recommendation-item ${rec.priority || "medium"}">
          <div style="font-weight: 600; margin-bottom: 4px;">${rec.title}</div>
          <div style="color: #666; font-size: 11px; margin-bottom: 4px;">${
            rec.description
          }</div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #888;">
            <span>Impact: ${rec.impact || "Medium"}</span>
            <span>Effort: ${rec.effort || "Medium"}</span>
          </div>
        </div>
      `
        )
        .join("");

      recommendationsList.innerHTML = recommendationsHtml;
    } catch (error) {
      console.warn("Failed to update recommendations:", error);
    }
  }

  /**
   * Update experiments
   */
  async updateExperiments() {
    try {
      const experiments = this.abTestingFramework?.getActiveExperiments() || [];

      const experimentsList = this.dashboard.querySelector("#experiments-list");

      if (experiments.length === 0) {
        experimentsList.innerHTML =
          "<div class='loading'>No active experiments</div>";
        return;
      }

      const experimentsHtml = experiments
        .map(
          (exp) => `
        <div class="experiment-item">
          <div style="font-weight: 600; margin-bottom: 4px;">${exp.name}</div>
          <div style="font-size: 11px; color: #666; margin-bottom: 4px;">${
            exp.type
          } • ${exp.status}</div>
          <div style="font-size: 10px; color: #888;">
            Sample: ${Object.values(exp.results).reduce(
              (sum, v) => sum + (v.visitors || 0),
              0
            )}/${exp.sampleSize}
          </div>
        </div>
      `
        )
        .join("");

      experimentsList.innerHTML = experimentsHtml;
    } catch (error) {
      console.warn("Failed to update experiments:", error);
    }
  }

  /**
   * Update segments
   */
  async updateSegments() {
    try {
      const segmentationData = this.userSegmentation?.exportSegmentationData();

      const segmentsOverview =
        this.dashboard.querySelector("#segments-overview");

      if (!segmentationData?.insights?.segmentDistribution) {
        segmentsOverview.innerHTML =
          "<div class='loading'>No segment data available</div>";
        return;
      }

      const topSegments = Object.entries(
        segmentationData.insights.segmentDistribution
      )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);

      const segmentsHtml = topSegments
        .map(
          ([segment, count]) => `
        <div class="segment-card">
          <div style="font-weight: 600; margin-bottom: 4px;">${segment.replace(
            /_/g,
            " "
          )}</div>
          <div style="font-size: 18px; color: #4285f4;">${count}</div>
        </div>
      `
        )
        .join("");

      segmentsOverview.innerHTML = segmentsHtml;
    } catch (error) {
      console.warn("Failed to update segments:", error);
    }
  }

  /**
   * Update journey insights
   */
  async updateJourneyInsights() {
    try {
      const journeyData = this.userJourneyAnalyzer?.getJourneyAnalysis();

      const journeyInsights = this.dashboard.querySelector("#journey-insights");

      if (!journeyData) {
        journeyInsights.innerHTML =
          "<div class='loading'>No journey data available</div>";
        return;
      }

      const insights = journeyData.insights || [];
      const topInsight = insights[0];

      if (topInsight) {
        journeyInsights.innerHTML = `
          <div style="font-weight: 600; margin-bottom: 8px;">${
            topInsight.title
          }</div>
          <div style="color: #666; margin-bottom: 8px;">${
            topInsight.description
          }</div>
          <div style="font-size: 11px; color: #888;">
            ${Object.entries(topInsight.metrics || {})
              .map(
                ([key, value]) =>
                  `${key}: ${
                    typeof value === "number" ? value.toFixed(1) : value
                  }`
              )
              .join(" • ")}
          </div>
        `;
      } else {
        journeyInsights.innerHTML =
          "<div class='loading'>Analyzing user journeys...</div>";
      }
    } catch (error) {
      console.warn("Failed to update journey insights:", error);
    }
  }

  /**
   * Update DOM element
   */
  updateElement(id, value) {
    const element = this.dashboard.querySelector(`#${id}`);
    if (element) {
      element.textContent = value;
    }
  }

  /**
   * Toggle dashboard visibility
   */
  toggleDashboard() {
    if (this.isVisible) {
      this.hideDashboard();
    } else {
      this.showDashboard();
    }
  }

  /**
   * Show dashboard
   */
  showDashboard() {
    this.dashboard.style.display = "block";
    if (this.toggleButton) {
      this.toggleButton.style.display = "none";
    }
    this.isVisible = true;

    // Update dashboard immediately when shown
    this.updateDashboard();

    // Track dashboard usage
    this.analyticsManager.gtag("event", "dashboard_opened", {
      event_category: "Analytics",
      event_label: "Conversion Dashboard",
    });
  }

  /**
   * Hide dashboard
   */
  hideDashboard() {
    this.dashboard.style.display = "none";
    if (this.toggleButton) {
      this.toggleButton.style.display = "block";
    }
    this.isVisible = false;
  }

  /**
   * Export dashboard data
   */
  exportDashboardData() {
    return {
      timestamp: new Date().toISOString(),
      isVisible: this.isVisible,
      lastUpdate: new Date().toISOString(),
      data: {
        realtime: this.getRealtimeMetrics(),
        performance: this.getPerformanceMetrics(),
        recommendations:
          this.optimizationFramework?.getTopRecommendations(10) || [],
        experiments: this.abTestingFramework?.getActiveExperiments() || [],
        segments: this.userSegmentation?.exportSegmentationData() || {},
        journey: this.userJourneyAnalyzer?.getJourneyAnalysis() || {},
      },
    };
  }

  /**
   * Get real-time metrics
   */
  getRealtimeMetrics() {
    return {
      pageViews:
        this.dashboard.querySelector("#page-views")?.textContent || "0",
      conversions:
        this.dashboard.querySelector("#conversions")?.textContent || "0",
      conversionRate:
        this.dashboard.querySelector("#conversion-rate")?.textContent || "0%",
      avgSession:
        this.dashboard.querySelector("#avg-session")?.textContent || "0s",
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return {
      lcp: this.dashboard.querySelector("#lcp-score")?.textContent || "-",
      cls: this.dashboard.querySelector("#cls-score")?.textContent || "-",
      fid: this.dashboard.querySelector("#fid-score")?.textContent || "-",
      ttfb: this.dashboard.querySelector("#ttfb-score")?.textContent || "-",
    };
  }

  /**
   * Destroy dashboard
   */
  destroy() {
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }

    if (this.dashboard) {
      this.dashboard.remove();
    }

    if (this.toggleButton) {
      this.toggleButton.remove();
    }

    this.isInitialized = false;
    // Conversion dashboard destroyed
  }
}
