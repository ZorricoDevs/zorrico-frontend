// Meta Pixel Event Tracking Utility
// This utility provides type-safe Meta Pixel event tracking

export interface MetaPixelEventData {
  search_term?: string;
  content_name?: string;
  content_type?: string;
  value?: number;
  currency?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: any;
}

export class MetaPixelTracker {
  private static isInitialized(): boolean {
    return typeof window !== 'undefined' && typeof window.fbq === 'function';
  }

  // Track PageView (already done in index.html but can be called manually)
  static trackPageView(): void {
    if (this.isInitialized()) {
      window.fbq('track', 'PageView');
    }
  }

  // Track Search events
  static trackSearch(searchTerm: string): void {
    if (this.isInitialized()) {
      window.fbq('track', 'Search', {
        search_term: searchTerm,
      });
      console.log('Meta Pixel: Search tracked -', searchTerm);
    }
  }

  // Track when user views content (loan details, etc.)
  static trackViewContent(contentName: string, contentType = 'product'): void {
    if (this.isInitialized()) {
      window.fbq('track', 'ViewContent', {
        content_name: contentName,
        content_type: contentType,
      });
      console.log('Meta Pixel: ViewContent tracked -', contentName);
    }
  }

  // Track Lead generation (form submissions)
  static trackLead(leadData?: MetaPixelEventData): void {
    if (this.isInitialized()) {
      window.fbq('track', 'Lead', leadData || {});
      console.log('Meta Pixel: Lead tracked', leadData);
    }
  }

  // Track user registration
  static trackCompleteRegistration(userData?: MetaPixelEventData): void {
    if (this.isInitialized()) {
      window.fbq('track', 'CompleteRegistration', userData || {});
      console.log('Meta Pixel: Registration tracked', userData);
    }
  }

  // Track when user starts application process
  static trackInitiateCheckout(): void {
    if (this.isInitialized()) {
      window.fbq('track', 'InitiateCheckout');
      console.log('Meta Pixel: InitiateCheckout tracked');
    }
  }

  // Track contact form submissions
  static trackContact(): void {
    if (this.isInitialized()) {
      window.fbq('track', 'Contact');
      console.log('Meta Pixel: Contact tracked');
    }
  }

  // Track calculator usage
  static trackCustomEvent(eventName: string, eventData?: MetaPixelEventData): void {
    if (this.isInitialized()) {
      window.fbq('trackCustom', eventName, eventData || {});
      console.log(`Meta Pixel: Custom event tracked - ${eventName}`, eventData);
    }
  }

  // Track loan calculator usage
  static trackLoanCalculatorUsage(loanAmount: number, tenure: number): void {
    this.trackCustomEvent('LoanCalculatorUsed', {
      loan_amount: loanAmount,
      tenure_years: tenure,
      value: loanAmount,
      currency: 'INR',
    });
  }

  // Track eligibility check
  static trackEligibilityCheck(income: number, loanAmount: number): void {
    this.trackCustomEvent('EligibilityCheck', {
      monthly_income: income,
      requested_amount: loanAmount,
      value: loanAmount,
      currency: 'INR',
    });
  }

  // Track bank comparison
  static trackBankComparison(banksCompared: string[]): void {
    this.trackCustomEvent('BankComparison', {
      banks_compared: banksCompared.join(','),
      comparison_count: banksCompared.length,
    });
  }
}

// Global type declaration for window.fbq
declare global {
  interface Window {
    fbq: any;
  }
}
