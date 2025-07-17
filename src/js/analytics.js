/**
 * Google Analytics 4 Configuration and Custom Event Tracking
 * Measurement ID: G-Z5DNDF44NG
 */

// Check if we're in development environment
const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.includes("127.0.0.1") ||
  window.location.port !== "";

// Initialize Google Analytics 4 only in production or when explicitly enabled
function initializeGA4() {
  if (!isDevelopment || window.location.search.includes("ga=true")) {
    // @ts-ignore - Google Analytics dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      // @ts-ignore - Google Analytics dataLayer
      dataLayer.push(arguments);
    }
    // Make gtag globally available
    // @ts-ignore - Google Analytics gtag
    window.gtag = gtag;

    gtag("js", new Date());

    // Configure GA4 with enhanced measurement
    gtag("config", "G-Z5DNDF44NG", {
      // Enable enhanced measurement features
      enhanced_measurement: true,
      // Track page views automatically
      page_title: document.title,
      page_location: window.location.href,
      // Enable demographic reports (optional)
      allow_ad_personalization_signals: false, // Set to true if you want ad personalization
      // Enable Google Signals for cross-device tracking (optional)
      allow_google_signals: true,
    });

    console.log("Google Analytics 4 initialized");
  } else {
    // Create mock gtag function for development
    // @ts-ignore - Mock function for development
    window.gtag = function () {
      console.log("GA4 (dev mode):", arguments);
    };
    // @ts-ignore - Google Analytics dataLayer
    window.dataLayer = [];
    console.log("Google Analytics disabled in development environment");
  }
}

// Wait for GA4 script to load or initialize immediately if in development
if (!isDevelopment || window.location.search.includes("ga=true")) {
  // Check if GA4 script is already loaded
  // @ts-ignore - Google Analytics gtag
  if (window.gtag) {
    initializeGA4();
  } else {
    // Wait for the GA4 script to load
    const checkGA4 = setInterval(() => {
      // @ts-ignore - Google Analytics gtag
      if (
        window.gtag ||
        document.querySelector("script[src*=\"googletagmanager.com/gtag/js\"]")
      ) {
        clearInterval(checkGA4);
        // Give the script a moment to fully initialize
        setTimeout(initializeGA4, 100);
      }
    }, 100);

    // Fallback: initialize after 2 seconds even if script doesn't load
    setTimeout(() => {
      clearInterval(checkGA4);
      // @ts-ignore - Google Analytics gtag
      if (!window.gtag) {
        console.warn("GA4 script did not load, creating fallback");
        initializeGA4();
      }
    }, 2000);
  }
} else {
  initializeGA4();
}

/**
 * Custom Event Tracking Functions
 */

// Safe gtag wrapper that checks if gtag is available
function safeGtag() {
  // @ts-ignore - Google Analytics gtag
  if (typeof window.gtag === "function") {
    // @ts-ignore - Google Analytics gtag
    return window.gtag.apply(window, arguments);
  } else {
    console.log("GA4 not available, event not tracked:", arguments);
  }
}

// Track project card clicks
function trackProjectClick(projectName, projectType) {
  safeGtag("event", "project_view", {
    event_category: "Projects",
    event_label: projectName,
    project_type: projectType,
    value: 1,
  });
}

// Track resume downloads
function trackResumeDownload() {
  safeGtag("event", "file_download", {
    event_category: "Engagement",
    event_label: "Resume PDF",
    file_name: "Jason Swetzoff - Principal UX Designer - Resume.pdf",
    value: 1,
  });
}

// Track contact form interactions
function trackContactForm(action, method = "") {
  safeGtag("event", action, {
    event_category: "Contact",
    event_label: method,
    value: 1,
  });
}

// Track external link clicks
function trackExternalLink(url, linkText) {
  safeGtag("event", "click", {
    event_category: "External Links",
    event_label: url,
    link_text: linkText,
    value: 1,
  });
}

// Track scroll depth (custom implementation)
let scrollDepthTracked = [];
function trackScrollDepth() {
  const scrollPercent = Math.round(
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
      100
  );

  // Track at 25%, 50%, 75%, and 100%
  const milestones = [25, 50, 75, 100];
  milestones.forEach((milestone) => {
    if (scrollPercent >= milestone && !scrollDepthTracked.includes(milestone)) {
      scrollDepthTracked.push(milestone);
      safeGtag("event", "scroll", {
        event_category: "Engagement",
        event_label: `${milestone}%`,
        value: milestone,
      });
    }
  });
}

// Track time on page
let startTime = Date.now();
function trackTimeOnPage() {
  const timeSpent = Math.round((Date.now() - startTime) / 1000);
  safeGtag("event", "timing_complete", {
    name: "page_view_time",
    value: timeSpent,
  });
}

/**
 * Auto-track common interactions when DOM is ready
 */
document.addEventListener("DOMContentLoaded", function () {
  // Track resume download clicks
  const resumeLinks = document.querySelectorAll(
    "a[href*=\"resume\"], a[href*=\"Resume\"], a[href*=\"cv\"], a[href*=\"CV\"]"
  );
  resumeLinks.forEach((link) => {
    link.addEventListener("click", trackResumeDownload);
  });

  // Track project card clicks
  const projectLinks = document.querySelectorAll(
    ".card__link, .project-card a, a[href*=\"project\"]"
  );
  projectLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const projectName =
        this.querySelector("h3, h2, .card__title")?.textContent ||
        "Unknown Project";
      const href = this.getAttribute("href") || "";
      let projectType = "Other";

      if (href.includes("autodesk")) projectType = "Autodesk";
      else if (href.includes("intel")) projectType = "Intel";
      else if (href.includes("showcase")) projectType = "Showcase";

      trackProjectClick(projectName, projectType);
    });
  });

  // Track external links
  const externalLinks = document.querySelectorAll(
    "a[href^=\"http\"]:not([href*=\"" + window.location.hostname + "\"])"
  );
  externalLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const url = this.getAttribute("href");
      const linkText =
        this.textContent || this.getAttribute("aria-label") || "External Link";
      trackExternalLink(url, linkText);
    });
  });

  // Track scroll depth
  let scrollTimeout;
  window.addEventListener("scroll", function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScrollDepth, 100);
  });

  // Track time on page when user leaves
  window.addEventListener("beforeunload", trackTimeOnPage);

  // Also track time on page for single-page sessions after 30 seconds
  setTimeout(() => {
    if (document.visibilityState === "visible") {
      trackTimeOnPage();
    }
  }, 30000);

  // Track page visibility changes
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      trackTimeOnPage();
    }
  });
});

// Export functions for manual tracking if needed
// @ts-ignore - Custom analytics object
window.portfolioAnalytics = {
  trackProjectClick,
  trackResumeDownload,
  trackContactForm,
  trackExternalLink,
  trackScrollDepth,
  trackTimeOnPage,
};
