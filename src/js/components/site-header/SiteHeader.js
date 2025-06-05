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
          font-weight: var(--font-weight-medium);
          font-family: var(--font-family-sans);
          text-decoration: none;
          color: var(--color-primary);
          font-size: var(--text-size-heading-2);
          z-index: 2;
          transition: all .5s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: var(--space-2, 0.5em);
        }

        .logo-svg {
          height: 1em;
          width: auto;
          min-width: 1em;
          min-height: 1em;
          display: inline-block;
        }

        .logo-text {
          margin-left: var(--space-1, 0.25em);
          display: inline-block;
          text-transform: uppercase;
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
          z-index: 1001; /* Ensure toggle is above nav */
          position: relative; /* For positioning the close text */
          color: var(--color-text); /* For the "Close" text */
        }

        .menu-toggle .hamburger-icon span {
          display: block;
          width: 24px;
          height: 2px;
          background-color: var(--color-text);
          margin: 4px 0;
          transition: all .5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .menu-toggle .close-text {
          display: none; /* Hidden by default */
          margin-left: var(--space-1);
          font-size: var(--font-size-sm);
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

        .logo a:hover,
        .logo a:focus {
          color: var(--color-primary-alt);
          background-color: var(--color-quote-bg);
          text-decoration: none;
        }
        .logo a:hover .logo-svg,
        .logo a:focus .logo-svg {
          /* Change SVG fill on hover to match text color */
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
            display: flex; /* Use flex to align icon and text */
            align-items: center;
          }

          nav {
            /* Changes for dropdown behavior */
            position: absolute;
            top: calc(100% + var(--space-2)); /* Position below the header */
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - var(--space-4)); /* Slightly less than header width */
            max-width: 300px; /* Max width for the dropdown */
            background-color: var(--color-surface);
            border-radius: var(--border-radius-pill, 999px); /* Pill shape */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: var(--space-3);
            opacity: 0;
            visibility: hidden;
            transform: translate(-50%, 10px); /* Start slightly lower for animation */
            transition: opacity .3s ease, transform .3s ease, visibility .3s ease;
            z-index: 1000; /* Ensure nav is below toggle if overlapping, but above other content */
            display: block; /* Reset from flex if it was set for desktop */
          }

          nav.active {
            opacity: 1;
            visibility: visible;
            transform: translate(-50%, 0);
          }

          nav ul {
            flex-direction: column;
            gap: var(--space-2); /* Reduced gap for dropdown */
            align-items: stretch; /* Make items take full width */
          }

          nav li a {
            font-size: var(--font-size-base); /* Adjusted font size */
            padding: var(--space-2) var(--space-3);
            display: block; /* Make links block for full-width click area */
            text-align: center;
          }

          .menu-toggle.active .hamburger-icon span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
          }

          .menu-toggle.active .hamburger-icon span:nth-child(2) {
            opacity: 0;
          }

          .menu-toggle.active .hamburger-icon span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
          }
          .menu-toggle.active .close-text {
            display: inline; /* Show "Close" text */
          }
          .menu-toggle.active .hamburger-icon {
            /* Optionally hide hamburger lines if "Close X" text is enough, or keep for X icon */
          }
        }
    </style>
    <header class="header-content">
        <div class="logo">
          <a href="/index.html">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="logo-svg" width="32" height="32" viewBox="0 0 39 39">
              <defs>
                <clipPath id="clipPath2973389018">
                  <path d="M0 0L39 0L39 39L0 39L0 0Z" fill-rule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                </clipPath>
              </defs>
              <g clip-path="url(#clipPath2973389018)">
                <path d="M9 0L18 17L0 17L9 0Z" fill-rule="nonzero" transform="matrix(1 0 0 1 10.5 10)" fill="rgb(37, 105, 237)"/>
                <path d="M16 -0.5Q19.3566 -0.5 22.4227 0.796857Q25.3838 2.04931 27.6673 4.33274Q29.9507 6.61615 31.2031 9.5773Q32.5 12.6434 32.5 16Q32.5 19.3566 31.2031 22.4227Q29.9507 25.3838 27.6673 27.6673Q25.3839 29.9507 22.4227 31.2031Q19.3566 32.5 16 32.5Q12.6434 32.5 9.5773 31.2031Q6.61615 29.9507 4.33274 27.6673Q2.04931 25.3838 0.796855 22.4227Q-0.500002 19.3566 -0.500002 16Q-0.5 12.6434 0.796857 9.5773Q2.04931 6.61617 4.33274 4.33274Q6.61617 2.04931 9.5773 0.796855Q12.6434 -0.500002 16 -0.500002L16 -0.5ZM16 0.499998Q12.8462 0.499998 9.96685 1.71786Q7.18536 2.89433 5.03984 5.03984Q2.89433 7.18535 1.71786 9.96685Q0.5 12.8462 0.499998 16Q0.499998 19.1538 1.71786 22.0331Q2.89433 24.8147 5.03984 26.9602Q7.18534 29.1057 9.96685 30.2821Q12.8462 31.5 16 31.5Q19.1538 31.5 22.0331 30.2821Q24.8147 29.1057 26.9602 26.9602Q29.1057 24.8147 30.2821 22.0331Q31.5 19.1538 31.5 16Q31.5 12.8462 30.2821 9.96685Q29.1057 7.18534 26.9602 5.03984Q24.8146 2.89434 22.0331 1.71786Q19.1538 0.5 16 0.5L16 0.499998Z" fill-rule="nonzero" transform="matrix(1 0 0 1 3.5 3.5)" fill="rgb(37, 105, 237)"/>
                <path d="M-0.5 -0.5L38.5 -0.5L38.5 38.5L-0.5 38.5L-0.5 -0.5ZM0.5 0.5L0.5 37.5L37.5 37.5L37.5 0.5L0.5 0.5Z" fill-rule="nonzero" transform="matrix(1 0 0 1 0.5 0.5)" fill="rgb(37, 105, 237)"/>
              </g>
            </svg>
            <span class="logo-text">Jason Swetzoff</span>
          </a>
        </div>
        <button class="menu-toggle" aria-label="Toggle menu">
            <span class="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span class="close-text">Close</span>
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
