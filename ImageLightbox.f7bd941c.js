(0,("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{}).parcelRequire9b4d.register)("2HRTo",function(t,e){Object.defineProperty(t.exports,"__esModule",{value:!0,configurable:!0}),Object.defineProperty(t.exports,"default",{get:function(){return a},set:void 0,enumerable:!0,configurable:!0});class i extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.isOpen=!1,this.currentImageIndex=0,this.images=[],this.originalFocusElement=null,this.touchStartX=0,this.touchStartY=0,this.minSwipeDistance=50,this.handleKeydown=this.handleKeydown.bind(this),this.handleBackdropClick=this.handleBackdropClick.bind(this),this.handleTouchStart=this.handleTouchStart.bind(this),this.handleTouchEnd=this.handleTouchEnd.bind(this),this.handleImageClick=this.handleImageClick.bind(this),this.handleResize=this.handleResize.bind(this)}connectedCallback(){this.render(),this.initializeImageListeners(),this.addLightboxHint(),window.addEventListener("resize",this.handleResize)}disconnectedCallback(){window.removeEventListener("resize",this.handleResize),this.removeImageListeners(),this.isOpen&&document.removeEventListener("keydown",this.handleKeydown)}render(){this.shadowRoot.innerHTML=`
      <style>
        /* language=CSS */

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
          padding: var(--space-m);
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
          border-radius: var(--border-radius-sm);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .lightbox__caption {
            font-size: var(--size-step--1);
            color: var(--color-surface);
            margin-top: var(--space-xs);
            margin-left: var(--space-xs);
            font-style: italic;
            line-height: var(--leading);
            text-align: center;
        }

        .lightbox__caption:empty {
          display: none;
        }

        .lightbox__instructions {
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          clip-path: inset(50%);
          white-space: nowrap;
        }

        /* Navigation buttons */
        .lightbox__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: var(--touch-target-min);
          height: var(--touch-target-min);
          background: var(--button-bg);
          border: none;
          border-radius: 50%;
          color: var(--button-color);
          cursor: var(--button-cursor);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          transition: var(--button-transition);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .lightbox__nav:hover {
          background: var(--button-bg-hover);
          transform: translateY(-50%) scale(1.1);
        }

        .lightbox__nav:focus {
          outline: var(--focus-outline);
          outline-offset: var(--focus-outline-offset);
        }

        .lightbox__nav:disabled {
          opacity: var(--disabled-opacity);
          cursor: var(--disabled-cursor);
        }

        .lightbox__nav:disabled:hover {
          transform: translateY(-50%) scale(1);
          background: var(--button-bg);
        }

        .lightbox__nav--prev {
          left: var(--space-m);
        }

        .lightbox__nav--next {
          right: var(--space-m);
        }

        .lightbox__nav--single {
          display: none;
        }

        /* Close button */
        .lightbox__close {
          position: absolute;
          top: var(--space-m);
          right: var(--space-m);
          width: var(--touch-target-min);
          height: var(--touch-target-min);
          background: var(--button-bg);
          border: none;
          border-radius: 50%;
          color: var(--button-color);
          cursor: var(--button-cursor);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          transition: var(--button-transition);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .lightbox__close:hover {
          background: var(--button-bg-hover);
          transform: scale(1.1);
        }

        .lightbox__close:focus {
          outline: var(--focus-outline);
          outline-offset: var(--focus-outline-offset);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .lightbox {
            padding: var(--space-s);
          }

          .lightbox__container {
            max-width: 95vw;
            max-height: 95vh;
          }

          .lightbox__image {
            max-height: calc(95vh - 3rem);
          }

          .lightbox__nav {
            width: var(--touch-target-small);
            height: var(--touch-target-small);
            font-size: 1.2rem;
          }

          .lightbox__close {
            width: var(--touch-target-small);
            height: var(--touch-target-small);
            font-size: 1.2rem;
          }

          .lightbox__nav--prev {
            left: var(--space-s);
          }

          .lightbox__nav--next {
            right: var(--space-s);
          }

          .lightbox__close {
            top: var(--space-s);
            right: var(--space-s);
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
            background: rgba(255, 255, 255, 0.95);
            color: #000000;
            border: 2px solid #000000;
          }

          .lightbox__caption {
            background: rgba(0, 0, 0, 0.95);
            color: #ffffff;
            padding: var(--space-xs);
            border-radius: var(--border-radius-sm);
          }

          .lightbox {
            background: rgba(0, 0, 0, 0.95);
          }
        }

        /* Ensure minimum contrast ratios */
        .lightbox__nav,
        .lightbox__close {
          background: rgba(0, 0, 0, 0.8);
          color: #ffffff;
        }

        .lightbox__nav:hover,
        .lightbox__close:hover {
          background: rgba(0, 0, 0, 0.9);
        }

        .lightbox__nav:focus,
        .lightbox__close:focus {
          background: rgba(0, 0, 0, 0.9);
          outline: 3px solid #ffffff;
          outline-offset: 2px;
        }
      </style>

      <div class="lightbox" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="lightbox-caption" aria-describedby="lightbox-instructions">
        <div class="lightbox__container">
          <button class="lightbox__close" type="button" aria-label="Close lightbox (Escape key)">
            \u{2715}
          </button>
          
          <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous image (Left arrow key)">
            \u{2039}
          </button>
          
          <img class="lightbox__image" alt="Lightbox image placeholder" role="img" />
          
          <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next image (Right arrow key)">
            \u{203A}
          </button>
          
          <p class="lightbox__caption" id="lightbox-caption"></p>
          <div class="lightbox__instructions" id="lightbox-instructions" aria-live="polite" aria-atomic="true">
            Use arrow keys to navigate between images, or Escape to close.
          </div>
        </div>
      </div>
    `,this.lightboxEl=this.shadowRoot.querySelector(".lightbox"),this.containerEl=this.shadowRoot.querySelector(".lightbox__container"),this.imageEl=this.shadowRoot.querySelector(".lightbox__image"),this.captionEl=this.shadowRoot.querySelector(".lightbox__caption"),this.instructionsEl=this.shadowRoot.querySelector(".lightbox__instructions"),this.closeBtn=this.shadowRoot.querySelector(".lightbox__close"),this.prevBtn=this.shadowRoot.querySelector(".lightbox__nav--prev"),this.nextBtn=this.shadowRoot.querySelector(".lightbox__nav--next"),this.lightboxEl.addEventListener("click",this.handleBackdropClick),this.closeBtn.addEventListener("click",()=>this.close()),this.prevBtn.addEventListener("click",()=>this.showPrevious()),this.nextBtn.addEventListener("click",()=>this.showNext()),this.containerEl.addEventListener("touchstart",this.handleTouchStart,{passive:!1}),this.containerEl.addEventListener("touchend",this.handleTouchEnd,{passive:!1})}addLightboxHint(){if(document.getElementById("lightbox-hint"))return;let t=document.createElement("div");t.id="lightbox-hint",t.style.position="absolute",t.style.left="-10000px",t.style.width="1px",t.style.height="1px",t.style.overflow="hidden",t.style.clip="rect(0, 0, 0, 0)",t.style.clipPath="inset(50%)",t.style.whiteSpace="nowrap",t.textContent="Click or press Enter to view in lightbox",document.body.appendChild(t)}initializeImageListeners(){document.querySelectorAll("figure img.project__img, figure img.project-summary__image").forEach((t,e)=>{let i=t.closest("figure"),a=i?i.querySelector("figcaption"):null;this.images.push({src:t.src,alt:t.alt,caption:a?a.textContent.trim():"",originalElement:t}),t.addEventListener("click",t=>this.handleImageClick(t,e)),t.style.cursor="pointer",t.setAttribute("role","button"),t.setAttribute("tabindex","0"),t.setAttribute("aria-label",`View larger image: ${t.alt||"Unlabeled image"}`),t.setAttribute("aria-describedby","lightbox-hint"),t.addEventListener("keydown",t=>{("Enter"===t.key||" "===t.key||"Space"===t.key)&&(t.preventDefault(),this.handleImageClick(t,e))})})}removeImageListeners(){this.images.forEach(t=>{t.originalElement&&(t.originalElement.removeEventListener("click",this.handleImageClick),t.originalElement.removeEventListener("keydown",this.handleImageClick),t.originalElement.style.cursor="",t.originalElement.removeAttribute("role"),t.originalElement.removeAttribute("tabindex"),t.originalElement.removeAttribute("aria-label"))})}handleImageClick(t,e){t.preventDefault(),this.open(e)}handleBackdropClick(t){t.target===this.lightboxEl&&this.close()}handleKeydown(t){if(this.isOpen)switch(t.key){case"Escape":t.preventDefault(),this.close();break;case"ArrowLeft":t.preventDefault(),this.showPrevious();break;case"ArrowRight":t.preventDefault(),this.showNext();break;case"Tab":this.trapFocus(t);break;case"Home":t.preventDefault(),this.images.length>0&&(this.loadImage(0),this.currentImageIndex=0,this.updateNavigation(),this.announceToScreenReader(`First image. Image 1 of ${this.images.length}.`));break;case"End":if(t.preventDefault(),this.images.length>0){let t=this.images.length-1;this.loadImage(t),this.currentImageIndex=t,this.updateNavigation(),this.announceToScreenReader(`Last image. Image ${this.images.length} of ${this.images.length}.`)}}}trapFocus(t){let e=this.shadowRoot.querySelectorAll('button:not([disabled]), [tabindex]:not([tabindex="-1"])'),i=e[0],a=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),a.focus()):t.shiftKey||document.activeElement!==a||(t.preventDefault(),i.focus())}handleTouchStart(t){this.touchStartX=t.touches[0].clientX,this.touchStartY=t.touches[0].clientY}handleTouchEnd(t){if(!this.touchStartX||!this.touchStartY)return;let e=t.changedTouches[0].clientX,i=t.changedTouches[0].clientY,a=this.touchStartX-e;Math.abs(a)>Math.abs(this.touchStartY-i)&&Math.abs(a)>this.minSwipeDistance&&(a>0?this.showNext():this.showPrevious()),this.touchStartX=0,this.touchStartY=0}handleResize(){}open(t=0){if(0===this.images.length)return;this.currentImageIndex=Math.max(0,Math.min(t,this.images.length-1)),this.isOpen=!0,this.originalFocusElement=document.activeElement,document.body.style.overflow="hidden",this.lightboxEl.classList.add("lightbox--open"),this.lightboxEl.setAttribute("aria-hidden","false"),this.loadImage(this.currentImageIndex),this.updateNavigation(),document.addEventListener("keydown",this.handleKeydown),setTimeout(()=>{this.closeBtn.focus()},100);let e=this.images.length,i=this.currentImageIndex+1,a=this.images[this.currentImageIndex],o=`Lightbox opened. Viewing image ${i} of ${e}`;a.caption&&(o+=`. Image caption: ${a.caption}`),e>1&&(o+=". Use arrow keys to navigate between images."),o+=" Press Escape to close.",this.announceToScreenReader(o)}close(){this.isOpen&&(this.isOpen=!1,document.body.style.overflow="",this.lightboxEl.classList.remove("lightbox--open"),this.lightboxEl.setAttribute("aria-hidden","true"),document.removeEventListener("keydown",this.handleKeydown),this.originalFocusElement&&(this.originalFocusElement.focus(),this.originalFocusElement=null),this.announceToScreenReader("Lightbox closed."))}showPrevious(){if(this.images.length<=1)return;let t=this.currentImageIndex>0?this.currentImageIndex-1:this.images.length-1;this.loadImage(t),this.currentImageIndex=t,this.updateNavigation();let e=this.images[this.currentImageIndex],i=`Previous image. Now viewing image ${this.currentImageIndex+1} of ${this.images.length}`;e.caption&&(i+=`. ${e.caption}`),this.announceToScreenReader(i)}showNext(){if(this.images.length<=1)return;let t=this.currentImageIndex<this.images.length-1?this.currentImageIndex+1:0;this.loadImage(t),this.currentImageIndex=t,this.updateNavigation();let e=this.images[this.currentImageIndex],i=`Next image. Now viewing image ${this.currentImageIndex+1} of ${this.images.length}`;e.caption&&(i+=`. ${e.caption}`),this.announceToScreenReader(i)}loadImage(t){if(!this.images[t])return;let e=this.images[t];this.imageEl.classList.add("lightbox__image--loading");let i=new Image;i.onload=()=>{this.imageEl.src=e.src,this.imageEl.alt=e.alt||`Image ${t+1} of ${this.images.length}`,this.imageEl.classList.remove("lightbox__image--loading"),this.imageEl.setAttribute("aria-label",e.alt?`${e.alt}. Image ${t+1} of ${this.images.length}`:`Image ${t+1} of ${this.images.length}`)},i.onerror=()=>{console.warn(`Failed to load image: ${e.src}`),this.imageEl.src=e.src,this.imageEl.alt=e.alt,this.imageEl.classList.remove("lightbox__image--loading"),this.imageEl.setAttribute("aria-label",`Failed to load image ${t+1} of ${this.images.length}${e.alt?`: ${e.alt}`:""}`),this.announceToScreenReader(`Error loading image ${t+1}. ${e.alt||"No description available"}.`)},i.src=e.src,this.captionEl.textContent=e.caption}updateNavigation(){this.images.length>1?(this.prevBtn.classList.remove("lightbox__nav--single"),this.nextBtn.classList.remove("lightbox__nav--single")):(this.prevBtn.classList.add("lightbox__nav--single"),this.nextBtn.classList.add("lightbox__nav--single")),this.prevBtn.disabled=!1,this.nextBtn.disabled=!1}announceToScreenReader(t,e="polite"){let i=document.createElement("div");i.setAttribute("aria-live",e),i.setAttribute("aria-atomic","true"),i.style.position="absolute",i.style.left="-10000px",i.style.width="1px",i.style.height="1px",i.style.overflow="hidden",i.style.clip="rect(0, 0, 0, 0)",i.style.clipPath="inset(50%)",i.style.whiteSpace="nowrap",document.body.appendChild(i),setTimeout(()=>{i.textContent=t},10),setTimeout(()=>{i.parentNode&&document.body.removeChild(i)},1500)}}customElements.define("image-lightbox",i);var a=i});
//# sourceMappingURL=ImageLightbox.f7bd941c.js.map
