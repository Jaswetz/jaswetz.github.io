/**
 * BaseComponent Unit Tests
 * Tests the core Web Component base class functionality:
 * - Event handling and cleanup
 * - Resource management
 * - DOM querying utilities
 * - Error handling
 * - Attribute configuration
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import BaseComponent from "../../src/js/components/BaseComponent.js";

// Create a mock HTMLElement for testing
class MockHTMLElement {
  constructor() {
    this._shadowRoot = {
      innerHTML: "",
      querySelector: vi.fn(() => null),
      querySelectorAll: vi.fn(() => []),
    };
    this._attributes = {};
    this._getters = new Map();
    this._setters = new Map();

    // Define isConnected property
    this._getters.set("isConnected", () => false);
    this._setters.set("isConnected", (val) => (this._isConnected = val));
    this._isConnected = false;

    // Define isInitialized property
    this._getters.set("isInitialized", () => false);
    this._setters.set("isInitialized", (val) => (this._isInitialized = val));
    this._isInitialized = false;
  }

  // Proxy property access
  __defineGetter__(prop, getter) {
    this._getters.set(prop, getter);
  }

  __defineSetter__(prop, setter) {
    this._setters.set(prop, setter);
  }

  get isConnected() {
    return this._isConnected;
  }
  set isConnected(value) {
    this._isConnected = value;
  }

  get isInitialized() {
    return this._isInitialized;
  }
  set isInitialized(value) {
    this._isInitialized = value;
  }

  get shadowRoot() {
    return this._shadowRoot;
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
}

// Create a testable instance by manually inheriting methods from BaseComponent
class TestableBaseComponent {
  constructor() {
    // Manually set up properties that BaseComponent initializes
    this.eventListeners = [];
    this.observers = [];
    this.timeouts = [];
    this.intervals = [];
    this.scrollSubscriptions = [];
    this.abortControllers = [];

    // Component state (BaseComponent expects these)
    this.isConnected = true;
    this.isInitialized = true;
    this._errorState = false;

    // Set up shadow root mock
    this.shadowRoot = {
      innerHTML: "",
      querySelector: vi.fn((selector) => {
        if (selector === ".component") {
          const div = document.createElement("div");
          div.className = "component";
          return div;
        }
        return null;
      }),
      querySelectorAll: vi.fn(() => []),
    };

    // Set up attributes mock for BaseComponent.getConfig()
    this._attributes = {};

    // Bind BaseComponent methods to this instance
    this.addEventListenerWithCleanup =
      BaseComponent.prototype.addEventListenerWithCleanup.bind(this);
    this.addTimeoutWithCleanup =
      BaseComponent.prototype.addTimeoutWithCleanup.bind(this);
    this.addIntervalWithCleanup =
      BaseComponent.prototype.addIntervalWithCleanup.bind(this);
    this.addScrollListenerWithCleanup =
      BaseComponent.prototype.addScrollListenerWithCleanup.bind(this);
    this.createAbortableFetch =
      BaseComponent.prototype.createAbortableFetch.bind(this);
    this.query = BaseComponent.prototype.query.bind(this);
    this.safeSetHTML = BaseComponent.prototype.safeSetHTML.bind(this);
    this.getConfig = BaseComponent.prototype.getConfig.bind(this);
    this.cleanup = BaseComponent.prototype.cleanup.bind(this);
    this.getDebugInfo = BaseComponent.prototype.getDebugInfo.bind(this);
  }

  setAttribute(name, value) {
    this._attributes[name] = { name, value };
  }

  getAttribute(name) {
    return this._attributes[name]?.value || null;
  }

  hasAttribute(name) {
    return name in this._attributes;
  }

  removeAttribute(name) {
    delete this._attributes[name];
  }

  // BaseComponent.getConfig() expects this to be iterable
  get attributes() {
    return Object.values(this._attributes);
  }

  dispatchEvent(event) {
    // Mock dispatchEvent
    return true;
  }
}

describe("BaseComponent", () => {
  let component;

  beforeEach(() => {
    vi.clearAllMocks();
    component = new TestableBaseComponent();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Event Management", () => {
    it("should add event listeners with cleanup", () => {
      const target = document.createElement("button");
      const handler = vi.fn();

      const cleanup = component.addEventListenerWithCleanup(
        target,
        "click",
        handler
      );

      expect(typeof cleanup).toBe("function");
      expect(component.eventListeners).toHaveLength(1);

      // Test cleanup
      cleanup();
      expect(component.eventListeners).toHaveLength(0);
    });

    it("should handle invalid event listener parameters", () => {
      const cleanup = component.addEventListenerWithCleanup(
        null,
        "click",
        null
      );

      expect(typeof cleanup).toBe("function");
    });
  });

  describe("Resource Management", () => {
    it("should manage timeouts with cleanup", () => {
      const callback = vi.fn();

      const timeoutId = component.addTimeoutWithCleanup(callback, 100);

      expect(typeof timeoutId).toBe("object"); // Vitest returns objects for timers
      expect(component.timeouts).toContain(timeoutId);
    });

    it("should manage intervals with cleanup", () => {
      const callback = vi.fn();

      const intervalId = component.addIntervalWithCleanup(callback, 100);

      expect(typeof intervalId).toBe("object"); // Vitest returns objects for timers
      expect(component.intervals).toContain(intervalId);
    });

    it("should handle scroll subscriptions", () => {
      const callback = vi.fn();

      // Mock scroll manager
      const mockScrollManager = {
        subscribe: vi.fn(() => vi.fn()),
      };

      const unsubscribe = component.addScrollListenerWithCleanup(callback);

      expect(typeof unsubscribe).toBe("function");
      expect(component.scrollSubscriptions).toContain(unsubscribe);
    });

    it("should create abortable fetch", async () => {
      // Mock fetch to prevent actual network call
      const mockFetch = vi
        .fn()
        .mockResolvedValue({ ok: true, json: () => ({}) });
      global.fetch = mockFetch;

      const fetchPromise = component.createAbortableFetch("/test");

      expect(fetchPromise).toBeInstanceOf(Promise);
      expect(component.abortControllers).toHaveLength(1);

      // Verify fetch was called with the URL and abort signal
      expect(mockFetch).toHaveBeenCalledWith(
        "/test",
        expect.objectContaining({
          signal: component.abortControllers[0].signal,
        })
      );

      // Restore fetch
      global.fetch = vi.fn();
    });
  });

  describe("DOM Querying", () => {
    it("should safely query shadow DOM", () => {
      const queryResult = component.query(".component");

      expect(queryResult).toBeInstanceOf(HTMLDivElement);
      expect(queryResult.className).toBe("component");
    });

    it("should handle invalid selectors gracefully", () => {
      const result = component.query("[invalid-selector");

      expect(result).toBe(null);
    });

    it("should set HTML content safely", () => {
      const div = document.createElement("div");

      component.safeSetHTML(div, "<span>test</span>");

      expect(div.innerHTML).toBe("<span>test</span>");
    });
  });

  describe("Configuration", () => {
    it("should parse data attributes", () => {
      component.setAttribute("data-theme", "dark");
      component.setAttribute("data-max-items", "10");
      component.setAttribute("data-responsive", "true");
      component.setAttribute("data-enabled", "false");

      const config = component.getConfig({ theme: "light", maxItems: 5 });

      expect(config.theme).toBe("dark");
      expect(config.maxItems).toBe(10); // JSON parse converts numeric strings
      expect(config.responsive).toBe(true); // JSON parse converts boolean strings
      expect(config.enabled).toBe(false); // JSON parse converts boolean strings
      expect(config.otherSetting).toBeUndefined();
    });

    it("should handle JSON-like attribute values", () => {
      component.setAttribute("data-options", "{\"nested\": {\"value\": 123}}");

      const config = component.getConfig();

      expect(config.options.nested.value).toBe(123);
    });
  });

  describe("Cleanup", () => {
    it("should clean up all resources", () => {
      // Add some resources to clean up
      component.abortControllers.push(new AbortController());
      component.timeouts.push(123);
      component.intervals.push(456);
      component.scrollSubscriptions.push(vi.fn());

      const abortSpy = vi.spyOn(component.abortControllers[0], "abort");

      component.cleanup();

      expect(abortSpy).toHaveBeenCalled();
      expect(component.abortControllers).toEqual([]);
      expect(component.timeouts).toEqual([]);
      expect(component.intervals).toEqual([]);
      expect(component.scrollSubscriptions).toEqual([]);
    });

    it("should handle cleanup errors gracefully", () => {
      const badController = {
        abort: vi.fn().mockImplementation(() => {
          throw new Error("Abort error");
        }),
      };

      component.abortControllers.push(badController);

      // Should not throw
      expect(() => component.cleanup()).not.toThrow();
      expect(component.abortControllers).toEqual([]);
    });
  });

  describe("Debug Information", () => {
    it("should provide debug information", () => {
      const debug = component.getDebugInfo();

      expect(debug).toEqual({
        name: "TestableBaseComponent",
        isConnected: true,
        isInitialized: true,
        eventListeners: 0,
        observers: 0,
        timeouts: 0,
        intervals: 0,
        scrollSubscriptions: 0,
        abortControllers: 0,
        hasError: false,
      });
    });

    it("should show error state when error flag is set", () => {
      component.setAttribute("data-error", "true");

      const debug = component.getDebugInfo();

      expect(debug.hasError).toBe(true);
    });
  });
});
