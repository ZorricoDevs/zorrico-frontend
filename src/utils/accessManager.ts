// Utility to manage lead capture access control
export class AccessManager {
  private static readonly ACCESS_KEY = 'zorrico_access_granted';
  private static readonly LEAD_DATA_KEY = 'zorrico_lead_data';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Check if user has access to main site
   * Always returns false to ensure gate always shows
   */
  static hasAccess(): boolean {
    // Always require form submission - no persistence
    return false;
  }

  /**
   * Grant access to main site
   */
  static grantAccess(leadData: any): void {
    try {
      localStorage.setItem(this.ACCESS_KEY, 'true');
      localStorage.setItem(
        this.LEAD_DATA_KEY,
        JSON.stringify({
          ...leadData,
          timestamp: new Date().toISOString(),
          source: 'lead_capture_gate',
        })
      );
    } catch (error) {
      console.error('Error granting access:', error);
    }
  }

  /**
   * Clear access (user needs to fill form again)
   */
  static clearAccess(): void {
    try {
      localStorage.removeItem(this.ACCESS_KEY);
      localStorage.removeItem(this.LEAD_DATA_KEY);
    } catch (error) {
      console.error('Error clearing access:', error);
    }
  }

  /**
   * Get stored lead data
   */
  static getLeadData(): any | null {
    try {
      const leadData = localStorage.getItem(this.LEAD_DATA_KEY);
      return leadData ? JSON.parse(leadData) : null;
    } catch (error) {
      console.error('Error getting lead data:', error);
      return null;
    }
  }

  /**
   * Check if this is a returning user (has filled form before)
   */
  static isReturningUser(): boolean {
    try {
      const leadData = localStorage.getItem(this.LEAD_DATA_KEY);
      return !!leadData;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extend access for returning users (auto-login)
   */
  static extendAccess(): void {
    try {
      const leadData = this.getLeadData();
      if (leadData) {
        this.grantAccess(leadData);
      }
    } catch (error) {
      console.error('Error extending access:', error);
    }
  }

  /**
   * For admin/development - bypass lead capture
   */
  static bypassLeadCapture(): void {
    if (process.env.NODE_ENV === 'development') {
      this.grantAccess({
        name: 'Dev User',
        phone: '9999999999',
        source: 'development_bypass',
      });
    }
  }
}

// URL whitelist - pages that don't require lead capture
export const PUBLIC_ROUTES = [
  '/privacy-policy',
  '/privacypolicy',
  '/terms-of-service',
  '/termsofuse',
  '/about',
  '/aboutus',
  '/contact',
  '/careers',
  '/help',
  '/support',
  '/admin/bypass',
  '/dev/access-control',
];

// LEAD CAPTURE ROUTES - Only these routes require the lead capture gate
export const LEAD_CAPTURE_ROUTES = [
  '/apply-instant',
  '/instant-approval',
  '/quick-apply',
  '/apply-now',
  '/get-loan',
  '/loan-application',
];

/**
 * Check if current route requires lead capture gate
 */
export const requiresLeadCapture = (pathname: string): boolean => {
  // Check if route is in lead capture routes
  return LEAD_CAPTURE_ROUTES.some(route => pathname.startsWith(route));
};

/**
 * Check if current route should bypass lead capture
 */
export const shouldBypassLeadCapture = (pathname: string): boolean => {
  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return true;
  }

  // Allow development bypass
  if (process.env.NODE_ENV === 'development' && pathname.includes('?bypass=true')) {
    AccessManager.bypassLeadCapture();
    return true;
  }

  // Default: allow all routes EXCEPT lead capture routes
  return !requiresLeadCapture(pathname);
};
