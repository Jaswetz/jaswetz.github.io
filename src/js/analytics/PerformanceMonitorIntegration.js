/**
 * Performance Monitor Integration - Automated analytics performance monitoring
 * Integrates with MCP server for Core Web Vitals, Lighthouse audits, and bundle analysis
 */

import { MCPClient } from "./MCPClient.js";

export class PerformanceMonitorIntegration {
  constructor(analyticsManager) {
    this.analyticsManager = analyticsManager;
    this.mcpClient = new MCPClient("ws://localhost:3001");
    this.monitoringInterval = 5 * 60 * 1000; // 5 minutes
    this.performanceData = [];
    this.alerts = [];
    this.isInitialized = false;
    this.monitoringActive = false;
  }

  /**
   * Initialize performance monitoring
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      await this.checkMCPServerConnection();
      this.setupAutomatedMonitoring();
      this.setupPerformanceAlerts();
      this.setupRealTimeTracking();
      this.isInitialized = true;

      // Performance monitor integration initialized
    } catch (error) {
      console.warn("Failed to initialize performance monitoring:", error);
      this.fallbackMonitoring();
    }
  }

  /**
   * Check MCP server connection
   */
  async checkMCPServerConnection() {
    try {
      // Checking MCP server connection

      // Try to connect to MCP server
      await this.mcpClient.connect();

      // Get server info to verify connection
      const serverInfo = await this.mcpClient.getServerInfo();
      // MCP server connection established
      return true;
    } catch (error) {
      // MCP server not available
      return false;
    }
  }

  /**
   * Setup automated monitoring
   */
  setupAutomatedMonitoring() {
    // Monitor Core Web Vitals
    this.startCoreWebVitalsMonitoring();

    // Monitor Lighthouse performance
    this.startLighthouseMonitoring();

    // Monitor bundle size
    this.startBundleSizeMonitoring();

    // Generate performance reports
    this.startPerformanceReporting();

    this.monitoringActive = true;
  }

  /**
   * Start Core Web Vitals monitoring
   */
  startCoreWebVitalsMonitoring() {
    // Monitor every 5 minutes
    setInterval(async () => {
      try {
        const vitals = await this.measureCoreWebVitals();
        this.processCoreWebVitals(vitals);
        this.storePerformanceData("core_web_vitals", vitals);
      } catch (error) {
        console.warn("Core Web Vitals measurement failed:", error);
      }
    }, this.monitoringInterval);
  }

  /**
   * Measure Core Web Vitals using MCP server
   */
  async measureCoreWebVitals() {
    const currentUrl = window.location.href;

    try {
      const result = await this.mcpClient.callTool("measure_core_web_vitals", {
        url: currentUrl,
        device: this.detectDeviceType(),
      });
      return result;
    } catch (error) {
      console.warn("MCP Core Web Vitals measurement failed:", error);
      // Fallback to client-side measurement
      return this.measureCoreWebVitalsFallback();
    }
  }

  /**
   * Fallback Core Web Vitals measurement (client-side)
   */
  measureCoreWebVitalsFallback() {
    return new Promise((resolve) => {
      const results = {};

      // Measure TTFB
      const navigation = performance.getEntriesByType("navigation")[0];
      if (navigation) {
        results.ttfb = navigation.responseStart - navigation.requestStart;
      }

      // Measure FCP
      const paintEntries = performance.getEntriesByType("paint");
      const fcpEntry = paintEntries.find(
        (entry) => entry.name === "first-contentful-paint"
      );
      if (fcpEntry) {
        results.fcp = fcpEntry.startTime;
      }

      // Measure LCP
      let lcpValue = 0;
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        lcpValue = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // Measure CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      // Wait for measurements to complete
      setTimeout(() => {
        lcpObserver.disconnect();
        clsObserver.disconnect();

        resolve({
          cls: clsValue,
          fid: 0, // FID requires user interaction
          lcp: lcpValue,
          fcp: results.fcp || 0,
          ttfb: results.ttfb || 0,
          measured_at: new Date().toISOString(),
          fallback: true,
        });
      }, 3000);
    });
  }

