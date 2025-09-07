// Optional: Enhanced Google Analytics tracking for React
// Add this to components where you want custom event tracking

// Track page views manually (optional - GA does this automatically)
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-YCWEM6SBW1', {
      page_path: path,
    });
  }
};

// Track custom events (e.g., loan application started)
export const trackEvent = (action: string, category: string, label?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};

// Usage examples:
// trackEvent('loan_application_started', 'user_actions', 'home_loan');
// trackEvent('calculator_used', 'tools', 'emi_calculator');
// trackEvent('bank_comparison', 'user_actions', 'rate_comparison');

// TypeScript declaration for gtag (add to types file)
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
