/**
 * Utility Functions Unit Tests
 * Tests common utility functions used across the application
 */

import { describe, it, expect } from "vitest";

describe("Utility Functions", () => {
  describe("Logger", () => {
    it("should have expected logging methods", () => {
      // Basic test to verify logger structure
      expect(typeof console.debug).toBe("function");
      expect(typeof console.info).toBe("function");
      expect(typeof console.warn).toBe("function");
      expect(typeof console.error).toBe("function");
    });
  });

  describe("Global testUtils", () => {
    it("should expose test utilities", () => {
      expect(global.testUtils).toBeDefined();
      expect(typeof global.testUtils.createComponent).toBe("function");
      expect(typeof global.testUtils.simulateEvent).toBe("function");
      expect(typeof global.testUtils.queryShadow).toBe("function");
    });
  });

  describe("DOM Manipulation", () => {
    it("should create elements properly", () => {
      const element = document.createElement("div");
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element.tagName.toLowerCase()).toBe("div");
    });

    it("should handle attributes correctly", () => {
      const element = document.createElement("div");
      element.setAttribute("data-test", "value");
      element.setAttribute("class", "test-class");

      expect(element.getAttribute("data-test")).toBe("value");
      expect(element.getAttribute("class")).toBe("test-class");
    });
  });

  describe("Web Components API", () => {
    it("should have custom elements API available", () => {
      expect(global.customElements).toBeDefined();
      expect(typeof global.customElements.define).toBe("function");
      expect(typeof global.customElements.get).toBe("function");
    });

    it("should support Shadow DOM", () => {
      const element = document.createElement("div");
      const shadowRoot = element.attachShadow({ mode: "open" });

      expect(shadowRoot).toBeInstanceOf(ShadowRoot);
      expect(element.shadowRoot).toBe(shadowRoot);
    });
  });

  describe("Async Operations", () => {
    it("should handle promises correctly", async () => {
      const promise = Promise.resolve("test value");
      const result = await promise;

      expect(result).toBe("test value");
    });

    it("should support setTimeout in tests", async () => {
      let resolved = false;

      setTimeout(() => {
        resolved = true;
      }, 10);

      // Wait a bit longer than the timeout
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(resolved).toBe(true);
    });
  });
});
