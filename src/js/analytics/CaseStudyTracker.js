/**
 * Case Study Analytics Tracker - Lightweight module for case study specific tracking
 * Only loaded on case study pages to keep main bundle size down
 */

export class CaseStudyTracker {
  constructor(analytics) {
    this.analytics = analytics;
    this.caseStudyName = this._getCaseStudyName();

    if (this.caseStudyName) {
      this.init();
    }
  }

  init() {
    // Track section views using intersection observer (only if supported)
    if ("IntersectionObserver" in window) {
      this._setupSectionTracking();
    }

    // Track image interactions
    this._setupImageTracking();
  }

  _setupSectionTracking() {
    const sections = document.querySelectorAll(".project-section[id]");
    if (sections.length === 0) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sectionId = entry.target.id;
            const sectionName =
              entry.target.querySelector("h2")?.textContent || sectionId;
            this.analytics.trackCaseStudyInteraction(
              this.caseStudyName,
              "section_view",
              sectionName
            );

            // Track completion when reaching results section
            if (sectionId === "results") {
              this.analytics.trackCaseStudyCompletion(this.caseStudyName);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  _setupImageTracking() {
    const caseStudyImages = document.querySelectorAll(
      ".project__img, .project-summary__image"
    );
    caseStudyImages.forEach((img) => {
      img.addEventListener("click", () => {
        const imageName = img.alt || "Image";
        this.analytics.trackImageLightbox(imageName, this.caseStudyName);
      });
    });
  }

  _getCaseStudyName() {
    // Check URL for case study identifier
    const url = window.location.pathname;
    if (url.includes("project-daimler-dcd")) return "Daimler Fleet Analytics";
    if (url.includes("project-autodesk-di"))
      return "Autodesk Design Intelligence";
    if (url.includes("project-intel-lfc")) return "Intel LFC";
    if (url.includes("project-adsk-notification"))
      return "Autodesk Notifications";

    // Fallback: try to get from page title or hero section
    const heroTitle = document.querySelector(".hero--project__header, h1");
    if (heroTitle) {
      return heroTitle.textContent?.replace("🔒 ", "").trim() || null;
    }

    return null;
  }
}
