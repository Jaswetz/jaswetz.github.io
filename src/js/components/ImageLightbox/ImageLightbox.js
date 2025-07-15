/**
 * ImageLightbox Web Component
 * 
 * A accessible lightbox modal for viewing case study images in full size.
 * Supports keyboard navigation, touch gestures, and maintains WCAG 2.1 Level AA compliance.
 * 
 * Features:
 * - Click on images to open in lightbox
 * - Keyboard navigation (ESC to close, arrow keys for navigation)
 * - Touch/swipe gestures on mobile
 * - Focus management for accessibility
 * - Image captions support
 * - Responsive design
 * 
 * @extends HTMLElement
 */
class ImageLightbox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    
    // State management
    this.isOpen = false;
    this.currentImageIndex = 0;
    this.images = [];
    this.originalFocusElement = null;
    
    // Touch handling for mobile gestures
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.minSwipeDistance = 50;
    
    // Bind methods to preserve context
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  connectedCallback() {
    this.render();
    this.initializeImageListeners();
    
    // Add resize listener for responsive behavior
    window.addEventListener("resize", this.handleResize);
  }

  disconnectedCallback() {
    // Clean up event listeners
    window.removeEventListener("resize", this.handleResize);
    this.removeImageListeners();
    
    // Remove global listeners if lightbox is open
    if (this.isOpen) {
      document.removeEventListener("keydown", this.handleKeydown);
    }
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/`
      <style>
        /* language=CSS */
        :host {
          --lightbox-bg: rgba(0, 0, 0, 0.9);
          --lightbox-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --lightbox-z-index: 9999;
          --button-size: 48px;
          --button-bg: rgba(255, 255, 255, 0.1);
          --button-bg-hover: rgba(255, 255, 255, 0.2);
          --button-color: #ffffff;
          --caption-bg: rgba(0, 0, 0, 0.7);
          --caption-color: #ffffff;
          --focus-ring: 2px solid var(--accent-color, #0066cc);
          --focus-ring-offset: 2px;
        }

        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--lightbox-bg);
          z-index: var(--lightbox-z-index);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: var(--lightbox-transition);
          padding: var(--space-m, 1rem);
          box-sizing: border-box;
        }

        .lightbox--open {
          opacity: 1;
          visibility: visible;
        }

        .lightbox__container {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          transform: scale(0.8);
          transition: var(--lightbox-transition);
        }

        .lightbox--open .lightbox__container {
          transform: scale(1);
        }

        .lightbox__image {
          max-width: 100%;
          max-height: calc(90vh - 4rem); /* Reserve space for caption */
          object-fit: contain;
          border-radius: var(--radius-s, 4px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .lightbox__caption {
          background: var(--caption-bg);
          color: var(--caption-color);
          padding: var(--space-s, 0.75rem) var(--space-m, 1rem);
          text-align: center;
          font-size: var(--font-size-s, 0.875rem);
          line-height: var(--line-height-comfortable, 1.5);
          border-radius: 0 0 var(--radius-s, 4px) var(--radius-s, 4px);
          margin: 0;
        }

        .lightbox__caption:empty {
          display: none;
        }

        /* Navigation buttons */
        .lightbox__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: var(--button-size);
          height: var(--button-size);
          background: var(--button-bg);
          border: none;
          border-radius: 50%;
          color: var(--button-color);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          transition: var(--lightbox-transition);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .lightbox__nav:hover {
          background: var(--button-bg-hover);
          transform: translateY(-50%) scale(1.1);
        }

        .lightbox__nav:focus {
          outline: var(--focus-ring);
          outline-offset: var(--focus-ring-offset);
        }

        .lightbox__nav:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .lightbox__nav:disabled:hover {
          transform: translateY(-50%) scale(1);
          background: var(--button-bg);
        }

        .lightbox__nav--prev {
          left: var(--space-m, 1rem);
        }

        .lightbox__nav--next {
          right: var(--space-m, 1rem);
        }

        .lightbox__nav--single {
          display: none;
        }

        /* Close button */
        .lightbox__close {
          position: absolute;
          top: var(--space-m, 1rem);
          right: var(--space-m, 1rem);
          width: var(--button-size);
          height: var(--button-size);
          background: var(--button-bg);
          border: none;
          border-radius: 50%;
          color: var(--button-color);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          transition: var(--lightbox-transition);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .lightbox__close:hover {
          background: var(--button-bg-hover);
          transform: scale(1.1);
        }

        .lightbox__close:focus {
          outline: var(--focus-ring);
          outline-offset: var(--focus-ring-offset);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .lightbox {
            padding: var(--space-s, 0.75rem);
          }

          .lightbox__container {
            max-width: 95vw;
            max-height: 95vh;
          }

          .lightbox__image {
            max-height: calc(95vh - 3rem);
          }

          .lightbox__nav {
            width: calc(var(--button-size) * 0.8);
            height: calc(var(--button-size) * 0.8);
            font-size: 1.2rem;
          }

          .lightbox__close {
            width: calc(var(--button-size) * 0.8);
            height: calc(var(--button-size) * 0.8);
            font-size: 1.2rem;
          }

          .lightbox__nav--prev {
            left: var(--space-s, 0.75rem);
          }

          .lightbox__nav--next {
            right: var(--space-s, 0.75rem);
          }

          .lightbox__close {
            top: var(--space-s, 0.75rem);
            right: var(--space-s, 0.75rem);
          }
        }

        /* Loading state */
        .lightbox__image--loading {
          opacity: 0.5;
        }

        /* Prefers reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .lightbox,
          .lightbox__container,
          .lightbox__nav,
          .lightbox__close {
            transition: none;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .lightbox__nav,
          .lightbox__close {
            background: rgba(255, 255, 255, 0.9);
            color: #000000;
          }

          .lightbox__caption {
            background: rgba(0, 0, 0, 0.9);
            color: #ffffff;
          }
        }
      </style>

      <div class="lightbox" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="lightbox-caption">
        <div class="lightbox__container">
          <button class="lightbox__close" type="button" aria-label="Close lightbox">
            ✕
          </button>
          
          <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous image">
            ‹
          </button>
          
          <img class="lightbox__image" alt="" />
          
          <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next image">
            ›
          </button>
          
          <p class="lightbox__caption" id="lightbox-caption"></p>
        </div>
      </div>
    `;

    // Get DOM references
    this.lightboxEl = this.shadowRoot.querySelector(".lightbox");
    this.containerEl = this.shadowRoot.querySelector(".lightbox__container");
    this.imageEl = /** @type {HTMLImageElement} */ (this.shadowRoot.querySelector(".lightbox__image"));
    this.captionEl = this.shadowRoot.querySelector(".lightbox__caption");
    this.closeBtn = /** @type {HTMLButtonElement} */ (this.shadowRoot.querySelector(".lightbox__close"));
    this.prevBtn = /** @type {HTMLButtonElement} */ (this.shadowRoot.querySelector(".lightbox__nav--prev"));
    this.nextBtn = /** @type {HTMLButtonElement} */ (this.shadowRoot.querySelector(".lightbox__nav--next"));

    // Add event listeners
    this.lightboxEl.addEventListener("click", this.handleBackdropClick);
    this.closeBtn.addEventListener("click", () => this.close());
    this.prevBtn.addEventListener("click", () => this.showPrevious());
    this.nextBtn.addEventListener("click", () => this.showNext());

    // Touch events for mobile gestures
    this.containerEl.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    this.containerEl.addEventListener("touchend", this.handleTouchEnd, { passive: false });
  }

  /**
   * Initialize click listeners on all images within the page
   */
  initializeImageListeners() {
    // Find all images in figures that should be lightboxed
    const figures = document.querySelectorAll("figure img.project__img, figure img.project-summary__image");
    
    figures.forEach((_img, index) => {
      const img = /** @type {HTMLImageElement} */ (_img);
      // Store image data
      const figure = img.closest("figure");
      const caption = figure ? figure.querySelector("figcaption") : null;
      
      this.images.push({
        src: img.src,
        alt: img.alt,
        caption: caption ? caption.textContent.trim() : "",
        originalElement: img
      });

      // Add click listener
      img.addEventListener("click", (e) => this.handleImageClick(e, index));
      
      // Add visual indicator that image is clickable
      img.style.cursor = "pointer";
      img.setAttribute("role", "button");
      img.setAttribute("tabindex", "0");
      img.setAttribute("aria-label", `View larger image: ${img.alt}`);
      
      // Add keyboard support for image activation
      img.addEventListener("keydown", (e) => {
        const keyEvent = /** @type {KeyboardEvent} */ (e);
        if (keyEvent.key === "Enter" || keyEvent.key === " ") {
          e.preventDefault();
          this.handleImageClick(e, index);
        }
      });
    });
  }

  /**
   * Remove all image click listeners
   */
  removeImageListeners() {
    this.images.forEach((imageData) => {
      if (imageData.originalElement) {
        imageData.originalElement.removeEventListener("click", this.handleImageClick);
        imageData.originalElement.removeEventListener("keydown", this.handleImageClick);
        imageData.originalElement.style.cursor = "";
        imageData.originalElement.removeAttribute("role");
        imageData.originalElement.removeAttribute("tabindex");
        imageData.originalElement.removeAttribute("aria-label");
      }
    });
  }

  /**
   * Handle image click events
   */
  handleImageClick(event, index) {
    event.preventDefault();
    this.open(index);
  }

  /**
   * Handle backdrop clicks to close lightbox
   */
  handleBackdropClick(event) {
    if (event.target === this.lightboxEl) {
      this.close();
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(event) {
    if (!this.isOpen) return;

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.close();
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.showPrevious();
        break;
      case "ArrowRight":
        event.preventDefault();
        this.showNext();
        break;
    }
  }

  /**
   * Handle touch start for mobile gestures
   */
  handleTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  /**
   * Handle touch end for mobile gestures
   */
  handleTouchEnd(event) {
    if (!this.touchStartX || !this.touchStartY) return;

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const deltaX = this.touchStartX - touchEndX;
    const deltaY = this.touchStartY - touchEndY;

    // Check if it's a horizontal swipe (not vertical scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
      if (deltaX > 0) {
        // Swiped left - show next image
        this.showNext();
      } else {
        // Swiped right - show previous image
        this.showPrevious();
      }
    }

    // Reset touch coordinates
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  /**
   * Handle window resize events
   */
  handleResize() {
    // Could add logic here to adjust lightbox layout on resize if needed
  }

  /**
   * Open the lightbox with a specific image
   */
  open(imageIndex = 0) {
    if (this.images.length === 0) return;

    this.currentImageIndex = Math.max(0, Math.min(imageIndex, this.images.length - 1));
    this.isOpen = true;

    // Store current focus element for restoration
    this.originalFocusElement = document.activeElement;

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Show lightbox
    this.lightboxEl.classList.add("lightbox--open");
    this.lightboxEl.setAttribute("aria-hidden", "false");

    // Load and display the image
    this.loadImage(this.currentImageIndex);

    // Update navigation buttons
    this.updateNavigation();

    // Add keyboard listener
    document.addEventListener("keydown", this.handleKeydown);

    // Focus management - focus the close button
    setTimeout(() => {
      /** @type {HTMLButtonElement} */ (this.closeBtn).focus();
    }, 100);

    // Announce to screen readers
    this.announceToScreenReader(`Lightbox opened. Viewing image ${this.currentImageIndex + 1} of ${this.images.length}.`);
  }

  /**
   * Close the lightbox
   */
  close() {
    if (!this.isOpen) return;

    this.isOpen = false;

    // Restore body scroll
    document.body.style.overflow = "";

    // Hide lightbox
    this.lightboxEl.classList.remove("lightbox--open");
    this.lightboxEl.setAttribute("aria-hidden", "true");

    // Remove keyboard listener
    document.removeEventListener("keydown", this.handleKeydown);

    // Restore focus
    if (this.originalFocusElement) {
      /** @type {HTMLElement} */ (this.originalFocusElement).focus();
      this.originalFocusElement = null;
    }

    // Announce to screen readers
    this.announceToScreenReader("Lightbox closed.");
  }

  /**
   * Show the previous image
   */
  showPrevious() {
    if (this.images.length <= 1) return;
    
    const newIndex = this.currentImageIndex > 0 
      ? this.currentImageIndex - 1 
      : this.images.length - 1;
    
    this.loadImage(newIndex);
    this.currentImageIndex = newIndex;
    this.updateNavigation();
    
    this.announceToScreenReader(`Image ${this.currentImageIndex + 1} of ${this.images.length}.`);
  }

  /**
   * Show the next image
   */
  showNext() {
    if (this.images.length <= 1) return;
    
    const newIndex = this.currentImageIndex < this.images.length - 1 
      ? this.currentImageIndex + 1 
      : 0;
    
    this.loadImage(newIndex);
    this.currentImageIndex = newIndex;
    this.updateNavigation();
    
    this.announceToScreenReader(`Image ${this.currentImageIndex + 1} of ${this.images.length}.`);
  }

  /**
   * Load an image by index
   */
  loadImage(index) {
    if (!this.images[index]) return;

    const imageData = this.images[index];
    
    // Add loading state
    this.imageEl.classList.add("lightbox__image--loading");
    
    // Load the image
    this.imageEl.src = imageData.src;
    this.imageEl.alt = imageData.alt;
    
    // Update caption
    this.captionEl.textContent = imageData.caption;
    
    // Remove loading state when image loads
    this.imageEl.onload = () => {
      this.imageEl.classList.remove("lightbox__image--loading");
    };
  }

  /**
   * Update navigation button states
   */
  updateNavigation() {
    const hasMultipleImages = this.images.length > 1;
    
    // Show/hide navigation buttons based on image count
    if (hasMultipleImages) {
      this.prevBtn.classList.remove("lightbox__nav--single");
      this.nextBtn.classList.remove("lightbox__nav--single");
    } else {
      this.prevBtn.classList.add("lightbox__nav--single");
      this.nextBtn.classList.add("lightbox__nav--single");
    }

    // Update button states (for future implementation of linear navigation)
    this.prevBtn.disabled = false; // Enable cycling
    this.nextBtn.disabled = false; // Enable cycling
  }

  /**
   * Announce messages to screen readers
   */
  announceToScreenReader(message) {
    // Create a temporary element for screen reader announcements
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.style.position = "absolute";
    announcement.style.left = "-10000px";
    announcement.style.width = "1px";
    announcement.style.height = "1px";
    announcement.style.overflow = "hidden";
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    // Remove the announcement element after a short delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Register the custom element
customElements.define("image-lightbox", ImageLightbox);

export default ImageLightbox;
