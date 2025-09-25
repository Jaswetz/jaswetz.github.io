/**
 * Minimal Image Loader - Lightweight lazy loading
 * Target size: <2KB, essential features only
 */

class EnhancedImageLoader {
  constructor() {
    this.observer = null;
    this.loadedImages = new Set();
    this.webpSupported = null;
    this.initIntersectionObserver();
  }

  initIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.loadedImages.has(entry.target)) {
            this.loadImage(entry.target);
          }
        });
      },
      { rootMargin: '50px 0px', threshold: 0.1 }
    );
  }

  supportsWebP() {
    if (this.webpSupported !== null) {
      return this.webpSupported;
    }

    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this.webpSupported = webP.height === 2;
        resolve(this.webpSupported);
      };
      webP.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  async loadImage(img) {
    if (!(img instanceof HTMLImageElement)) {
      return;
    }

    const originalSrc = img.dataset.src || img.src;
    if (!originalSrc) {
      return;
    }

    try {
      img.classList.add('loading');

      let finalSrc = originalSrc;
      const isSvg = /\.svg$/i.test(originalSrc);

      // Try WebP for non-SVG images
      if (!isSvg && (await this.supportsWebP())) {
        const webpSrc = originalSrc
          .replace(/^(.*\/img\/)/, '$1webp/')
          .replace(/\.(jpg|jpeg|png)$/i, '.webp');
        if (await this.imageExists(webpSrc)) {
          finalSrc = webpSrc;
        }
      }

      img.onload = () => {
        img.classList.remove('loading');
        img.classList.add('loaded');
      };
      img.onerror = () => {
        img.src = originalSrc;
        img.classList.remove('loading');
        img.classList.add('error');
      };

      img.src = finalSrc;
      this.loadedImages.add(img);
    } catch (error) {
      console.warn('Failed to load image:', originalSrc, error);
      img.src = originalSrc;
      img.classList.remove('loading');
      img.classList.add('error');
    }
  }

  imageExists(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      if (this.observer) {
        this.observer.observe(img);
      } else {
        this.loadImage(img);
      }
    });
  }

  preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('img[data-critical]');
    criticalImages.forEach(img => {
      if (img instanceof HTMLImageElement) {
        this.loadImage(img);
      }
    });
  }

  init() {
    this.preloadCriticalImages();
    this.setupLazyLoading();
    this.addLoadingStyles();
  }

  addLoadingStyles() {
    if (document.getElementById('enhanced-image-loader-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'enhanced-image-loader-styles';
    style.textContent = `
      img.loading { opacity: 0; transition: opacity 0.3s ease-in-out; }
      img.loaded { opacity: 1; }
      img.error { opacity: 0.7; filter: grayscale(100%); }
      @media (prefers-reduced-motion: reduce) { img.loading { transition: none; } }
    `;
    document.head.appendChild(style);
  }

  getStats() {
    return {
      loadedImages: this.loadedImages.size,
      webpSupported: this.webpSupported,
      observerSupported: !!this.observer,
    };
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  const enhancedLoader = new EnhancedImageLoader();

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      enhancedLoader.init();
    });
  } else {
    enhancedLoader.init();
  }

  // Make available globally
  window.enhancedImageLoader = enhancedLoader;
}

export default EnhancedImageLoader;
