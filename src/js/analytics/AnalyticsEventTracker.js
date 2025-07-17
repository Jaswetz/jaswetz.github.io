/**
 * Analytics Event Tracker - Handles custom event tracking
 * Works with AnalyticsManager to provide clean event tracking API
 */

export class AnalyticsEventTracker {
  constructor(analyticsManager) {
    this.analytics = analyticsManager;
    this.scrollDepthTracked = [];
    this.startTime = Date.now();
    this.isAutoTrackingEnabled = false;
  }

  /**
   * Track project card clicks
   * @param {string} projectName - Name of the project
   * @param {string} projectType - Type/category of the project
   */
  trackProjectClick(projectName, projectType) {
    this.analytics.gtag("event", "project_view", {
      event_category: "Projects",
      event_label: projectName,
      project_type: projectType,
      value: 1,
    });
  }

  /**
   * Track resume downloads
   */
  trackResumeDownload() {
    this.analytics.gtag("event", "file_download", {
      event_category: "Engagement",
      event_label: "Resume PDF",
      file_name: "Jason Swetzoff - Principal UX Designer - Resume.pdf",
      value: 1,
    });
  }

  /**
   * Track contact form interactions
   * @param {string} action - The action taken (form_start, form_submit, etc.)
   * @param {string} method - The contact method used (email, phone, etc.)
   */
  trackContactForm(action, method = "") {
    this.analytics.gtag("event", action, {
      event_category: "Contact",
      event_label: method,
      value: 1,
    });
  }

  /**
   * Track external link clicks
   * @param {string} url - The external URL clicked
   * @param {string} linkText - The text of the link
   */
  trackExternalLink(url, linkText) {
    this.analytics.gtag("event", "click", {
      event_category: "External Links",
      event_label: url,
      link_text: linkText,
      value: 1,
    });
  }

  /**
   * Track scroll depth (custom implementation)
   */
  trackScrollDepth() {
    const scrollPercent = Math.round(
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
        100
    );

    // Track at 25%, 50%, 75%, and 100%
    const milestones = [25, 50, 75, 100];
    milestones.forEach((milestone) => {
      if (scrollPercent >= milestone && !this.scrollDepthTracked.includes(milestone)) {
        this.scrollDepthTracked.push(milestone);
        this.analytics.gtag("event", "scroll", {
          event_category: "Engagement",
          event_label: `${milestone}%`,
          value: milestone,
        });
      }
    });
  }

  /**
   * Track time spent on page
   */
  trackTimeOnPage() {
    const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
    this.analytics.gtag("event", "timing_complete", {
      name: "page_view_time",
      value: timeSpent,
    });
  }

  /**
   * Reset scroll depth tracking (useful for SPA navigation)
   */
  resetScrollDepthTracking() {
    this.scrollDepthTracked = [];
  }

  /**
   * Reset time tracking (useful for SPA navigation)
   */
  resetTimeTracking() {
    this.startTime = Date.now();
  }

  /**
   * Enable automatic tracking of common interactions
   */
  enableAutoTracking() {
    if (this.isAutoTrackingEnabled) {
      console.warn("Auto-tracking is already enabled");
      return;
    }

    this.isAutoTrackingEnabled = true;

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this._setupAutoTracking();
      });
    } else {
      this._setupAutoTracking();
    }
  }

  /**
   * Set up automatic tracking listeners
   * @private
   */
  _setupAutoTracking() {
    // Track resume download clicks
    const resumeLinks = document.querySelectorAll(
      "a[href*=\"resume\"], a[href*=\"Resume\"], a[href*=\"cv\"], a[href*=\"CV\"]"
    );
    resumeLinks.forEach((link) => {
      link.addEventListener("click", () => this.trackResumeDownload());
    });

    // Track project card clicks
    const projectLinks = document.querySelectorAll(
      ".card__link, .project-card a, a[href*=\"project\"]"
    );
    projectLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const projectName =
          link.querySelector("h3, h2, .card__title")?.textContent ||
          "Unknown Project";
        const href = link.getAttribute("href") || "";
        let projectType = "Other";

        if (href.includes("autodesk")) projectType = "Autodesk";
        else if (href.includes("intel")) projectType = "Intel";
        else if (href.includes("showcase")) projectType = "Showcase";

        this.trackProjectClick(projectName, projectType);
      });
    });

    // Track external links
    const externalLinks = document.querySelectorAll(
      `a[href^="http"]:not([href*="${window.location.hostname}"])`
    );
    externalLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const url = link.getAttribute("href");
        const linkText = link.textContent || link.getAttribute("aria-label") || "External Link";
        this.trackExternalLink(url, linkText);
      });
    });

    // Track scroll depth (debounced)
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => this.trackScrollDepth(), 100);
    });

    // Track time on page when user leaves
    window.addEventListener("beforeunload", () => this.trackTimeOnPage());

    // Track time on page for single-page sessions after 30 seconds
    setTimeout(() => {
      if (document.visibilityState === "visible") {
        this.trackTimeOnPage();
      }
    }, 30000);

    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.trackTimeOnPage();
      }
    });

    console.log("Analytics auto-tracking enabled");
  }

  /**
   * Disable automatic tracking
   */
  disableAutoTracking() {
    this.isAutoTrackingEnabled = false;
    // Note: This doesn't remove existing listeners, just prevents new ones
    // For full cleanup, we'd need to store listener references
    console.log("Analytics auto-tracking disabled");
  }
}
