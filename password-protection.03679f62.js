function e(e,t,o,s){Object.defineProperty(e,t,{get:o,set:s,enumerable:!0,configurable:!0})}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},s={},n=t.parcelRequire9b4d;null==n&&((n=function(e){if(e in o)return o[e].exports;if(e in s){var t=s[e];delete s[e];var n={id:e,exports:{}};return o[e]=n,t.call(n.exports,n,n.exports),n.exports}var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){s[e]=t},t.parcelRequire9b4d=n);var r=n.register;r("g4twZ",function(t,o){e(t.exports,"PasswordProtection",function(){return r}),e(t.exports,"initPasswordProtection",function(){return i});var s=n("S4pv4");class r{constructor(e){this.caseStudyId=e,this.config=(0,s.getCaseStudyConfig)(e),this.storageKey=`${s.PASSWORD_CONFIG.global.storagePrefix}${e}`,this.handleSubmit=this.handleSubmit.bind(this),this.handleCancel=this.handleCancel.bind(this),this.handleKeyPress=this.handleKeyPress.bind(this)}init(){return this.config?this.isAuthenticated()?void this.showContent():void(this.hideContent(),this.showPasswordPrompt()):void console.warn(`No password configuration found for case study: ${this.caseStudyId}`)}isAuthenticated(){try{let e=localStorage.getItem(this.storageKey);if(!e)return!1;let{timestamp:t}=JSON.parse(e),o=Date.now(),n=s.PASSWORD_CONFIG.global.sessionDuration;if(o-t>n)return localStorage.removeItem(this.storageKey),!1;return!0}catch(e){return console.error("Error checking authentication:",e),!1}}authenticate(e){if(e===this.config.password){let e={timestamp:Date.now(),caseStudyId:this.caseStudyId};return localStorage.setItem(this.storageKey,JSON.stringify(e)),!0}return!1}hideContent(){let e=document.querySelector("main"),t=document.querySelector("site-footer");e&&e instanceof HTMLElement&&(e.style.display="none"),t&&t instanceof HTMLElement&&(t.style.display="none")}showContent(){let e=document.querySelector("main"),t=document.querySelector("site-footer");e&&e instanceof HTMLElement&&(e.style.display="block"),t&&t instanceof HTMLElement&&(t.style.display="block");let o=document.getElementById("password-protection-overlay");o&&o.remove()}showPasswordPrompt(){let e=document.createElement("div");e.id="password-protection-overlay",e.className="password-protection-overlay",e.innerHTML=`
      <div class="password-protection-modal">
        <div class="password-protection-content">
          <div class="password-protection-header">
            <h1 class="password-protection-description">${this.config.description}</h1>
          </div>
          
          <form class="password-protection-form" id="password-form">
            <div class="form-group">
              <label for="case-study-password" class="form-label">Password</label>
              <input 
                type="password" 
                id="case-study-password" 
                class="form-input password-input" 
                placeholder="Enter password"
                required
                autocomplete="off"
              >
            </div>
            
            <div class="password-error" id="password-error" style="display: none;">
              Incorrect password. Please try again.
            </div>
            
            <div class="form-actions">
              <button type="button" class="button button--secondary" id="cancel-btn">
                Cancel
              </button>
              <button type="submit" class="button">
                Access Case Study
              </button>
            </div>
          </form>
          

        </div>
      </div>
    `,document.body.appendChild(e);let t=document.getElementById("password-form"),o=document.getElementById("cancel-btn"),s=document.getElementById("case-study-password");t.addEventListener("submit",this.handleSubmit),o.addEventListener("click",this.handleCancel),s.addEventListener("keypress",this.handleKeyPress),setTimeout(()=>s.focus(),100)}handleSubmit(e){e.preventDefault();let t=document.getElementById("case-study-password"),o=document.getElementById("password-error");if(!(t instanceof HTMLInputElement))return void console.error("Password input not found");let s=t.value.trim();this.authenticate(s)?this.showContent():(o&&(o.style.display="block"),t.value="",t.focus(),t.classList.add("shake"),setTimeout(()=>t.classList.remove("shake"),500))}handleCancel(){if(window.history.length>1&&document.referrer)window.history.back();else{let e=this.config.redirectOnCancel||s.PASSWORD_CONFIG.global.defaultRedirect;window.location.href=e}}handleKeyPress(e){"Escape"===e.key&&this.handleCancel()}logout(){localStorage.removeItem(this.storageKey)}static logoutAll(){let e=Object.keys(localStorage),t=s.PASSWORD_CONFIG.global.storagePrefix;e.forEach(e=>{e.startsWith(t)&&localStorage.removeItem(e)})}}function i(e){let t=new r(e);return"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>t.init()):t.init(),t}}),r("S4pv4",function(t,o){e(t.exports,"PASSWORD_CONFIG",function(){return s}),e(t.exports,"getCaseStudyConfig",function(){return n});let s={global:{sessionDuration:864e5,storagePrefix:"protected_case_study_",defaultRedirect:"../work.html"},protectedCaseStudies:{"project-autodesk-di":{password:"CuriousDesign404",title:"Autodesk Fusion: Device Independence Case Study",description:"This case study contains confidential design work. Please enter the password to continue.",redirectOnCancel:"../work.html"}}};function n(e){return s.protectedCaseStudies[e]||null}}),n("g4twZ");
//# sourceMappingURL=password-protection.03679f62.js.map
