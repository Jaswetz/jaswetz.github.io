/**
 * Basic tests for Simple Analytics implementation
 * Tests core functionality and API compatibility
 */

import SimpleAnalytics from "../src/js/analytics/simple-analytics.js";

// Mock window.gtag for testing
global.window = {
  gtag: jest.fn(),
  dataLayer: [],
  location: { hostname: "localhost", port: "1234" },
  addEventListener: jest.fn(),
  document: {
    title: "Test Page",
    addEventListener: jest.fn(),
  },
};

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

describe("SimpleAnalytics", () => {
  let analytics;

  beforeEach(() => {
    jest.clearAllMocks();
    analytics = new SimpleAnalytics();
  });

  describe("Initialization", () => {
    test("should initialize successfully", async () => {
      const result = await analytics.init();
      expect(result).toBe(true);
    });

    test("should handle initialization failure gracefully", async () => {
      // Mock gtag to not be available
      delete global.window.gtag;

      const result = await analytics.init();
      expect(result).toBe(false);
      expect(analytics.fallbackMode).toBe(true);
    });
  });

  describe("Core Tracking Methods", () => {
    beforeEach(async () => {
      await analytics.init();
    });

    test("should track project clicks", () => {
      analytics.trackProjectClick("test-project", "web");

      expect(window.gtag).toHaveBeenCalledWith("event", "project_interaction", {
        project_name: "test-project",
        project_type: "web",
        interaction_type: "click",
      });
    });

    test("should track resume downloads", () => {
      analytics.trackResumeDownload();

      expect(window.gtag).toHaveBeenCalledWith("event", "file_download", {
        file_name: "resume",
        file_type: "pdf",
      });
    });

    test("should track contact form submissions", () => {
      analytics.trackContactForm("submit", "email");

      expect(window.gtag).toHaveBeenCalledWith("event", "contact_form", {
        action: "submit",
        method: "email",
      });
    });

    test("should track external links", () => {
      analytics.trackExternalLink("https://example.com", "Example Link");

      expect(window.gtag).toHaveBeenCalledWith("event", "external_link", {
        link_url: "https://example.com",
        link_text: "Example Link",
      });
    });

    test("should track case study interactions", () => {
      analytics.trackCaseStudyInteraction("test-case-study", "view", "hero");

      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "case_study_interaction",
        {
          case_study_name: "test-case-study",
          action: "view",
          section: "hero",
        }
      );
    });

    test("should track case study completion", () => {
      analytics.trackCaseStudyCompletion("test-case-study");

      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "case_study_completion",
        {
          case_study_name: "test-case-study",
        }
      );
    });
  });

  describe("Privacy Features", () => {
    test("should respect consent settings", async () => {
      // Mock no consent given
      localStorage.getItem.mockReturnValue("denied");

      await analytics.init();

      analytics.trackProjectClick("test");

      // Should not call gtag when consent is denied
      expect(window.gtag).not.toHaveBeenCalled();
    });

    test("should queue events when consent not given", async () => {
      localStorage.getItem.mockReturnValue(null); // No consent stored

      await analytics.init();

      analytics.trackProjectClick("test");

      expect(analytics.queue.length).toBe(1);
    });

    test("should process queued events after consent", async () => {
      localStorage.getItem.mockReturnValue(null);

      await analytics.init();

      analytics.trackProjectClick("test1");
      expect(analytics.queue.length).toBe(1);

      analytics.setConsent(true);

      expect(window.gtag).toHaveBeenCalledTimes(1);
      expect(analytics.queue.length).toBe(0);
    });
  });

  describe("Error Handling", () => {
    test("should handle gtag errors gracefully", async () => {
      window.gtag.mockImplementation(() => {
        throw new Error("gtag error");
      });

      await analytics.init();

      // Should not throw when tracking
      expect(() => {
        analytics.trackProjectClick("test");
      }).not.toThrow();
    });
  });

  describe("Global API", () => {
    test("should expose global window.portfolioAnalytics", async () => {
      await analytics.init();

      expect(window.portfolioAnalytics).toBeDefined();
      expect(typeof window.portfolioAnalytics.trackProjectClick).toBe(
        "function"
      );
      expect(typeof window.portfolioAnalytics.trackResumeDownload).toBe(
        "function"
      );
      expect(typeof window.portfolioAnalytics.trackContactForm).toBe(
        "function"
      );
      expect(typeof window.portfolioAnalytics.getStatus).toBe("function");
    });
  });
});
