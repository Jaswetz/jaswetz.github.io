/**
 * Font Loading Optimization Utilities
 * Implements font-display: swap, preloading, and subset optimization
 */

class FontOptimizer {
  constructor() {
    this.loadedFonts = new Set();
    this.fontLoadPromises = new Map();
    this.init();
  }

  /**
   * Initialize font optimization
   */
  init() {
    // Check if fonts are already loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        this.onFontsReady();
      });
    }

    // Preload critical fonts if not already loaded
    this.preloadCriticalFonts();

    // Set up font loading monitoring
    this.monitorFontLoading();
  }

  /**
   * Preload critical font files for better performance
   */
  preloadCriticalFonts() {
    const criticalFonts = [
      {
        family: "Gentium Plus",
        weight: "400",
        url: "https://fonts.gstatic.com/s/gentiumplus/v6/Iura6YBj_oCad4hzLCCbvw.woff2",
        format: "woff2",
      },
      {
        family: "Laila",
        weight: "400",
        url: "https://fonts.gstatic.com/s/laila/v13/LYjMdG_8nE8jDIRdiidIrEIu.woff2",
        format: "woff2",
      },
      {
        family: "PT Sans",
        weight: "400",
        url: "https://fonts.gstatic.com/s/ptsans/v17/jizaRExUiTo99u79D0KExcOPIDU.woff2",
        format: "woff2",
      },
    ];

    criticalFonts.forEach((font) => {
      this.preloadFont(font);
    });
  }

  /**
   * Preload a specific font file
   * @param {Object} font - Font configuration object
   */
  preloadFont(font) {
    const fontKey = `${font.family}-${font.weight}`;

    if (this.loadedFonts.has(fontKey)) {
      return Promise.resolve();
    }

    // Check if preload link already exists
    const existingPreload = document.querySelector(
      `link[rel="preload"][href="${font.url}"]`
    );

    if (existingPreload) {
      return Promise.resolve();
    }

    // Create preload link
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    link.type = `font/${font.format}`;
    link.href = font.url;
    link.crossOrigin = "anonymous";

    // Add to document head
    document.head.appendChild(link);

    // Create font loading promise
    const fontLoadPromise = new Promise((resolve, reject) => {
      const fontFace = new FontFace(font.family, `url(${font.url})`, {
        weight: font.weight,
        display: "swap",
      });

      fontFace
        .load()
        .then((loadedFont) => {
          document.fonts.add(loadedFont);
          this.loadedFonts.add(fontKey);
          resolve(loadedFont);
        })
        .catch((error) => {
          console.warn(`Failed to load font ${font.family}:`, error);
          reject(error);
        });
    });

    this.fontLoadPromises.set(fontKey, fontLoadPromise);
    return fontLoadPromise;
  }

  /**
   * Load font subset based on page content
   * @param {string} text - Text content to analyze
   * @param {string} fontFamily - Font family to optimize
   */
  loadFontSubset(text, fontFamily) {
    // Get unique characters from text
    const uniqueChars = [...new Set(text)].join("");

    // Create subset URL (this would typically use a font subsetting service)
    const subsetUrl = this.generateSubsetUrl(fontFamily, uniqueChars);

    if (subsetUrl) {
      this.preloadFont({
        family: fontFamily,
        weight: "400",
        url: subsetUrl,
        format: "woff2",
      });
    }
  }

  /**
   * Generate font subset URL (placeholder for actual subsetting service)
   * @param {string} fontFamily - Font family name
   * @param {string} chars - Characters to include in subset
   * @returns {string|null} Subset URL or null if not supported
   */
  generateSubsetUrl(fontFamily, chars) {
    // This would integrate with a font subsetting service like Google Fonts
    // For now, return null as we're using the full Google Fonts
    return null;
  }

  /**
   * Monitor font loading performance
   */
  monitorFontLoading() {
    if (!window.performance || !window.performance.mark) {
      return;
    }

    // Mark font loading start
    performance.mark("font-loading-start");

    // Monitor when fonts are ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        performance.mark("font-loading-end");

        try {
          performance.measure(
            "font-loading-duration",
            "font-loading-start",
            "font-loading-end"
          );

          const measure = performance.getEntriesByName(
            "font-loading-duration"
          )[0];
          if (measure && measure.duration > 1000) {
            console.warn(
              `Font loading took ${Math.round(measure.duration)}ms - consider optimizing`
            );
          }
        } catch (error) {
          // Ignore measurement errors
        }
      });
    }
  }

  /**
   * Handle fonts ready event
   */
  onFontsReady() {
    // Add class to body to indicate fonts are loaded
    document.body.classList.add("fonts-loaded");

    // Dispatch custom event
    const event = new CustomEvent("fontsloaded", {
      detail: {
        loadedFonts: Array.from(this.loadedFonts),
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Get font loading status
   * @returns {Object} Font loading status
   */
  getStatus() {
    return {
      loadedFonts: Array.from(this.loadedFonts),
      pendingFonts: Array.from(this.fontLoadPromises.keys()).filter(
        (key) => !this.loadedFonts.has(key)
      ),
      isReady: document.fonts ? document.fonts.status === "loaded" : false,
    };
  }

  /**
   * Wait for all critical fonts to load
   * @returns {Promise} Promise that resolves when critical fonts are loaded
   */
  async waitForCriticalFonts() {
    const criticalFontPromises = Array.from(this.fontLoadPromises.values());

    try {
      await Promise.allSettled(criticalFontPromises);
    } catch (error) {
      console.warn("Some fonts failed to load:", error);
    }
  }
}

// Create global font optimizer instance
const fontOptimizer = new FontOptimizer();

// Export for use in other modules
export { FontOptimizer, fontOptimizer };

// Add to global scope for legacy compatibility
if (typeof window !== "undefined") {
  window.fontOptimizer = fontOptimizer;
}
