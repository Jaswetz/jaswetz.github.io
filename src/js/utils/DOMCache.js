/**
 * DOM Query Cache Utility
 * Caches DOM query results and automatically invalidates when DOM changes
 * Reduces repeated querySelectorAll calls for better performance
 */

import logger from "./Logger.js";

class DOMCache {
  constructor() {
    this.cache = new Map();
    this.observers = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      invalidations: 0,
    };

    logger.debug("DOMCache initialized");
  }

  /**
   * Query DOM with caching
   * @param {string} selector - CSS selector
   * @param {Element|Document} context - Context element (default: document)
   * @param {Object} options - Query options
   * @param {boolean} options.live - Whether to keep cache live with DOM changes
   * @param {number} options.ttl - Time to live in milliseconds
   * @returns {NodeList} Cached or fresh query results
   */
  query(selector, context = document, options = {}) {
    const { live = true, ttl = 0 } = options;
    const key = this.generateKey(selector, context);

    // Check if we have a cached result
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached, ttl)) {
      this.stats.hits++;
      logger.debug(`DOMCache: Cache hit for "${selector}"`);
      return cached.elements;
    }

    // Cache miss - perform fresh query
    this.stats.misses++;
    logger.debug(`DOMCache: Cache miss for "${selector}"`);

    const elements = context.querySelectorAll(selector);
    const cacheEntry = {
      elements,
      timestamp: Date.now(),
      selector,
      context,
      live,
    };

    this.cache.set(key, cacheEntry);

    // Set up mutation observer for live caching
    if (live) {
      this.setupObserver(context, key);
    }

    return elements;
  }

  /**
   * Query single element with caching
   * @param {string} selector - CSS selector
   * @param {Element|Document} context - Context element
   * @param {Object} options - Query options
   * @returns {Element|null} Cached or fresh query result
   */
  queryOne(selector, context = document, options = {}) {
    const key = this.generateKey(selector + ":first", context);
    const { live = true, ttl = 0 } = options;

    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached, ttl)) {
      this.stats.hits++;
      return cached.element;
    }

    this.stats.misses++;
    const element = context.querySelector(selector);
    const cacheEntry = {
      element,
      timestamp: Date.now(),
      selector,
      context,
      live,
    };

    this.cache.set(key, cacheEntry);

    if (live) {
      this.setupObserver(context, key);
    }

    return element;
  }

  /**
   * Generate cache key
   * @param {string} selector - CSS selector
   * @param {Element|Document} context - Context element
   * @returns {string} Cache key
   */
  generateKey(selector, context) {
    const contextId =
      context === document
        ? "document"
        : context.tagName +
          (context.id ? `#${context.id}` : "") +
          (context.className
            ? `.${context.className.split(" ").join(".")}`
            : "");

    return `${selector}::${contextId}`;
  }

  /**
   * Check if cache entry is valid
   * @param {Object} cacheEntry - Cache entry to validate
   * @param {number} ttl - Time to live in milliseconds
   * @returns {boolean} Whether cache is valid
   */
  isCacheValid(cacheEntry, ttl) {
    if (ttl > 0) {
      const age = Date.now() - cacheEntry.timestamp;
      return age < ttl;
    }
    return true; // No TTL means cache is always valid until invalidated
  }

  /**
   * Set up mutation observer for context
   * @param {Element|Document} context - Context to observe
   */
  setupObserver(context) {
    // Don't create duplicate observers for the same context
    if (this.observers.has(context)) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      let shouldInvalidate = false;

      for (const mutation of mutations) {
        // Check if changes affect our cached queries
        if (
          mutation.type === "childList" ||
          mutation.type === "attributes" ||
          mutation.type === "characterData"
        ) {
          shouldInvalidate = true;
          break;
        }
      }

      if (shouldInvalidate) {
        this.invalidateContext(context);
      }
    });

    observer.observe(context, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "id", "data-*"],
      characterData: false,
    });

    this.observers.set(context, observer);
    logger.debug(
      `DOMCache: Set up observer for context ${context.tagName || "document"}`
    );
  }

  /**
   * Invalidate specific cache entry
   * @param {string} selector - CSS selector
   * @param {Element|Document} context - Context element
   */
  invalidate(selector, context = document) {
    const key = this.generateKey(selector, context);
    const deleted = this.cache.delete(key);

    if (deleted) {
      this.stats.invalidations++;
      logger.debug(`DOMCache: Invalidated cache for "${selector}"`);
    }
  }

  /**
   * Invalidate all cache entries for a context
   * @param {Element|Document} context - Context to invalidate
   */
  invalidateContext(context) {
    const contextId = context === document ? "document" : context.tagName;
    let invalidatedCount = 0;

    for (const [key] of this.cache) {
      if (key.includes(`::${contextId}`)) {
        this.cache.delete(key);
        invalidatedCount++;
      }
    }

    if (invalidatedCount > 0) {
      this.stats.invalidations += invalidatedCount;
      logger.debug(
        `DOMCache: Invalidated ${invalidatedCount} entries for context ${contextId}`
      );
    }
  }

  /**
   * Invalidate all cache entries
   */
  invalidateAll() {
    const count = this.cache.size;
    this.cache.clear();
    this.stats.invalidations += count;
    logger.debug(`DOMCache: Invalidated all ${count} cache entries`);
  }

  /**
   * Preload common selectors
   * @param {Array} selectors - Array of {selector, context} objects
   */
  preload(selectors) {
    logger.debug(`DOMCache: Preloading ${selectors.length} selectors`);

    selectors.forEach(({ selector, context = document, options = {} }) => {
      this.query(selector, context, options);
    });
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const hitRate =
      this.stats.hits + this.stats.misses > 0
        ? (
            (this.stats.hits / (this.stats.hits + this.stats.misses)) *
            100
          ).toFixed(2)
        : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      cacheSize: this.cache.size,
      observerCount: this.observers.size,
    };
  }

  /**
   * Get cache contents for debugging
   * @returns {Array} Array of cache entries
   */
  getDebugInfo() {
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      selector: entry.selector,
      context: entry.context.tagName || "document",
      elementCount: entry.elements
        ? entry.elements.length
        : entry.element
        ? 1
        : 0,
      age: Date.now() - entry.timestamp,
      live: entry.live,
    }));
  }

  /**
   * Clean up expired cache entries
   * @param {number} maxAge - Maximum age in milliseconds
   */
  cleanup(maxAge = 300000) {
    // 5 minutes default
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > maxAge) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.debug(`DOMCache: Cleaned up ${cleanedCount} expired entries`);
    }

    return cleanedCount;
  }

  /**
   * Destroy cache and clean up observers
   */
  destroy() {
    // Disconnect all observers
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();

    // Clear cache
    this.cache.clear();

    // Reset stats
    this.stats = { hits: 0, misses: 0, invalidations: 0 };

    logger.debug("DOMCache destroyed");
  }

  /**
   * Set up automatic cleanup interval
   * @param {number} interval - Cleanup interval in milliseconds
   * @param {number} maxAge - Maximum age for entries
   * @returns {number} Interval ID
   */
  setupAutoCleanup(interval = 300000, maxAge = 600000) {
    // 5min interval, 10min max age
    return setInterval(() => {
      this.cleanup(maxAge);
    }, interval);
  }
}

// Create singleton instance
const domCache = new DOMCache();

// Set up automatic cleanup every 5 minutes
domCache.setupAutoCleanup();

export default domCache;
export { domCache };
