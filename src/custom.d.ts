declare module "*.css" {
  const cssText: string;
  export default cssText;
}

// Google Analytics 4 type declarations
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    portfolioAnalytics: {
      trackProjectClick: (projectName: string, projectType: string) => void;
      trackResumeDownload: () => void;
      trackContactForm: (action: string, method?: string) => void;
      trackExternalLink: (url: string, linkText: string) => void;
      trackScrollDepth: () => void;
      trackTimeOnPage: () => void;
    };
  }
  
  function gtag(...args: any[]): void;
}
