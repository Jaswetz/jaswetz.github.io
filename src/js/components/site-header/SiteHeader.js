/**
 * @class SiteHeader
 * @extends HTMLElement
 * @description Custom element for the site-wide header, including navigation.
 * It encapsulates its own structure, styles, and basic behavior.
 */
// TODO: [Component][SiteHeader] Implement props/attributes if needed (e.g., for different versions of header) (WCMP7, WCMP8)
// TODO: [Component][SiteHeader] Implement custom events if header interactions need to notify outside (WCMP7)
// TODO: [Component][SiteHeader] Expose CSS Custom Properties for more granular theming if needed (WCMP18)
// TODO: [Component][SiteHeader] Enhance accessibility (e.g. ARIA for nav, focus management if complex) (A11Y4, A11Y9)
import * as styles from "./SiteHeader.css";

class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * Called when the element is added to the document's DOM.
   * Renders the header structure and styles into the Shadow DOM.
   */
  connectedCallback() {
    this.shadowRoot.innerHTML = /*html*/ `
    <div class="header-content"></div>
    <style>
        ${styles.default}
    </style>
    <header class="header-content">
        <div class="logo">
            <a href="index.html">MyPortfolio</a> <!-- Site title/logo -->
        </div>
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="work.html">Work</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="styleguide.html">Style Guide</a></li>
            </ul>
        </nav>
    </header>
`;
  }

  // Future: observedAttributes and attributeChangedCallback if props are needed.
  // Future: Methods for handling events if the header becomes more interactive.
}

export default SiteHeader;
