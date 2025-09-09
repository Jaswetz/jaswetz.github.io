/**
 * Test setup for Web Component testing with Vitest
 * Configures environment for Custom Elements, Shadow DOM, and component testing utilities
 * This file is ONLY used by Vitest, not Playwright
 */

// Only run this setup in Vitest environment
if (typeof vi === "undefined") {
  throw new Error("This setup file should only be used with Vitest");
}

// Configure global Web Components API for testing
import "happy-dom";
import { webcrypto } from "crypto";

// Polyfill Web Crypto API if not available
if (!global.crypto) {
  global.crypto = webcrypto;
}

// Mock Web Components API for testing
if (!global.customElements) {
  const mockFn = typeof vi !== "undefined" ? vi.fn() : () => {};
  global.customElements = {
    define: mockFn,
    get: mockFn,
    whenDefined: mockFn.bind(null, () => Promise.resolve()),
  };
}

// Polyfill HTMLElement for test environment
if (!global.HTMLElement) {
  global.HTMLElement = class HTMLElement {
    constructor() {
      this._attributes = {};
      this._shadowRoot = null;
      this._connected = false;
      this.className = "";
      this.id = "";
      this.textContent = "";
      this.innerHTML = "";
      this.style = {};
    }

    setAttribute(name, value) {
      this._attributes[name] = value;
    }

    getAttribute(name) {
      return this._attributes[name] || null;
    }

    hasAttribute(name) {
      return name in this._attributes;
    }

    removeAttribute(name) {
      delete this._attributes[name];
    }

    attachShadow(options) {
      const mockFn = typeof vi !== "undefined" ? vi.fn() : () => {};
      this._shadowRoot = {
        innerHTML: "",
        querySelector: mockFn.bind(null, () => null),
        querySelectorAll: mockFn.bind(null, () => []),
        getElementById: mockFn.bind(null, () => null),
        addEventListener: mockFn,
        removeEventListener: mockFn,
      };
      return this._shadowRoot;
    }

    appendChild(child) {
      return child;
    }

    removeChild(child) {
      return child;
    }

    connectedCallback() {
      this._connected = true;
    }

    disconnectedCallback() {
      this._connected = false;
    }
  };
}

// Mock MutationObserver if not available
if (!global.MutationObserver) {
  global.MutationObserver = class {
    constructor() {}
    observe() {}
    disconnect() {}
  };
}

// Mock IntersectionObserver if not available
if (!global.IntersectionObserver) {
  global.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock ResizeObserver if not available
if (!global.ResizeObserver) {
  global.ResizeObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock Performance API
if (!global.performance) {
  const mockFn = typeof vi !== "undefined" ? vi.fn() : () => {};
  global.performance = {
    now: () => Date.now(),
    mark: mockFn,
    measure: mockFn,
  };
}

// Mock fetch if not available
if (!global.fetch) {
  const mockFetch =
    typeof vi !== "undefined"
      ? vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
            text: () => Promise.resolve(""),
          })
        )
      : () =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
            text: () => Promise.resolve(""),
          });
  global.fetch = mockFetch;
}

// Configure global error handlers for testing (Vitest only)
if (typeof vi !== "undefined") {
  global.console = {
    ...global.console,
    error: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
    debug: vi.fn(),
  };
}

// Set up test utilities
global.testUtils = {
  // Wait for component to be defined and ready
  waitForComponent: async (tagName, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const check = () => {
        const element = document.createElement(tagName);
        if (element.constructor.name !== "HTMLElement") {
          resolve(element);
        } else if (timeout <= 0) {
          reject(new Error(`Component ${tagName} not defined within timeout`));
        } else {
          timeout -= 50;
          setTimeout(check, 50);
        }
      };
      check();
    });
  },

  // Create and mount a component for testing
  createComponent: async (tagName, attributes = {}, properties = {}) => {
    const element = document.createElement(tagName);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    // Set properties
    Object.assign(element, properties);

    // Add to document for lifecycle callbacks
    document.body.appendChild(element);

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 0));

    return element;
  },

  // Clean up component after test
  cleanupComponent: (element) => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  },

  // Simulate events on elements
  simulateEvent: (element, eventName, options = {}) => {
    const event = new Event(eventName, { bubbles: true, ...options });
    element.dispatchEvent(event);
  },

  // Query Shadow DOM
  queryShadow: (element, selector) => {
    return element.shadowRoot?.querySelector(selector) || null;
  },

  // Query all in Shadow DOM
  queryShadowAll: (element, selector) => {
    return element.shadowRoot?.querySelectorAll(selector) || [];
  },
};

// Mock logger to avoid console pollution during tests (Vitest only)
if (typeof vi !== "undefined") {
  vi.mock("./src/js/utils/Logger.js", () => ({
    default: {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      isDevelopment: false,
    },
  }));

  // Mock scroll manager
  vi.mock("./src/js/utils/ScrollManager.js", () => ({
    scrollManager: {
      subscribe: vi.fn(() => vi.fn()),
      unsubscribe: vi.fn(),
    },
  }));
}
