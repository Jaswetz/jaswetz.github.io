/**
 * Microsoft Clarity Integration
 *
 * Microsoft Clarity provides heatmaps, session recordings, and user behavior insights.
 *
 * Setup Instructions:
 * 1. Sign up for Microsoft Clarity at https://clarity.microsoft.com/
 * 2. Create a new project for your website
 * 3. Replace 'YOUR_CLARITY_PROJECT_ID' below with your actual project ID
 * 4. The script will automatically start collecting data
 *
 * Features enabled:
 * - Heatmaps: Visual representation of user clicks and scrolling
 * - Session recordings: Watch user sessions to understand behavior
 * - User insights: Demographics and device information
 * - Performance metrics: Page load times and user experience data
 */

// Microsoft Clarity tracking code with error handling
(function (c, l, a, r, i, t, y) {
  // Only load Clarity in production (not localhost or dev environments)
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("local")
  ) {
    console.log("Clarity disabled in development environment");
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

  // Add error handling for script loading
  t.onerror = function () {
    console.warn(
      "Microsoft Clarity script failed to load - this is normal in development or with ad blockers"
    );
  };

  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "s7dys3l8mm");

/**
 * Custom Clarity Event Tracking
 * Use these functions to track specific user interactions
 */

// Track custom events in Clarity
function trackClarityEvent(eventName, eventData = {}) {
  // @ts-ignore - Clarity is dynamically loaded
  if (typeof window.clarity === "function") {
    // @ts-ignore - Clarity is dynamically loaded
    window.clarity("event", eventName, eventData);
  } else {
    console.log("Clarity event tracked (dev mode):", eventName, eventData);
  }
}

// Track project interactions
function trackProjectInteraction(projectName, interactionType) {
  trackClarityEvent("project_interaction", {
    project: projectName,
    interaction: interactionType,
    timestamp: new Date().toISOString(),
  });
}

// Track resume downloads
function trackResumeDownloadClarity() {
  trackClarityEvent("resume_download", {
    source: "portfolio_website",
    timestamp: new Date().toISOString(),
  });
}

// Track contact form interactions
function trackContactFormClarity(action) {
  trackClarityEvent("contact_form", {
    action: action, // 'opened', 'filled', 'submitted'
    timestamp: new Date().toISOString(),
  });
}

// Track navigation behavior
function trackNavigationClarity(page, source) {
  trackClarityEvent("navigation", {
    destination: page,
    source: source,
    timestamp: new Date().toISOString(),
  });
}

// Set user identifiers (optional - use for logged-in users)
function setClarityUserID(userID) {
  // @ts-ignore - Clarity is dynamically loaded
  if (typeof window.clarity === "function") {
    // @ts-ignore - Clarity is dynamically loaded
    window.clarity("identify", userID);
  } else {
    console.log("Clarity user ID set (dev mode):", userID);
  }
}

// Tag users with custom attributes
function tagClarityUser(key, value) {
  // @ts-ignore - Clarity is dynamically loaded
  if (typeof window.clarity === "function") {
    // @ts-ignore - Clarity is dynamically loaded
    window.clarity("set", key, value);
  } else {
    console.log("Clarity user tagged (dev mode):", key, value);
  }
}

// Export functions for use in other scripts
if (typeof window !== "undefined") {
  // @ts-ignore - Adding custom properties to window
  window.clarityTracking = {
    trackEvent: trackClarityEvent,
    trackProject: trackProjectInteraction,
    trackResume: trackResumeDownloadClarity,
    trackContact: trackContactFormClarity,
    trackNavigation: trackNavigationClarity,
    setUserID: setClarityUserID,
    tagUser: tagClarityUser,
  };
}

// Initialize Clarity with basic page information
document.addEventListener("DOMContentLoaded", function () {
  // Tag the current page
  tagClarityUser("page_type", document.body.dataset.pageType || "unknown");

  // Tag the user type (you can customize this logic)
  tagClarityUser("user_type", "visitor");

  // Track initial page load
  trackClarityEvent("page_load", {
    page: document.title,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  });
});

console.log("Microsoft Clarity integration loaded successfully");
