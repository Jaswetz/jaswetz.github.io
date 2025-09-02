declare module "*.css" {
  const cssText: string;
  export default cssText;
}

// Google Analytics 4 & Microsoft Clarity type declarations
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    clarity: (action: string, ...args: any[]) => void;
    portfolioAnalytics: {
      trackProjectClick: (projectName: string, projectType?: string) => void;
      trackResumeDownload: () => void;
      trackContactForm: (action: string, method?: string) => void;
      trackExternalLink: (url: string, linkText?: string) => void;
      trackScrollDepth: () => void;
      trackTimeOnPage: () => void;
      trackCaseStudyInteraction: (
        caseStudyName: string,
        action: string,
        section?: string
      ) => void;
      trackImageLightbox: (imageName: string, caseStudy?: string) => void;
      trackCaseStudyCompletion: (caseStudyName: string) => void;
      setConsent: (granted: boolean) => void;
      getStatus: () => any;
    };
    clarityTracking: {
      trackEvent: (eventName: string, eventData?: any) => void;
      trackProject: (projectName: string, interactionType: string) => void;
      trackResume: () => void;
      trackContact: (action: string) => void;
      trackNavigation: (page: string, source: string) => void;
      setUserID: (userID: string) => void;
      tagUser: (key: string, value: string) => void;
    };
    // Lazy loading functions for code splitting
    loadImageLightbox: () => Promise<any>;
    loadSidebarNavigation: () => Promise<any>;
    loadPasswordProtection: () => Promise<void>;
    enhancedImageLoader?: {
      init(): void;
      setupLazyLoading(): void;
      preloadCriticalImages(): void;
      getStats(): {
        loadedImages: number;
        webpSupported: boolean | null;
        observerSupported: boolean;
      };
    };
  }

  function gtag(...args: any[]): void;
}
