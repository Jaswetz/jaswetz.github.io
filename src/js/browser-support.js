/**
 * Browser support detection and warning system
 * Checks for Web Components support and displays warning for unsupported browsers
 */

// Feature detection for Web Components APIs
function checkWebComponentsSupport() {
  const hasCustomElements = "customElements" in window;
  const hasShadowDOM = "attachShadow" in Element.prototype;
  const hasTemplates = "content" in document.createElement("template");

  return hasCustomElements && hasShadowDOM && hasTemplates;
}

// Display browser warning
function showBrowserWarning() {
  const warningHTML = `
    <div id="browser-warning" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ffeb3b;
      color: #333;
      padding: 12px;
      text-align: center;
      z-index: 10000;
      border-bottom: 2px solid #ffc107;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <strong>Browser Compatibility Notice:</strong> 
      This website uses modern web technologies that may not be fully supported in your browser. 
      For the best experience, please consider updating your browser or using a modern alternative.
      <button onclick="document.getElementById('browser-warning').style.display='none'" 
              style="margin-left: 10px; padding: 4px 8px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Continue Anyway
      </button>
    </div>
  `;

  document.body.insertAdjacentHTML("afterbegin", warningHTML);
}

// Initialize browser support check
function initBrowserSupport() {
  if (!checkWebComponentsSupport()) {
    console.warn("Web Components not fully supported in this browser");
    showBrowserWarning();
  }
}

// Run check when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBrowserSupport);
} else {
  initBrowserSupport();
}

export { checkWebComponentsSupport, showBrowserWarning };
