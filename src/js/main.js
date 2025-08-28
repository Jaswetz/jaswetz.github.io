// Issue #7: Implement a robust solution for unsupported browsers (Requirement 3.2)
// See: https://github.com/Jaswetz/jaswetz.github.io/issues/7
// Main JavaScript file

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
