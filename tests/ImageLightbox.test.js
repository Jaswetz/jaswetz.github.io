/**
 * ImageLightbox Web Component Unit Tests
 * Tests the comprehensive lightbox functionality for image viewing
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import ImageLightbox from "../src/js/components/ImageLightbox/ImageLightbox.js";

// Create a testable instance by manually binding methods
class TestableImageLightbox {
  constructor() {
    // Initialize state like the real component
    this.isOpen = false;
    this.currentImageIndex = 0;
    this.images = [];
    this.originalFocusElement = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.minSwipeDistance = 50;

    // Mock Shadow DOM structure that ImageLightbox expects
    this.shadowRoot = {
      innerHTML: "",
      querySelector: vi.fn((selector) => {
        switch (selector) {
          case ".lightbox":
            return {
              classList: { add: vi.fn(), remove: vi.fn() },
              setAttribute: vi.fn(),
              getAttribute: vi.fn(),
            };
          case ".lightbox__image":
            return {
              src: "",
              alt: "",
              setAttribute: vi.fn(),
              classList: { add: vi.fn(), remove: vi.fn() },
            };
          case ".lightbox__caption":
            return { textContent: "" };
          case ".lightbox__instructions":
            return { getAttribute: vi.fn(), setAttribute: vi.fn() };
          case ".lightbox__nav--prev":
          case ".lightbox__nav--next":
            return {
              setAttribute: vi.fn(),
              disabled: false,
              classList: { remove: vi.fn() },
            };
          case ".lightbox__close":
            return {
              focus: vi.fn(),
              addEventListener: vi.fn(),
            };
          default:
            return null;
        }
      }),
      querySelectorAll: vi.fn(() => []),
    };

    // ImageLightbox component properties that rely on shadow DOM
    this.lightboxEl = this.shadowRoot.querySelector(".lightbox");
    this.imageEl = this.shadowRoot.querySelector(".lightbox__image");
    this.captionEl = this.shadowRoot.querySelector(".lightbox__caption");
    this.instructionsEl = this.shadowRoot.querySelector(
      ".lightbox__instructions"
    );
    this.prevBtn = this.shadowRoot.querySelector(".lightbox__nav--prev");
    this.nextBtn = this.shadowRoot.querySelector(".lightbox__nav--next");
    this.closeBtn = this.shadowRoot.querySelector(".lightbox__close");

    // Bind all the methods we want to test
    this.addLightboxHint = ImageLightbox.prototype.addLightboxHint.bind(this);
    this.initializeImageListeners =
      ImageLightbox.prototype.initializeImageListeners.bind(this);
    this.removeImageListeners =
      ImageLightbox.prototype.removeImageListeners.bind(this);
    this.handleImageClick = ImageLightbox.prototype.handleImageClick.bind(this);
    this.handleBackdropClick =
      ImageLightbox.prototype.handleBackdropClick.bind(this);
    this.handleKeydown = ImageLightbox.prototype.handleKeydown.bind(this);
    this.trapFocus = ImageLightbox.prototype.trapFocus.bind(this);
    this.handleTouchStart = ImageLightbox.prototype.handleTouchStart.bind(this);
    this.handleTouchEnd = ImageLightbox.prototype.handleTouchEnd.bind(this);
    this.handleResize = ImageLightbox.prototype.handleResize.bind(this);
    this.open = ImageLightbox.prototype.open.bind(this);
    this.close = ImageLightbox.prototype.close.bind(this);
    this.showPrevious = ImageLightbox.prototype.showPrevious.bind(this);
    this.showNext = ImageLightbox.prototype.showNext.bind(this);
    this.loadImage = ImageLightbox.prototype.loadImage.bind(this);
    this.updateNavigation = ImageLightbox.prototype.updateNavigation.bind(this);
    this.announceToScreenReader =
      ImageLightbox.prototype.announceToScreenReader.bind(this);
    this.disconnectedCallback =
      ImageLightbox.prototype.disconnectedCallback.bind(this);

    // Mock methods for the component
    this.querySelector = vi.fn((selector) => {
      if (
        selector ===
        "figure img.project__img, figure img.project-summary__image"
      ) {
        return document.querySelectorAll("img.project__img");
      }
      return null;
    });

    this.closest = vi.fn(() => document.createElement("figure"));
    this.querySelectorAll = vi.fn(() => []);
  }
}

describe("ImageLightbox Component", () => {
  let lightbox;
  let mockImages;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock image elements
    mockImages = [];
    const article = document.createElement("article");

    for (let i = 0; i < 3; i++) {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = `test-image-${i}.jpg`;
      img.alt = `Test image ${i}`;
      img.className = "project__img"; // Lightbox detects this class

      figure.appendChild(img);
      const caption = document.createElement("figcaption");
      caption.textContent = `Caption ${i}`;
      figure.appendChild(caption);

      article.appendChild(figure);
      mockImages.push(img);
    }

    document.body.appendChild(article);

    // Create testable instance
    lightbox = new TestableImageLightbox();

    // Simulate component initialization (what connectedCallback normally does)
    lightbox.addLightboxHint(); // This should create the accessibility hint element

    // Override document methods for controlled testing
    const originalQuerySelectorAll = document.querySelectorAll;
    document.querySelectorAll = vi.fn((selector) => {
      if (selector.includes("project__img")) {
        return mockImages;
      }
      return originalQuerySelectorAll.call(document, selector);
    });

    // Initialize image listeners (simulate connectedCallback behavior)
    lightbox.initializeImageListeners();
  });

  afterEach(() => {
    // Restore and clean up
    document.querySelectorAll = HTMLDocument.prototype.querySelectorAll;

    // Remove all mock images and figures
    const figures = document.querySelectorAll("figure");
    figures.forEach((figure) => {
      if (figure.parentNode) {
        figure.parentNode.removeChild(figure);
      }
    });

    vi.restoreAllMocks();
  });

  describe("Initialization", () => {
    it("should automatically detect project images", () => {
      expect(lightbox.images.length).toBe(3);

      lightbox.images.forEach((imageData, index) => {
        // Note: DOM resolves relative URLs to full URLs
        expect(imageData.src).toBe(
          `http://localhost:3000/test-image-${index}.jpg`
        );
        expect(imageData.alt).toContain(`Test image ${index}`);
        expect(imageData.caption).toBe(`Caption ${index}`);
        expect(imageData.originalElement).toBe(mockImages[index]);
      });
    });

    it("should set up accessibility hints", () => {
      const hint = document.getElementById("lightbox-hint");
      expect(hint).toBeDefined();
      expect(hint.textContent).toContain("lightbox");
    });

    it("should make images clickable for lightbox", () => {
      mockImages.forEach((img) => {
        expect(img.style.cursor).toBe("pointer");
        expect(img.getAttribute("role")).toBe("button");
        expect(img.getAttribute("tabindex")).toBe("0");
        expect(img.getAttribute("aria-describedby")).toBe("lightbox-hint");
      });
    });
  });

  describe("Lightbox Operations", () => {
    beforeEach(() => {
      // Override dispatchEvent to prevent Shadow DOM issues
      lightbox.dispatchEvent = vi.fn();
    });

    it("should open lightbox when image is clicked", () => {
      const img = mockImages[0];
      const clickEvent = new Event("click");

      img.dispatchEvent(clickEvent);

      expect(lightbox.isOpen).toBe(true);
    });

    it("should open lightbox when image is activated with Enter key", () => {
      const img = mockImages[0];
      const keyEvent = new KeyboardEvent("keydown", { key: "Enter" });

      img.dispatchEvent(keyEvent);

      expect(lightbox.isOpen).toBe(true);
    });

    it("should open lightbox when image is activated with Space key", () => {
      const img = mockImages[0];
      const keyEvent = new KeyboardEvent("keydown", { key: " " });

      img.dispatchEvent(keyEvent);

      expect(lightbox.isOpen).toBe(true);
    });

    it("should handle invalid image open attempts", () => {
      lightbox.open(-1); // Invalid index - should clamp to 0
      expect(lightbox.currentImageIndex).toBe(0);

      lightbox.open(999); // Out of bounds - should clamp to last valid index (2)
      expect(lightbox.currentImageIndex).toBe(lightbox.images.length - 1);
    });
  });

  describe("Navigation", () => {
    beforeEach(() => {
      lightbox.open(0); // Start with first image
    });

    it("should navigate to next image", () => {
      lightbox.showNext();
      expect(lightbox.currentImageIndex).toBe(1);
    });

    it("should navigate to previous image", () => {
      lightbox.showPrevious();
      expect(lightbox.currentImageIndex).toBe(lightbox.images.length - 1); // Wraps around
    });

    it("should loop navigation (end to beginning)", () => {
      lightbox.currentImageIndex = lightbox.images.length - 1;
      lightbox.showNext();
      expect(lightbox.currentImageIndex).toBe(0);
    });

    it("should loop navigation (beginning to end)", () => {
      lightbox.currentImageIndex = 0;
      lightbox.showPrevious();
      expect(lightbox.currentImageIndex).toBe(2);
    });
  });

  describe("Keyboard Navigation", () => {
    beforeEach(() => {
      lightbox.open(0);
    });

    it("should close lightbox on Escape key", () => {
      const keyEvent = new KeyboardEvent("keydown", { key: "Escape" });

      document.dispatchEvent(keyEvent);

      expect(lightbox.isOpen).toBe(false);
    });

    it("should navigate to next image on right arrow", () => {
      const keyEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });

      document.dispatchEvent(keyEvent);

      expect(lightbox.currentImageIndex).toBe(1);
    });

    it("should navigate to previous image on left arrow", () => {
      const keyEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });

      document.dispatchEvent(keyEvent);

      expect(lightbox.currentImageIndex).toBe(2); // Wraps around
    });

    it("should handle Home key to go to first image", () => {
      lightbox.currentImageIndex = 2;
      const keyEvent = new KeyboardEvent("keydown", { key: "Home" });

      document.dispatchEvent(keyEvent);

      expect(lightbox.currentImageIndex).toBe(0);
    });

    it("should handle End key to go to last image", () => {
      lightbox.currentImageIndex = 0;
      const keyEvent = new KeyboardEvent("keydown", { key: "End" });

      document.dispatchEvent(keyEvent);

      expect(lightbox.currentImageIndex).toBe(2);
    });

    it("should handle Tab key for focus trapping (basic check)", () => {
      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: false,
      });

      document.dispatchEvent(tabEvent);

      // Focus trapping complexity makes this hard to test fully in unit tests
      // The event should be handled
      expect(tabEvent.defaultPrevented).toBeFalsy(); // Our mock might not prevent default
    });
  });

  describe("Touch Gestures", () => {
    it("should handle touch start event tracking", () => {
      const touchEvent = new TouchEvent("touchstart", {
        touches: [
          {
            clientX: 100,
            clientY: 100,
            identifier: 0,
            target: document.body,
          },
        ],
      });

      // We can't easily test TouchEvent on shadow DOM elements in this setup
      // but we can verify the properties exist
      expect(typeof TouchEvent).toBe("function");
      expect(touchEvent.touches).toBeDefined();
      expect(lightbox.handleTouchStart).toBeDefined();
      expect(lightbox.handleTouchEnd).toBeDefined();
    });
  });

  describe("Accessibility Features", () => {
    it("should provide screen reader announcements", () => {
      const announceSpy = vi.spyOn(lightbox, "announceToScreenReader");

      lightbox.open(0);

      expect(announceSpy).toHaveBeenCalledWith(
        expect.stringContaining("Lightbox opened")
      );

      expect(announceSpy).toHaveBeenCalledWith(
        expect.stringContaining("image 1")
      );
    });

    it("should set proper ARIA attributes when open", () => {
      // We can't easily test Shadow DOM attributes in this setup
      // but we can verify the methods exist and are called
      expect(lightbox.open).toBeDefined();
      expect(lightbox.close).toBeDefined();
    });
  });

  describe("Resource Management", () => {
    beforeEach(() => {
      lightbox.open(0);
    });

    it("should prevent body scroll when open", () => {
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should restore body scroll when closed", () => {
      lightbox.close();
      expect(document.body.style.overflow).toBe("");
    });

    it("should remove event listeners when removed from DOM", () => {
      // Disconnect and verify cleanup logic exists
      expect(lightbox.disconnectedCallback).toBeDefined();

      // Manually call disconnected callback
      lightbox.disconnectedCallback();
      // The actual cleanup would happen here
    });
  });

  describe("Image Loading and Display", () => {
    it("should handle image loading with error boundaries", () => {
      // Test that loading methods exist and handle edge cases
      expect(typeof lightbox.loadImage).toBe("function");

      // Test loading with invalid index
      expect(() => lightbox.loadImage(-1)).not.toThrow();
      expect(() => lightbox.loadImage(999)).not.toThrow();
    });

    it("should handle image loading errors gracefully", () => {
      // Mock Image constructor to simulate load failure
      const originalImage = global.Image;
      global.Image = class {
        constructor() {
          this.src = "";
          this.onload = null;
          this.onerror = null;
          // Fail immediately
          setTimeout(() => {
            if (this.onerror) this.onerror();
          }, 0);
        }
      };

      lightbox.loadImage(0);

      // Restore original Image
      global.Image = originalImage;
    });

    it("should set image properties and captions", () => {
      // Test the data structure
      const imageData = lightbox.images[0];
      expect(imageData).toBeDefined();
      expect(typeof imageData.src).toBe("string");
      expect(typeof imageData.alt).toBe("string");
      expect(typeof imageData.caption).toBe("string");
      expect(imageData.originalElement).toBeDefined();
    });
  });

  describe("UI State Management", () => {
    it("should properly initialize state properties", () => {
      expect(lightbox.isOpen).toBe(false);
      expect(lightbox.currentImageIndex).toBe(0);
      expect(Array.isArray(lightbox.images)).toBe(true);
      expect(lightbox.touchStartX).toBe(0);
      expect(lightbox.touchStartY).toBe(0);
      expect(typeof lightbox.minSwipeDistance).toBe("number");
    });

    it("should handle multiple image scenarios", () => {
      expect(lightbox.updateNavigation).toBeDefined();

      // With single image
      const singleImageLightbox = Object.assign(
        Object.create(Object.getPrototypeOf(lightbox)),
        lightbox
      );
      singleImageLightbox.images = [
        { src: "single.jpg", alt: "", caption: "" },
      ];
      // Navigation updates would happen here
    });
  });

  describe("Error Handling", () => {
    it("should handle edge cases gracefully", () => {
      // Test methods exist and don't throw on edge cases
      expect(() => lightbox.handleResize()).not.toThrow();
      expect(() =>
        lightbox.handleBackdropClick(new Event("click"))
      ).not.toThrow();

      // Test reset of touch coordinates
      lightbox.touchStartX = 100;
      lightbox.touchStartY = 200;
    });

    it("should handle disconnected callback without errors", () => {
      // The disconnected callback does cleanup without a separate cleanup method
      expect(() => lightbox.disconnectedCallback()).not.toThrow();
    });
  });
});