  /**
   * Process Core Web Vitals data
   */
  processCoreWebVitals(vitals) {
    const { cls, fid, lcp, fcp, ttfb } = vitals;

    // Track in Google Analytics
    this.analyticsManager.gtag("event", "web_vitals_monitoring", {
      event_category: "Performance",
      event_label: "Core Web Vitals",
      cls_score: Math.round(cls * 1000) / 1000,
      fid_score: Math.round(fid),
      lcp_score: Math.round(lcp),
      fcp_score: Math.round(fcp),
      ttfb_score: Math.round(ttfb),
    });

    // Check for performance issues
    this.checkPerformanceThresholds(vitals);

    // Generate insights
    const insights = this.generatePerformanceInsights(vitals);
    if (insights.length > 0) {
      this.alerts.push({
        type: "performance_insight",
        data: vitals,
        insights,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Check performance thresholds
   */
  checkPerformanceThresholds(vitals) {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
      ttfb: { good: 800, poor: 1800 },
    };

    const alerts = [];

    Object.entries(thresholds).forEach(([metric, threshold]) => {
      const value = vitals[metric];
      if (value > threshold.poor) {
        alerts.push({
          metric,
          value,
          threshold: threshold.poor,
          severity: "critical",
          message: `${metric.toUpperCase()} is critically poor: ${value}ms`,
        });
      } else if (value > threshold.good) {
        alerts.push({
          metric,
          value,
          threshold: threshold.good,
          severity: "warning",
          message: `${metric.toUpperCase()} needs improvement: ${value}ms`,
        });
      }
    });

    if (alerts.length > 0) {
      this.alerts.push({
        type: "performance_threshold",
        alerts,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Generate performance insights
   */
  generatePerformanceInsights(vitals) {
    const insights = [];

    // LCP insights
    if (vitals.lcp > 4000) {
      insights.push({
        type: "lcp_optimization",
        priority: "critical",
        message:
          "LCP is critically slow. Optimize images, reduce server response time, and minimize render-blocking resources.",
        recommendations: [
          "Optimize largest contentful paint image",
          "Use CDN for static assets",
          "Implement lazy loading",
          "Minimize server response time",
        ],
      });
    }

    // CLS insights
    if (vitals.cls > 0.25) {
      insights.push({
        type: "cls_optimization",
        priority: "high",
        message:
          "High cumulative layout shift detected. Fix layout stability issues.",
        recommendations: [
          "Reserve space for dynamic content",
          "Avoid inserting content above existing content",
          "Use CSS aspect-ratio for images",
          "Preload fonts to prevent FOUT",
        ],
      });
    }

    // TTFB insights
    if (vitals.ttfb > 1800) {
      insights.push({
        type: "ttfb_optimization",
        priority: "high",
        message: "Time to First Byte is slow. Optimize server response time.",
        recommendations: [
          "Implement caching strategies",
          "Optimize database queries",
          "Use CDN",
          "Enable compression",
        ],
      });
    }

    return insights;
  }

  /**
   * Start Lighthouse monitoring
   */
  startLighthouseMonitoring() {
    // Run Lighthouse audit every 15 minutes
    setInterval(async () => {
      try {
        const audit = await this.runLighthouseAudit();
        this.processLighthouseResults(audit);
        this.storePerformanceData("lighthouse", audit);
      } catch (error) {
        console.warn("Lighthouse audit failed:", error);
      }
    }, 15 * 60 * 1000);
  }

  /**
   * Run Lighthouse audit using MCP server
   */
  async runLighthouseAudit() {
    const currentUrl = window.location.href;

    try {
      const result = await this.mcpClient.callTool("run_lighthouse_audit", {
        url: currentUrl,
        device: this.detectDeviceType(),
        categories: ["performance", "accessibility", "best-practices", "seo"],
      });
      return result;
    } catch (error) {
      console.warn("Lighthouse audit via MCP failed:", error);
      return null;
    }
  }

  /**
   * Process Lighthouse results
   */
  processLighthouseResults(audit) {
    if (!audit) return;

    // Track in Google Analytics
    this.analyticsManager.gtag("event", "lighthouse_audit", {
      event_category: "Performance",
      event_label: "Lighthouse Score",
      performance_score: audit.performance,
      accessibility_score: audit.accessibility,
      best_practices_score: audit.bestPractices,
      seo_score: audit.seo,
      pwa_score: audit.pwa,
    });

    // Check for score degradation
    if (audit.performance < 70) {
      this.alerts.push({
        type: "lighthouse_performance",
        severity: "critical",
        message: `Lighthouse performance score dropped to ${audit.performance}`,
        data: audit,
        timestamp: new Date().toISOString(),
      });
    } else if (audit.performance < 85) {
      this.alerts.push({
        type: "lighthouse_performance",
        severity: "warning",
        message: `Lighthouse performance score needs attention: ${audit.performance}`,
        data: audit,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Start bundle size monitoring
   */
  startBundleSizeMonitoring() {
    // Monitor bundle size every hour
    setInterval(async () => {
      try {
        const bundleAnalysis = await this.analyzeBundleSize();
        this.processBundleAnalysis(bundleAnalysis);
        this.storePerformanceData("bundle_size", bundleAnalysis);
      } catch (error) {
        console.warn("Bundle size analysis failed:", error);
      }
    }, 60 * 60 * 1000);
  }

  /**
   * Analyze bundle size using MCP server
   */
  async analyzeBundleSize() {
    try {
      const result = await this.mcpClient.callTool("analyze_bundle_size", {
        buildPath: "./dist", // Adjust path as needed
        entryPoint: "main.js",
      });
      return result;
    } catch (error) {
      console.warn("Bundle analysis via MCP failed:", error);
      return null;
    }
  }

  /**
   * Process bundle analysis
   */
  processBundleAnalysis(analysis) {
    if (!analysis) return;

    // Track bundle metrics
    this.analyticsManager.gtag("event", "bundle_analysis", {
      event_category: "Performance",
      event_label: "Bundle Size",
      total_size: analysis.totalSize,
      chunk_count: analysis.chunks?.length || 0,
      largest_chunk_size: Math.max(
        ...(analysis.chunks?.map((c) => c.size) || [0])
      ),
    });

    // Check for bundle size issues
    if (analysis.totalSize > 2000000) {
      // 2MB
      this.alerts.push({
        type: "bundle_size",
        severity: "warning",
        message: `Bundle size is large: ${(
          analysis.totalSize /
          1024 /
          1024
        ).toFixed(2)}MB`,
        data: analysis,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Start performance reporting
   */
  startPerformanceReporting() {
    // Generate comprehensive report every 30 minutes
    setInterval(async () => {
      try {
        const report = await this.generatePerformanceReport();
        this.processPerformanceReport(report);
        this.storePerformanceData("comprehensive_report", report);
      } catch (error) {
        console.warn("Performance report generation failed:", error);
      }
    }, 30 * 60 * 1000);
  }

  /**
   * Generate comprehensive performance report
   */
  async generatePerformanceReport() {
    const currentUrl = window.location.href;

    try {
      const result = await this.mcpClient.callTool(
        "generate_performance_report",
        {
          url: currentUrl,
          buildPath: "./dist",
          includeBundleAnalysis: true,
        }
      );
      return result;
    } catch (error) {
      console.warn("Performance report via MCP failed:", error);
      return this.generateFallbackReport();
    }
  }

  /**
   * Generate fallback performance report
   */
  generateFallbackReport() {
    const recentData = this.performanceData.slice(-10); // Last 10 measurements

    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      summary: {
        overallScore: this.calculateOverallScore(recentData),
        status: this.getPerformanceStatus(recentData),
        priority: this.getPriorityLevel(recentData),
      },
      recommendations: this.generateFallbackRecommendations(recentData),
      fallback: true,
    };
  }

  /**
   * Process performance report
   */
  processPerformanceReport(report) {
    // Track report in analytics
    this.analyticsManager.gtag("event", "performance_report", {
      event_category: "Performance",
      event_label: "Comprehensive Report",
      overall_score: report.summary?.overallScore || 0,
      status: report.summary?.status || "unknown",
      priority: report.summary?.priority || "unknown",
      recommendation_count: report.recommendations?.length || 0,
    });

    // Process recommendations
    if (report.recommendations && report.recommendations.length > 0) {
      this.alerts.push({
        type: "performance_recommendations",
        recommendations: report.recommendations,
        report: report,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Setup performance alerts
   */
  setupPerformanceAlerts() {
    // Monitor for critical performance issues
    this.monitorCriticalAlerts();

    // Setup alert notifications (in production, this would send to monitoring service)
    // TODO: Implement alert notification system for production monitoring
    // Performance alert monitoring initialized
  }

  /**
   * Monitor critical alerts
   */
  monitorCriticalAlerts() {
    // Check for critical alerts every minute
    setInterval(() => {
      const criticalAlerts = this.alerts.filter(
        (alert) =>
          alert.severity === "critical" &&
          new Date() - new Date(alert.timestamp) < 5 * 60 * 1000 // Last 5 minutes
      );

      if (criticalAlerts.length > 0) {
        // Critical performance alerts detected

        // Track critical alerts
        this.analyticsManager.gtag("event", "critical_performance_alert", {
          event_category: "Performance",
          event_label: "Critical Alert",
          alert_count: criticalAlerts.length,
          latest_alert: criticalAlerts[criticalAlerts.length - 1].type,
        });
      }
    }, 60 * 1000);
  }

  /**
   * Setup real-time tracking
   */
  setupRealTimeTracking() {
    // Track real-time performance metrics
    this.trackRealTimeMetrics();

    // Monitor user experience in real-time
    this.monitorUserExperience();
  }

  /**
   * Track real-time metrics
   */
  trackRealTimeMetrics() {
    // Monitor page load performance
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType("navigation")[0];
        if (navigation) {
          this.analyticsManager.gtag("event", "page_load_performance", {
            event_category: "Performance",
            event_label: "Real-time Load",
            load_time: navigation.loadEventEnd - navigation.loadEventStart,
            dom_content_loaded:
              navigation.domContentLoadedEventEnd -
              navigation.domContentLoadedEventStart,
            first_paint: this.getFirstPaintTime(),
          });
        }
      }, 0);
    });

    // Monitor memory usage
    if (performance.memory) {
      setInterval(() => {
        this.analyticsManager.gtag("event", "memory_usage", {
          event_category: "Performance",
          event_label: "Memory Monitor",
          used_js_heap_size: performance.memory.usedJSHeapSize,
          total_js_heap_size: performance.memory.totalJSHeapSize,
          js_heap_size_limit: performance.memory.jsHeapSizeLimit,
        });
      }, 60 * 1000); // Every minute
    }
  }

  /**
   * Get first paint time
   */
  getFirstPaintTime() {
    const paintEntries = performance.getEntriesByType("paint");
    const fpEntry = paintEntries.find((entry) => entry.name === "first-paint");
    return fpEntry ? fpEntry.startTime : 0;
  }

  /**
   * Monitor user experience
   */
  monitorUserExperience() {
    // Track long tasks (tasks > 50ms)
    if (window.PerformanceObserver) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            this.analyticsManager.gtag("event", "long_task_detected", {
              event_category: "Performance",
              event_label: "User Experience",
              task_duration: entry.duration,
              task_start_time: entry.startTime,
            });
          }
        }
      });

      longTaskObserver.observe({ entryTypes: ["longtask"] });
    }
  }

  /**
   * Store performance data
   */
  storePerformanceData(type, data) {
    this.performanceData.push({
      type,
      data,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 100 entries
    if (this.performanceData.length > 100) {
      this.performanceData = this.performanceData.slice(-100);
    }

    // Persist to localStorage for debugging
    try {
      localStorage.setItem(
        "performance_monitor_data",
        JSON.stringify(this.performanceData.slice(-20))
      );
    } catch (error) {
      // Silently fail if storage is full
    }
  }

  /**
   * Detect device type
   */
  detectDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return "mobile";
    if (width <= 1024) return "tablet";
    return "desktop";
  }

  /**
   * Calculate overall performance score
   */
  calculateOverallScore(data) {
    if (data.length === 0) return 0;

    const scores = data
      .map((item) => {
        if (item.type === "core_web_vitals") {
          return this.calculateVitalsScore(item.data);
        }
        if (item.type === "lighthouse") {
          return item.data.performance || 0;
        }
        return 0;
      })
      .filter((score) => score > 0);

    return scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length
        )
      : 0;
  }

  /**
   * Calculate Core Web Vitals score
   */
  calculateVitalsScore(vitals) {
    let score = 100;

    // LCP scoring
    if (vitals.lcp > 4000) score -= 30;
    else if (vitals.lcp > 2500) score -= 15;

    // FID scoring
    if (vitals.fid > 300) score -= 30;
    else if (vitals.fid > 100) score -= 15;

    // CLS scoring
    if (vitals.cls > 0.25) score -= 30;
    else if (vitals.cls > 0.1) score -= 15;

    return Math.max(0, score);
  }

  /**
   * Get performance status
   */
  getPerformanceStatus(data) {
    const score = this.calculateOverallScore(data);

    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Needs Improvement";
    return "Poor";
  }

  /**
   * Get priority level
   */
  getPriorityLevel(data) {
    const score = this.calculateOverallScore(data);

    if (score >= 90) return "Low";
    if (score >= 70) return "Medium";
    if (score >= 50) return "High";
    return "Critical";
  }

  /**
   * Generate fallback recommendations
   */
  generateFallbackRecommendations(data) {
    const recommendations = [];

    const recentVitals = data
      .filter((item) => item.type === "core_web_vitals")
      .slice(-5);

    if (recentVitals.length > 0) {
      const avgLcp =
        recentVitals.reduce((sum, item) => sum + item.data.lcp, 0) /
        recentVitals.length;

      if (avgLcp > 3000) {
        recommendations.push({
          type: "lcp_optimization",
          priority: "critical",
          message: "Optimize Largest Contentful Paint",
          details: "Average LCP is above 3 seconds",
        });
      }
    }

    return recommendations;
  }

  /**
   * Fallback monitoring when MCP server is unavailable
   */
  fallbackMonitoring() {
    // Using fallback performance monitoring

    // Basic Core Web Vitals monitoring
    this.startCoreWebVitalsMonitoring();

    // Reduced frequency for other monitoring
    setInterval(() => {
      const report = this.generateFallbackReport();
      this.processPerformanceReport(report);
    }, 60 * 60 * 1000); // Every hour instead of 30 minutes
  }

  /**
   * Get performance monitoring status
   */
  getMonitoringStatus() {
    return {
      initialized: this.isInitialized,
      monitoringActive: this.monitoringActive,
      mcpServerAvailable: false, // Would check server status in production
      dataPoints: this.performanceData.length,
      alertsCount: this.alerts.length,
      lastUpdate:
        this.performanceData.length > 0
          ? this.performanceData[this.performanceData.length - 1].timestamp
          : null,
    };
  }

  /**
   * Export performance data
   */
  exportPerformanceData() {
    return {
      status: this.getMonitoringStatus(),
      performanceData: this.performanceData,
      alerts: this.alerts.slice(-20), // Last 20 alerts
      summary: this.generateFallbackReport(),
    };
  }
}
