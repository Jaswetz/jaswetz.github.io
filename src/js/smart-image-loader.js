/**
 * Smart Image Path Utility
 * Automatically uses optimized images when available
 */

class SmartImageLoader {
  constructor() {
    this.optimizedBasePath = "./img/";
    this.webpBasePath = "./img/webp/";
    this.fallbackBasePath = "./img/";
  }

  /**
   * Get the best available image path
   * @param {string} imagePath - Original image path
   * @param {boolean} preferWebP - Whether to prefer WebP format
   * @returns {Promise<string>} - Best available image path
   */
  async getBestImagePath(imagePath, preferWebP = true) {
    // Remove leading ./ if present
    const cleanPath = imagePath.replace(/^\.\/img\//, "");

    // Try WebP first if supported and preferred
    if (preferWebP && this.supportsWebP()) {
      const webpPath =
        this.webpBasePath + cleanPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      if (await this.imageExists(webpPath)) {
        return webpPath;
      }
    }

    // Try optimized version
    const optimizedPath = this.optimizedBasePath + cleanPath;
    if (await this.imageExists(optimizedPath)) {
      return optimizedPath;
    }

    // Fall back to original
    return this.fallbackBasePath + cleanPath;
  }

  /**
   * Check if an image exists
   * @param {string} imagePath
   * @returns {Promise<boolean>}
   */
  async imageExists(imagePath) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imagePath;
    });
  }

  /**
   * Check WebP support
   * @returns {boolean}
   */
  supportsWebP() {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }

  /**
   * Update all images on the page to use optimized versions
   */
  async optimizePageImages() {
    const images = document.querySelectorAll("img[src*=\"./img/\"]");
    const promises = Array.from(images).map(async (img) => {
      const imageElement = /** @type {HTMLImageElement} */ (img);
      const originalSrc = imageElement.src;
      const relativePath = originalSrc.replace(window.location.origin, "");
      const optimizedPath = await this.getBestImagePath(relativePath);

      if (optimizedPath !== relativePath) {
        imageElement.src = optimizedPath;
        // Image optimized silently for production performance
      }
    });

    await Promise.all(promises);
  }
}

// Auto-initialize and optimize images
if (typeof window !== "undefined") {
  const smartLoader = new SmartImageLoader();

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      smartLoader.optimizePageImages();
    });
  } else {
    smartLoader.optimizePageImages();
  }

  // Make available globally
  /** @type {any} */ (window).smartImageLoader = smartLoader;
}

export default SmartImageLoader;
