/**
 * @class SiteFooter
 * @extends HTMLElement
 * @description Custom element for the site-wide footer.
 * It displays copyright information with a dynamically updated year.
 */
// TODO: [Component][SiteFooter] Implement props/attributes if needed (WCMP7, WCMP8)
// TODO: [Component][SiteFooter] Implement custom events if footer interactions need to notify outside (WCMP7)
// TODO: [Component][SiteFooter] Expose CSS Custom Properties for more granular theming if needed (WCMP18)
// TODO: [Component][SiteFooter] Enhance accessibility (e.g. ARIA for links if complex) (A11Y4, A11Y9)
class SiteFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * Called when the element is added to the document's DOM.
   * Renders the footer structure and styles into the Shadow DOM.
   * The current year is dynamically inserted into the copyright notice.
   */
  connectedCallback() {
    const currentYear = new Date().getFullYear();
    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        /* Component-specific styles for the footer */
        :host {
        display: block;
        <!-- background: var(--footer-background, #f8f9fa); -->
        margin-inline: auto;
        <!-- min-height: calc(var(--space-xl) * 8); -->
        padding: var(--space-xl) 0;
        position: relative; /* Ensure pseudo-element is positioned relative to the host */
        }
        

        :host::after {
        border-top: 1px solid var(--footer-border-color, #dee2e6);
        
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  height: 100%;
  background-color: #f7f3eb;
  opacity: 0.8;
  background-image: radial-gradient(
    #999 0.7000000000000001px,
    #f7f3eb 0.7000000000000001px
  );
  background-size: 14px 14px;
  z-index: -1; /* Ensure it stays behind the content */
}
        .footer-content {
        display: grid;
        /* Ensure footer has enough height */
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        max-width: var(--max-width);
        padding-inline: var(--space-xl);
        position: relative;
        /* display: grid; */
        gap: var(--space-xl); /* Add space between children */
        margin: 0 auto;
        text-align: left;
        min-height: inherit; /* Ensure it takes up the host's min-height */
        }
        .footer-content__text {
        width: 100%;
        }
        .social-links {
        width: 100%;
        align-items: center; /* Vertically center grid items */
        display: flex;
        }
        a {
        display: inline-flex;
        cursor: pointer;
        text-decoration: none;
        transition: var(--transition-interactive);
        position: relative;
        overflow: hidden;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border-color: var(--color-primary);
        padding: var(--space-xs) var(--space-xs);
        text-align: center;
        border-radius: var(--border-radius);
        color: var(--color-primary-hover);
        border-color: var(--color-primary-hover);
        }
        a:hover {
        color: var(--color-primary);
        }
        a:hover::after {
        content: " →";
        margin-left: 0.25em; /* Adjust spacing as needed */
        }
        .social-links__list {
        list-style: none;
        padding: 0;
        margin: 0;
        /* display: flex; */
        /* gap: 1rem; */
        }
        .footer-tag {
        font-weight: bold;
        margin-bottom: 0;
        padding: 0;
        }

        .made-with {
        font-style: italic;
        color: var(--color-secondary);
        margin: 0;
        padding: 0;
        }
      </style>
      <footer class="footer-content">

      <div class="footer-content__text">
        <p class="footer-tag">&copy; <span id="current-year">${currentYear}</span> Jason Swetzoff. All rights reserved.</p>
        <p class="made-with">Crafted with HTML, CSS, JS, and Parcel</p>
        </div>
       
      <nav class="social-links">
      <ul class="social-links__list">
        <li>
        <a id="contact-link" href="mailto:swetzoff@gmail.com" class="button">Email</a>
        </li>
        <li>
        <a href="http://www.linkedin.com/in/swetzoff"
           alt="Jason's LikedIn"
           target="_blank" class="button">LinkedIn</a>
        </li>
            <li>
           <a href="https://jaswetz.github.io" target="_blank" rel="noopener noreferrer" class="button">GitHub</a>
        </li>
        <li>
        <a target="_blank"
           rel="noopener noreferrer"
           href="pdf/Jason_Swetzoff_Principal_UX_Designer_Resume.pdf">Resume</a>
        </li>
      </ul>
      </nav>

       
        
        <!-- Optional: Link back to the top of the page -->
        <!-- <p><a href="#top">Back to Top</a></p> -->
      </footer>
      `;
  }

  // Future: observedAttributes and attributeChangedCallback if props are needed.
}

export default SiteFooter;
