/**
 * Lazy Loading Utility
 * Provides intersection observer-based lazy loading for images and other content
 */

class LazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: "50px 0px",
      threshold: 0.01,
      enableWebP: true,
      loadingClass: "loading",
      loadedClass: "loaded",
      errorClass: "error",
      ...options
    };

    this.observer = null;
    this.init();
  }

  init() {
    // Check for Intersection Observer support
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: this.options.rootMargin,
          threshold: this.options.threshold
        }
      );
      
      this.observeImages();
      this.observeContent();
    } else {
      // Fallback for browsers without Intersection Observer
      this.loadAllImages();
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        if (element.tagName === "IMG") {
          this.loadImage(element);
        } else {
          this.loadContent(element);
        }
        
        this.observer.unobserve(element);
      }
    });
  }

  observeImages() {
    const lazyImages = document.querySelectorAll("img[data-src], img[data-srcset]");
    lazyImages.forEach(img => {
      img.classList.add(this.options.loadingClass);
      this.observer.observe(img);
    });
  }

  observeContent() {
    const lazyContent = document.querySelectorAll("[data-lazy-load]");
    lazyContent.forEach(element => {
      this.observer.observe(element);
    });
  }

  loadImage(img) {
    return new Promise((resolve, reject) => {
      // Create a new image to test loading
      const imageLoader = new Image();
      
      imageLoader.onload = () => {
        // Check if WebP is supported and we have WebP source
        if (this.options.enableWebP && this.supportsWebP() && img.dataset.webp) {
          img.src = img.dataset.webp;
        } else if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        
        // Update classes
        img.classList.remove(this.options.loadingClass);
        img.classList.add(this.options.loadedClass);
        
        // Add fade-in animation
        img.style.opacity = "0";
        img.style.transition = "opacity 0.3s ease-in-out";
        
        requestAnimationFrame(() => {
          img.style.opacity = "1";
        });
        
        resolve(img);
      };
      
      imageLoader.onerror = () => {
        img.classList.remove(this.options.loadingClass);
        img.classList.add(this.options.errorClass);
        reject(new Error(`Failed to load image: ${img.dataset.src}`));
      };
      
      // Start loading
      imageLoader.src = this.options.enableWebP && this.supportsWebP() && img.dataset.webp 
        ? img.dataset.webp 
        : img.dataset.src;
    });
  }

  loadContent(element) {
    element.classList.add(this.options.loadedClass);
    
    // Trigger custom event
    const event = new CustomEvent("lazyContentLoaded", {
      detail: { element }
    });
    element.dispatchEvent(event);
  }

  loadAllImages() {
    // Fallback for browsers without Intersection Observer
    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach(img => {
      const imageElement = /** @type {HTMLImageElement} */ (img);
      if (imageElement.dataset.src) {
        imageElement.src = imageElement.dataset.src;
      }
      if (imageElement.dataset.srcset) {
        imageElement.srcset = imageElement.dataset.srcset;
      }
      imageElement.classList.add(this.options.loadedClass);
    });
  }

  supportsWebP() {
    if (this._webpSupport !== undefined) {
      return this._webpSupport;
    }
    
    // Create a tiny WebP image to test support
    const webpData = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = img.onerror = () => {
        this._webpSupport = img.width === 1;
        resolve(this._webpSupport);
      };
      img.src = webpData;
    });
  }

  // Public methods
  refresh() {
    // Re-observe any new images that may have been added to the DOM
    this.observeImages();
    this.observeContent();
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Auto-initialize if not in module environment
if (typeof window !== "undefined" && !/** @type {any} */(window).lazyLoader) {
  /** @type {any} */(window).lazyLoader = new LazyLoader();
  
  // Re-initialize on dynamic content changes
  document.addEventListener("DOMContentLoaded", () => {
    /** @type {any} */(window).lazyLoader.refresh();
  });
}

// Export for module environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = LazyLoader;
}

export default LazyLoader;
