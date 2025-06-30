// TODO: [Unsupported Browsers] Implement a robust solution for unsupported browsers (Requirement 3.2)
// Main JavaScript file

import "../css/main.css";
import SiteHeader from "./components/site-header/SiteHeader.js";
import SiteFooter from "./components/site-footer/SiteFooter.js";

// Define the custom elements
if (window.customElements) {
  customElements.define("site-header", SiteHeader);
  customElements.define("site-footer", SiteFooter);
} else {
  console.warn(
    "Custom Elements are not supported in this browser. Site may not render correctly."
  );
  // Optionally, provide fallback rendering or messages here
}

//DOMContentLoaded is no longer needed for the year,
//as it's handled within the SiteFooter component itself.
//Any other global JS can go here or be further modularized.

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

    if (
      body.classList.contains(layoutClass) ||
      body.classList.contains(rhythmClass)
    ) {
      console.log("Debug styles enabled. Press Ctrl+Shift+D to disable.");
    } else {
      console.log("Debug styles disabled. Press Ctrl+Shift+D to enable.");
    }
  }
});
// --- End Debug Styles Toggle ---
