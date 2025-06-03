/**
 * Custom element for the site-wide header, including navigation.
 * It encapsulates its own structure, styles, and basic behavior.
 * @extends HTMLElement
 */
// TODO: [Component][SiteHeader] Implement props/attributes if needed (e.g., for different versions of header) (WCMP7, WCMP8)
// TODO: [Component][SiteHeader] Implement custom events if header interactions need to notify outside (WCMP7)
// TODO: [Component][SiteHeader] Expose CSS Custom Properties for more granular theming if needed (WCMP18)
// TODO: [Component][SiteHeader] Enhance accessibility (e.g. ARIA for nav, focus management if complex) (A11Y4, A11Y9)

class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isMenuOpen = false;
    this.lastScrollY = 0;
  }

  /**
   * Called when the element is added to the document's DOM.
   * Renders the header structure and styles into the Shadow DOM.
   */
  connectedCallback() {
    this.shadowRoot.innerHTML = /*html*/ `  
    <style>
        /* language=CSS */
        :host {
          display: block;
          position: fixed;
          top: var(--space-4);
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - var(--space-8));
          z-index: 1000;
          transition: all .5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        :host(.scrolled) {
          top: 0;
          left: 0;
          transform: none;
          width: 100%;
          border-radius: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--color-surface);
          padding: var(--space-4) var(--space-6);
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all .5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        :host(.scrolled) .header-content {
          border-radius: 0;
          padding: var(--space-3) var(--space-6);
        }

        .logo a {
          font-weight: var(--font-weight-bold);
          text-decoration: none;
          color: var(--color-primary);
          font-size: var(--font-size-xl);
          z-index: 2;
          transition: all .5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        :host(.scrolled) .logo a {
          font-size: var(--font-size-lg);
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          padding: var(--space-2);
          cursor: pointer;
          z-index: 2;
        }

        .menu-toggle span {
          display: block;
          width: 24px;
          height: 2px;
          background-color: var(--color-text);
          margin: 4px 0;
          transition: all .5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        nav {
          display: flex;
          align-items: center;
        }

        nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--space-6);
        }

        nav li a {
          text-decoration: none;
          color: var(--color-text);
          padding: var(--space-2) var(--space-3);
          font-size: var(--font-size-base);
          border-radius: var(--border-radius);
          transition: all .5s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-family-sans);
          text-transform: uppercase;
        }

        nav li a:hover,
        nav li a:focus {
          color: var(--color-primary-alt);
          background-color: var(--color-quote-bg);
          text-decoration: none;
        }

        @media (max-width: 768px) {
          :host {
            top: 0;
            left: 0;
            transform: none;
            width: 100%;
            border-radius: 0;
          }

          .header-content {
            border-radius: 0;
            padding: var(--space-3) var(--space-4);
          }

          .menu-toggle {
            display: block;
          }

          nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background-color: var(--color-surface);
            transform: translateX(100%);
            transition: transform .2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          nav.active {
            transform: translateX(0);
          }

          nav ul {
            flex-direction: column;
            gap: var(--space-4);
          }

          nav li a {
            font-size: var(--font-size-lg);
            padding: var(--space-3) var(--space-4);
          }

          .menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
          }

          .menu-toggle.active span:nth-child(2) {
            opacity: 0;
          }

          .menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
          }
        }
    </style>
    <header class="header-content">
        <div class="logo">
            <a href="/index.html">MyPortfolio</a>
        </div>
        <button class="menu-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <nav>
            <ul>
                <li><a href="/index.html">Home</a></li>
                <li><a href="/work.html">Work</a></li>
                <li><a href="/about.html">About</a></li>
                <li><a href="/contact.html">Contact</a></li>
            </ul>
        </nav>
    </header>
`;

    // Add event listeners
    const menuToggle = this.shadowRoot.querySelector(".menu-toggle");
    const nav = this.shadowRoot.querySelector("nav");

    menuToggle.addEventListener("click", () => {
      this.isMenuOpen = !this.isMenuOpen;
      menuToggle.classList.toggle("active");
      nav.classList.toggle("active");
    });

    // Handle scroll events
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const header = this;

    if (currentScrollY > 50) {
      // Changed from 100 to 50 for earlier animation
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    this.lastScrollY = currentScrollY;
  }

  disconnectedCallback() {
    // Clean up event listeners
    window.removeEventListener("scroll", this.handleScroll.bind(this));
  }
}

export default SiteHeader;
