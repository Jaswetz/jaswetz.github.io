/**
 * Unit tests for SidebarNavigation component
 * Tests the improved section detection logic
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { JSDOM } from "jsdom";
import SidebarNavigation from "./SidebarNavigation.js";

describe("SidebarNavigation", () => {
  let dom;
  let document;
  let window;
  let sidebarNav;

  beforeEach(() => {
    // Set up DOM environment
    dom = new JSDOM(
      `
      <!DOCTYPE html>
      <html>
        <body>
          <nav class="sidebar-nav">
            <ul>
              <li><a href="#project-summary">Project Summary</a></li>
              <li><a href="#the-problem">The Problem</a></li>
              <li><a href="#process">Discovery & Research</a></li>
              <li><a href="#design-iteration">Design & Iteration</a></li>
            </ul>
          </nav>
          
          <!-- Test different section structures -->
          <section id="project-summary">
            <h2>Project Summary</h2>
            <p>Content here</p>
          </section>
          
          <section class="project-problem">
            <h2 id="the-problem">The Problem</h2>
            <p>Content here</p>
          </section>
          
          <section id="process">
            <h2>Discovery and Research</h2>
            <p>Content here</p>
          </section>
          
          <section class="design-section">
            <h2 id="design-iteration">Design & Iteration</h2>
            <p>Content here</p>
          </section>
        </body>
      </html>
    `,
      {
        url: "http://localhost",
        pretendToBeVisual: true,
        resources: "usable",
      }
    );

    document = dom.window.document;
    window = dom.window;

    // Set up global objects
    global.document = document;
    global.window = window;

    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    }));

    // Mock window methods
    window.scrollTo = vi.fn();
    window.requestAnimationFrame = vi.fn((callback) => {
      callback(Date.now());
      return 123; // Mock animation frame ID
    });
    window.cancelAnimationFrame = vi.fn();

    // Mock getBoundingClientRect for sections
    const mockRect = {
      top: 200,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
    };
    Element.prototype.getBoundingClientRect = vi.fn(() => mockRect);

    // Mock window.pageYOffset
    Object.defineProperty(window, "pageYOffset", {
      value: 0,
      writable: true,
    });

    // Mock history.replaceState
    window.history.replaceState = vi.fn();

    // Mock addEventListener
    window.addEventListener = vi.fn();
  });

  afterEach(() => {
    if (sidebarNav) {
      sidebarNav.destroy();
    }
    vi.clearAllMocks();
  });

  describe("Section Detection", () => {
    it("should detect sections with direct ID attributes", () => {
      sidebarNav = new SidebarNavigation();

      const projectSummaryLink = sidebarNav.navLinks.find(
        (item) => item.id === "project-summary"
      );
      expect(projectSummaryLink).toBeDefined();
      expect(projectSummaryLink.section.tagName.toLowerCase()).toBe("section");
      expect(projectSummaryLink.section.id).toBe("project-summary");
    });

    it("should detect sections containing h2 elements with ID attributes", () => {
      sidebarNav = new SidebarNavigation();

      const problemLink = sidebarNav.navLinks.find(
        (item) => item.id === "the-problem"
      );
      expect(problemLink).toBeDefined();
      expect(problemLink.section.tagName.toLowerCase()).toBe("section");
      expect(problemLink.section.classList.contains("project-problem")).toBe(
        true
      );
    });

    it("should handle mixed section structures correctly", () => {
      sidebarNav = new SidebarNavigation();

      // Should find all 4 navigation links
      expect(sidebarNav.navLinks).toHaveLength(4);

      // Check each type of section structure
      const linkIds = sidebarNav.navLinks.map((item) => item.id);
      expect(linkIds).toContain("project-summary"); // Direct section ID
      expect(linkIds).toContain("the-problem"); // H2 ID in section
      expect(linkIds).toContain("process"); // Direct section ID
      expect(linkIds).toContain("design-iteration"); // H2 ID in section
    });

    it("should maintain reference to target elements", () => {
      sidebarNav = new SidebarNavigation();

      const problemLink = sidebarNav.navLinks.find(
        (item) => item.id === "the-problem"
      );
      expect(problemLink.targetElement).toBeDefined();
      expect(problemLink.targetElement.id).toBe("the-problem");
      expect(problemLink.targetElement.tagName.toLowerCase()).toBe("h2");
    });

    it("should handle missing sections gracefully", () => {
      // Add a navigation link that points to non-existent section
      const navList = document.querySelector(".sidebar-nav ul");
      const missingLink = document.createElement("li");
      missingLink.innerHTML = "<a href=\"#missing-section\">Missing Section</a>";
      navList.appendChild(missingLink);

      sidebarNav = new SidebarNavigation();

      // Should not include the missing section
      const missingNavItem = sidebarNav.navLinks.find(
        (item) => item.id === "missing-section"
      );
      expect(missingNavItem).toBeUndefined();

      // Should still find the valid sections
      expect(sidebarNav.navLinks.length).toBeGreaterThan(0);
    });
  });

  describe("Enhanced Selector Logic", () => {
    it("should use multiple fallback strategies for section detection", () => {
      // Create a complex nested structure
      document.body.innerHTML = `
        <nav class="sidebar-nav">
          <ul>
            <li><a href="#nested-target">Nested Target</a></li>
          </ul>
        </nav>
        
        <section class="complex-section">
          <div class="content-wrapper">
            <h2 id="nested-target">Nested Target</h2>
          </div>
        </section>
      `;

      sidebarNav = new SidebarNavigation();

      const nestedLink = sidebarNav.navLinks.find(
        (item) => item.id === "nested-target"
      );
      expect(nestedLink).toBeDefined();
      expect(nestedLink.section.tagName.toLowerCase()).toBe("section");
      expect(nestedLink.section.classList.contains("complex-section")).toBe(
        true
      );
    });

    it("should prioritize section elements over other elements", () => {
      sidebarNav = new SidebarNavigation();

      sidebarNav.navLinks.forEach((navItem) => {
        expect(navItem.section.tagName.toLowerCase()).toBe("section");
      });
    });
  });

  describe("Intersection Observer Setup", () => {
    it("should create intersection observer with dynamic offset", () => {
      // Mock header element
      const header = document.createElement("site-header");
      Object.defineProperty(header, "offsetHeight", {
        value: 80,
        writable: true,
      });
      document.body.prepend(header);

      // Mock calculateScrollOffset to return a consistent value for testing
      const calculateScrollOffsetSpy = vi.fn().mockReturnValue(100);

      // Create the SidebarNavigation instance
      sidebarNav = new SidebarNavigation();

      // Override the calculateScrollOffset method
      sidebarNav.calculateScrollOffset = calculateScrollOffsetSpy;

      // Re-run setupIntersectionObserver to use our mocked method
      sidebarNav.setupIntersectionObserver();

      expect(global.IntersectionObserver).toHaveBeenCalled();
      const observerOptions = global.IntersectionObserver.mock.calls[0][1];

      // Verify the rootMargin contains our expected offset
      expect(observerOptions.rootMargin).toMatch(/^-100px/);

      // Updated threshold values
      expect(observerOptions.threshold).toContain(0);
      expect(observerOptions.threshold).toContain(0.5);
    });

    it("should observe all detected sections", () => {
      const mockObserver = {
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn(),
      };
      global.IntersectionObserver = vi.fn(() => mockObserver);

      sidebarNav = new SidebarNavigation();

      expect(mockObserver.observe).toHaveBeenCalledTimes(
        sidebarNav.sections.length
      );
    });
  });

  describe("Active Link Management", () => {
    it("should set active class on correct link", () => {
      sidebarNav = new SidebarNavigation();

      sidebarNav.setActiveLink("the-problem");

      const activeLinks = document.querySelectorAll(".sidebar-nav a.active");
      expect(activeLinks).toHaveLength(1);
      expect(activeLinks[0].getAttribute("href")).toBe("#the-problem");
    });

    it("should remove active class from previous links", () => {
      sidebarNav = new SidebarNavigation();

      // Set first link as active
      sidebarNav.setActiveLink("project-summary");
      let activeLinks = document.querySelectorAll(".sidebar-nav a.active");
      expect(activeLinks).toHaveLength(1);

      // Set second link as active
      sidebarNav.setActiveLink("the-problem");
      activeLinks = document.querySelectorAll(".sidebar-nav a.active");
      expect(activeLinks).toHaveLength(1);
      expect(activeLinks[0].getAttribute("href")).toBe("#the-problem");
    });
  });

  describe("Error Handling", () => {
    it("should handle missing sidebar navigation gracefully", () => {
      document.body.innerHTML = "<div>No sidebar navigation</div>";

      expect(() => {
        sidebarNav = new SidebarNavigation();
      }).not.toThrow();

      expect(sidebarNav.navLinks).toHaveLength(0);
      expect(sidebarNav.sections).toHaveLength(0);
    });

    it("should handle malformed navigation links", () => {
      document.body.innerHTML = `
        <nav class="sidebar-nav">
          <ul>
            <li><a href="external-link">External Link</a></li>
            <li><a href="#valid-section">Valid Section</a></li>
          </ul>
        </nav>
        <section id="valid-section">
          <h2>Valid Section</h2>
        </section>
      `;

      sidebarNav = new SidebarNavigation();

      // Should only include valid internal links
      expect(sidebarNav.navLinks).toHaveLength(1);
      expect(sidebarNav.navLinks[0].id).toBe("valid-section");
    });
  });

  describe("Scroll Positioning", () => {
    beforeEach(() => {
      // Mock header element with fixed height
      const header = document.createElement("site-header");
      Object.defineProperty(header, "offsetHeight", {
        value: 80,
        writable: true,
      });
      document.body.prepend(header);

      // Mock window.scrollTo
      window.scrollTo = vi.fn();

      // Mock requestAnimationFrame
      window.requestAnimationFrame = vi.fn((callback) => {
        callback(Date.now());
        return 123; // Mock animation frame ID
      });

      // Mock cancelAnimationFrame
      window.cancelAnimationFrame = vi.fn();

      // Mock getBoundingClientRect for sections
      const mockRect = {
        top: 200,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
      };
      Element.prototype.getBoundingClientRect = vi.fn(() => mockRect);

      // Mock window.pageYOffset
      Object.defineProperty(window, "pageYOffset", {
        value: 0,
        writable: true,
      });

      // Mock history.replaceState
      window.history.replaceState = vi.fn();
    });

    it("should use dynamic offset calculation for scroll positioning", () => {
      sidebarNav = new SidebarNavigation();

      // Get the first navigation link
      const firstLink = document.querySelector(".sidebar-nav a");

      // Simulate click
      firstLink.click();

      // Check that scrollTo was called with proper offset
      expect(window.scrollTo).toHaveBeenCalled();

      // Verify animation was started
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it("should cancel previous animation when clicking rapidly", () => {
      sidebarNav = new SidebarNavigation();

      // Get navigation links
      const links = document.querySelectorAll(".sidebar-nav a");

      // Set up the scrollAnimationFrame variable
      // We need to trigger the first click to set up the animation frame
      links[0].click();

      // Reset the mocks to check the second click behavior
      window.requestAnimationFrame.mockClear();
      window.cancelAnimationFrame.mockClear();

      // Simulate second click immediately after
      links[1].click();

      // Should have called cancelAnimationFrame
      expect(window.cancelAnimationFrame).toHaveBeenCalledWith(123);

      // Should have started a new animation
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it("should handle hash changes for proper scroll positioning", () => {
      // Set initial hash
      window.location.hash = "#project-summary";

      sidebarNav = new SidebarNavigation();

      // Manually call the handleHashChange function since we can't easily
      // simulate the setTimeout behavior in tests
      const handleHashChange = Object.getOwnPropertyDescriptors(
        window.addEventListener.mock.calls.find(
          (call) => call[0] === "hashchange"
        )[1]
      ).value;

      handleHashChange();

      // Should have set active link
      const activeLinks = document.querySelectorAll(".sidebar-nav a.active");
      expect(activeLinks).toHaveLength(1);
      expect(activeLinks[0].getAttribute("href")).toBe("#project-summary");

      // Should have called scrollTo via requestAnimationFrame
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });
});
