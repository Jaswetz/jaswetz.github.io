// Microsoft Clarity tracking code
(function (c, l, a, r, i, t, y) {
  // Only load in production
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.port !== ""
  ) {
    c[a] = () => {};
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
  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "s7dys3l8mm");

// Basic Clarity event tracking
function trackClarityEvent(eventName, eventData = {}) {
  if (typeof window.clarity === "function") {
    window.clarity("event", eventName, eventData);
  }
}

// Export for use in other scripts
if (typeof window !== "undefined") {
  window.clarityTracking = { trackEvent: trackClarityEvent };
}
