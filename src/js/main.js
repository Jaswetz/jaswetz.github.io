// Main JavaScript file

import SiteHeader from './components/site-header/SiteHeader.js';
import SiteFooter from './components/site-footer/SiteFooter.js';

// Define the custom elements
if (window.customElements) {
    customElements.define('site-header', SiteHeader);
    customElements.define('site-footer', SiteFooter);
} else {
    console.warn('Custom Elements are not supported in this browser. Site may not render correctly.');
    // Optionally, provide fallback rendering or messages here
}

//DOMContentLoaded is no longer needed for the year, 
//as it's handled within the SiteFooter component itself.
//Any other global JS can go here or be further modularized. 