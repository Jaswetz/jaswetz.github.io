// Issue #7: Implement a robust solution for unsupported browsers (Requirement 3.2)
// See: https://github.com/Jaswetz/jaswetz.github.io/issues/7
// Main JavaScript file with Advanced Analytics System

import "../css/main.css";
import "./analytics/index.js";
import "./clarity-config.js";
import SmartImageLoader from "./smart-image-loader.js";
import SiteHeader from "./components/site-header/SiteHeader.js";
import SiteFooter from "./components/site-footer/SiteFooter.js";
import SidebarNavigation from "./components/sidebar-navigation/SidebarNavigation.js";
import ImageLightbox from "./components/ImageLightbox/ImageLightbox.js";

// Define the custom elements
if (window.customElements) {
  // Check if elements are already defined to prevent duplicate registration
  if (!customElements.get("site-header")) {
    customElements.define("site-header", SiteHeader);
  }
  if (!customElements.get("site-footer")) {
    customElements.define("site-footer", SiteFooter);
  }
  if (!customElements.get("image-lightbox")) {
    customElements.define("image-lightbox", ImageLightbox);
  }
} else {
  console.warn(
    "Custom Elements are not supported in this browser. Site may not render correctly."
  );
  // Optionally, provide fallback rendering or messages here
}

//DOMContentLoaded is no longer needed for the year,
//as it's handled within the SiteFooter component itself.
//Any other global JS can go here or be further modularized.

// Initialize sidebar navigation on pages that have it
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".sidebar-nav")) {
    new SidebarNavigation();
  }

  // Add click functionality to the animated 2D logo
  const logo2d = document.querySelector(".logo-2d");
  if (logo2d !== null && logo2d instanceof HTMLElement) {
    // Make the logo clickable by adding cursor pointer style
    logo2d.style.cursor = "pointer";

    // Add click event listener
    logo2d.addEventListener("click", (e) => {
      e.preventDefault();

      // Find the featured projects section
      const featuredProjectsSection =
        document.querySelector("#featured-projects");
      if (featuredProjectsSection instanceof HTMLElement) {
        // Smooth scroll to the featured projects section
        featuredProjectsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Optional: Update URL hash
        window.history.pushState(null, null, "#featured-projects");
      }
    });

    // Add keyboard accessibility (Enter and Space keys)
    logo2d.addEventListener("keydown", (e) => {
      if (e instanceof KeyboardEvent && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        logo2d.click(); // Trigger the click event
      }
    });

    // Make it focusable for keyboard navigation
    logo2d.setAttribute("tabindex", "0");
    logo2d.setAttribute("role", "button");
    logo2d.setAttribute("aria-label", "Scroll to featured projects section");
  }
});

// --- Debug Styles Toggle ---
document.addEventListener("keydown", function (event) {
  // Check for Ctrl+Shift+D
  if (event.ctrlKey && event.shiftKey && event.key === "D") {
    event.preventDefault(); // Prevent default browser action for this shortcut

    const body = document.body;
    const layoutClass = "debug-layout-outlines";
    const rhythmClass = "debug-typographic-rhythm";

    // Toggle layout outlines
    body.classList.toggle(layoutClass);
    // Toggle typographic rhythm
    body.classList.toggle(rhythmClass);

    // Debug styles toggled (silent operation for production)
  }
});
// --- End Debug Styles Toggle ---

// Initialize Smart Image Loader for automatic WebP optimization
const smartImageLoader = new SmartImageLoader();
smartImageLoader.optimizePageImages();

// Initialize Advanced Analytics System
document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("🚀 Initializing Advanced Analytics System...");

    // Import analytics modules dynamically to avoid circular dependencies
    const [
      { ConversionTracker },
      { CrossPlatformIntegration },
      { UserJourneyAnalyzer },
      { UserSegmentation },
      { PerformanceMonitorIntegration },
      { ConversionOptimizationFramework },
      { ABTestingFramework },
      { ConversionDashboard },
    ] = await Promise.all([
      import("./analytics/ConversionTracker.js"),
      import("./analytics/CrossPlatformIntegration.js"),
      import("./analytics/UserJourneyAnalyzer.js"),
      import("./analytics/UserSegmentation.js"),
      import("./analytics/PerformanceMonitorIntegration.js"),
      import("./analytics/ConversionOptimizationFramework.js"),
      import("./analytics/ABTestingFramework.js"),
      import("./analytics/ConversionDashboard.js"),
    ]);

    // Get the main analytics instance
    const { default: analytics } = await import("./analytics/index.js");

    // Initialize core analytics modules
    const conversionTracker = new ConversionTracker(analytics.manager);
    const crossPlatformIntegration = new CrossPlatformIntegration(
      analytics.manager,
      analytics.tracker
    );
    const userJourneyAnalyzer = new UserJourneyAnalyzer(
      analytics.tracker,
      conversionTracker
    );
    const userSegmentation = new UserSegmentation(
      analytics.manager,
      conversionTracker
    );
    const performanceMonitor = new PerformanceMonitorIntegration(
      analytics.manager
    );

    // Initialize optimization framework
    const optimizationFramework = new ConversionOptimizationFramework(
      analytics.manager,
      conversionTracker,
      userJourneyAnalyzer,
      userSegmentation,
      performanceMonitor
    );

    // Initialize A/B testing framework
    const abTestingFramework = new ABTestingFramework(
      analytics.manager,
      conversionTracker
    );

    // Initialize dashboard
    const conversionDashboard = new ConversionDashboard(
      analytics.manager,
      conversionTracker,
      userJourneyAnalyzer,
      userSegmentation,
      performanceMonitor,
      optimizationFramework,
      abTestingFramework
    );

    // Initialize all modules in dependency order
    await Promise.all([
      conversionTracker.initialize?.() || Promise.resolve(),
      crossPlatformIntegration.initialize(),
      userJourneyAnalyzer.initialize(),
      userSegmentation.initialize(),
      performanceMonitor.initialize(),
      optimizationFramework.initialize(),
      abTestingFramework.initialize(),
      conversionDashboard.initialize(),
    ]);

    console.log("✅ Advanced Analytics System initialized successfully!");
    console.log("📊 Use Ctrl+Shift+A to toggle the analytics dashboard");
    console.log("🔧 Debug console: window.analyticsSystem (localhost only)");

    // Make modules globally available for debugging (remove in production)
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      window.analyticsSystem = {
        analytics,
        conversionTracker,
        crossPlatformIntegration,
        userJourneyAnalyzer,
        userSegmentation,
        performanceMonitor,
        optimizationFramework,
        abTestingFramework,
        conversionDashboard,
        // Utility functions
        exportData: () => ({
          journey: userJourneyAnalyzer.exportAnalysisData(),
          segments: userSegmentation.exportSegmentationData(),
          performance: performanceMonitor.exportPerformanceData(),
          recommendations: optimizationFramework.exportFrameworkData(),
          experiments: abTestingFramework.exportTestingData(),
          dashboard: conversionDashboard.exportDashboardData(),
        }),
        resetAll: () => {
          localStorage.clear();
          console.log("All analytics data reset");
        },
      };
    }
  } catch (error) {
    console.warn("⚠️ Failed to initialize Advanced Analytics System:", error);
    console.log(
      "📊 Basic analytics (GA4 + Clarity) will continue to work normally"
    );
    console.log("💡 Check browser console for detailed error information");
  }
});
