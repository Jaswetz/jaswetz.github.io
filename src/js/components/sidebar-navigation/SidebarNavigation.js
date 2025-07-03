/**
 * Sidebar Navigation Component
 * Handles scroll spy functionality to highlight active navigation items
 * based on the current section in view.
 */

class SidebarNavigation {
  constructor() {
    this.sidebarNav = document.querySelector(".sidebar-nav");
    this.navLinks = [];
    this.sections = [];
    this.currentActiveLink = null;
    this.observer = null;
    
    this.init();
  }

  init() {
    if (!this.sidebarNav) {
      return; // No sidebar navigation found
    }

    this.setupNavLinks();
    this.setupIntersectionObserver();
    this.bindEvents();
  }

  setupNavLinks() {
    // Get all navigation links
    const links = this.sidebarNav.querySelectorAll("a[href^=\"#\"]");
    
    links.forEach(link => {
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        this.navLinks.push({
          link: link,
          section: targetSection,
          id: targetId
        });
        this.sections.push(targetSection);
      }
    });
  }

  setupIntersectionObserver() {
    // Create intersection observer to track when sections come into view
    const options = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger when section is 20% from top
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      this.handleIntersection(entries);
    }, options);

    // Observe all sections
    this.sections.forEach(section => {
      this.observer.observe(section);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.setActiveLink(entry.target.id);
      }
    });
  }

  setActiveLink(sectionId) {
    // Remove active class from all links
    this.navLinks.forEach(({ link }) => {
      link.classList.remove("active");
    });

    // Add active class to current link
    const activeNavItem = this.navLinks.find(({ id }) => id === sectionId);
    if (activeNavItem) {
      activeNavItem.link.classList.add("active");
      this.currentActiveLink = activeNavItem.link;
    }
  }

  bindEvents() {
    // Smooth scroll when clicking navigation links
    this.navLinks.forEach(({ link, section }) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Remove active from all links
        this.navLinks.forEach(({ link: navLink }) => {
          navLink.classList.remove("active");
        });
        
        // Add active to clicked link
        link.classList.add("active");
        
        // Smooth scroll to section
        section.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });

    // Handle initial load - set active link based on URL hash
    if (window.location.hash) {
      const initialSection = window.location.hash.substring(1);
      setTimeout(() => {
        this.setActiveLink(initialSection);
      }, 100);
    } else {
      // If no hash, activate first link
      setTimeout(() => {
        if (this.navLinks.length > 0) {
          this.setActiveLink(this.navLinks[0].id);
        }
      }, 100);
    }
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export default SidebarNavigation;
