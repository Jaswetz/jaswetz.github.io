/**
 * Enhanced Image Loader with Intersection Observer Lazy Loading
 * Provides progressive enhancement with WebP support and performance optimization
 */

class EnhancedImageLoader {
  constructor() {
    this.observer = null;
    this.loadedImages = new Set();
    this.webpSupported = null;
    this.initIntersectionObserver();
  }

  /**
   * Initialize Intersection Observer for lazy loading
   */
  initIntersectionObserver() {
    if (!("IntersectionObserver" in window)) {
      console.warn(
        "IntersectionObserver not supported, falling back to immediate loading"
      );
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.loadedImages.has(entry.target)) {
            this.loadImage(entry.target);
          }
        });
      },
      {
        rootMargin: "50px 0px", // Start loading 50px before image enters viewport
        threshold: 0.1,
      }
    );
  }

  /**
   * Check WebP support with better detection
   */
  async supportsWebP() {
    if (this.webpSupported !== null) {
      return this.webpSupported;
    }

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this.webpSupported = webP.height === 2;
        resolve(this.webpSupported);
      };
      webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    });
  }

  /**
   * Generate source set for responsive images
   */
  generateSourceSet(src, sizes = ["small", "medium", "large"]) {
    const sources = [];
    const baseName = src.replace(/\.(jpg|jpeg|png)$/i, "");

    sizes.forEach((size) => {
      // Try WebP first
      sources.push(
        `${baseName}-${size}.webp ${
          size === "small" ? "480w" : size === "medium" ? "768w" : "1200w"
        }`
      );

      // Fallback to original format
      sources.push(
        `${baseName}-${size}.jpg ${
          size === "small" ? "480w" : size === "medium" ? "768w" : "1200w"
        }`
      );
    });

    return sources.join(", ");
  }

  /**
   * Load image with progressive enhancement
   */
  async loadImage(img) {
    if (!(img instanceof HTMLImageElement)) return;

    const originalSrc = img.dataset.src || img.src;
    if (!originalSrc) return;

    try {
      // Add loading class for CSS transitions
      img.classList.add("loading");

      // Determine best image format
      const webpSupported = await this.supportsWebP();
      let finalSrc = originalSrc;

      if (webpSupported) {
        const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, ".webp");
        // Check if WebP version exists
        if (await this.imageExists(webpSrc)) {
          finalSrc = webpSrc;
        }
      }

      // Set up responsive image sources if available
      if (img.dataset.sizes) {
        const picture = document.createElement("picture");
        const source = document.createElement("source");

        source.srcset = this.generateSourceSet(finalSrc);
        source.sizes = img.dataset.sizes;

        picture.appendChild(source);
        picture.appendChild(img.cloneNode(true));

        img.parentNode.replaceChild(picture, img);
        img = picture.querySelector("img");
      }

      // Load the image
      const imagePromise = new Promise((resolve, reject) => {
        img.onload = () => {
          img.classList.remove("loading");
          img.classList.add("loaded");
          resolve();
        };
        img.onerror = reject;
      });

      img.src = finalSrc;
      await imagePromise;

      this.loadedImages.add(img);
    } catch (error) {
      console.warn("Failed to load image:", originalSrc, error);
      // Fallback to original src
      img.src = originalSrc;
      img.classList.remove("loading");
      img.classList.add("error");
    }
  }

  /**
   * Check if image exists
   */
  async imageExists(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  /**
   * Set up lazy loading for images
   */
  setupLazyLoading() {
    const lazyImages = document.querySelectorAll("img[data-src]");

    lazyImages.forEach((img) => {
      if (this.observer) {
        this.observer.observe(img);
      } else {
        // Fallback for browsers without IntersectionObserver
        this.loadImage(img);
      }
    });
  }

  /**
   * Preload critical images above the fold
   */
  preloadCriticalImages() {
    const criticalImages = document.querySelectorAll("img[data-critical]");

    criticalImages.forEach((img) => {
      if (img instanceof HTMLImageElement) {
        this.loadImage(img);
      }
    });
  }

  /**
   * Initialize the enhanced image loader
   */
  init() {
    // Preload critical images immediately
    this.preloadCriticalImages();

    // Set up lazy loading for non-critical images
    this.setupLazyLoading();

    // Add CSS for loading states
    this.addLoadingStyles();
  }

  /**
   * Add CSS for loading states
   */
  addLoadingStyles() {
    if (document.getElementById("enhanced-image-loader-styles")) return;

    const style = document.createElement("style");
    style.id = "enhanced-image-loader-styles";
    style.textContent = `
      img.loading {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
      img.loaded {
        opacity: 1;
      }
      img.error {
        opacity: 0.7;
        filter: grayscale(100%);
      }
      @media (prefers-reduced-motion: reduce) {
        img.loading {
          transition: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Get loading statistics
   */
  getStats() {
    return {
      loadedImages: this.loadedImages.size,
      webpSupported: this.webpSupported,
      observerSupported: !!this.observer,
    };
  }
}

// Auto-initialize
if (typeof window !== "undefined") {
  const enhancedLoader = new EnhancedImageLoader();

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      enhancedLoader.init();
    });
  } else {
    enhancedLoader.init();
  }

  // Make available globally
  window.enhancedImageLoader = enhancedLoader;
}

export default EnhancedImageLoader;
