// SEO Configuration for Zorrico Home Loans Platform
// Optimized for ranking on "Zorrico Home Loans", "Home Loan Eligibility Checker", "Lowest Interest Rate Home Loans"

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  jsonLd?: object;
}

export const seoConfig: Record<string, SEOConfig> = {
  homepage: {
    title:
      'Zorrico - Effortless Home Loan Process & Best Interest Rates | Anonymous Eligibility Checker',
    description:
      'Making home loans effortless with anonymous eligibility checker, unbiased recommendations from 50+ banks. Privacy-first platform for customers, brokers & builders.',
    keywords:
      'zorrico, home loan eligibility checker, best interest rate home loans, effortless home loans, anonymous eligibility check, unbiased home loan comparison, privacy first home loans, home loan brokers platform, builder financing solutions',
    canonical: 'https://zorrico.com/',
    ogTitle:
      'Zorrico - Effortless Home Loans & Best Interest Rates | Anonymous Eligibility Checker',
    ogDescription:
      'Making home loans effortless with unbiased recommendations & best rates from 50+ banks. Check eligibility anonymously without data privacy concerns.',
    twitterTitle: 'Zorrico - Effortless Home Loan Process & Best Rates | Privacy-First Platform',
    twitterDescription:
      'Anonymous home loan eligibility checker with unbiased recommendations from 50+ banks. Making home loans effortless while protecting your privacy.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Zorrico - Effortless Home Loan & Anonymous Eligibility Checker',
      description: 'Privacy-first home loan platform with unbiased recommendations and best rates',
      url: 'https://zorrico.com',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Zorrico',
        url: 'https://zorrico.com',
      },
    },
  },

  eligibilityChecker: {
    title: 'Home Loan Eligibility Checker - Anonymous & Instant | Zorrico',
    description:
      'Check home loan eligibility instantly without sharing personal data. Anonymous eligibility checker with unbiased recommendations from 50+ banks. Privacy-first approach.',
    keywords:
      'home loan eligibility checker, anonymous eligibility check, instant eligibility calculator, home loan eligibility without personal data, privacy first eligibility, zorrico eligibility checker',
    canonical: 'https://zorrico.com/eligibility-checker',
    ogTitle: 'Anonymous Home Loan Eligibility Checker | Zorrico',
    ogDescription:
      'Check your home loan eligibility instantly without sharing personal information. Get unbiased recommendations from 50+ banks.',
    twitterTitle: 'Anonymous Home Loan Eligibility Checker - No Personal Data Required',
    twitterDescription:
      'Instant eligibility check without privacy concerns. Unbiased recommendations from 50+ verified lenders.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Anonymous Home Loan Eligibility Checker',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser',
      description: 'Check home loan eligibility without sharing personal data upfront',
    },
  },

  emiCalculator: {
    title: 'EMI Calculator - Home Loan EMI Calculator | Best Rates | Zorrico',
    description:
      'Calculate home loan EMI with our accurate calculator. Compare EMIs from 50+ banks to find best interest rates. Plan your home loan affordability.',
    keywords:
      'emi calculator, home loan emi calculator, emi calculation, home loan calculator, best emi rates, loan affordability calculator, zorrico emi calculator',
    canonical: 'https://zorrico.com/emi-calculator',
    ogTitle: 'Home Loan EMI Calculator - Compare Best Rates | Zorrico',
    ogDescription:
      'Calculate accurate EMIs and compare rates from 50+ banks. Find the most affordable home loan option for your budget.',
    twitterTitle: 'EMI Calculator - Find Best Home Loan Rates',
    twitterDescription:
      'Calculate and compare EMIs from 50+ banks to secure the most affordable home loan rates.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Home Loan EMI Calculator',
      applicationCategory: 'FinanceApplication',
      description: 'Calculate home loan EMI and compare rates from multiple lenders',
    },
  },

  homeLoans: {
    title: 'Home Loans at Best Interest Rates | 50+ Banks | Zorrico',
    description:
      'Get home loans at best interest rates from 50+ banks. Unbiased recommendations, effortless process, and privacy-first approach. Compare rates instantly.',
    keywords:
      'home loans, best interest rate home loans, home loan rates, best home loan offers, compare home loan rates, effortless home loans, zorrico',
    canonical: 'https://zorrico.com/home-loans',
    ogTitle: 'Home Loans at Best Interest Rates | Zorrico',
    ogDescription:
      'Secure home loans at the best interest rates from 50+ verified banks. Unbiased recommendations and effortless application process.',
    twitterTitle: 'Best Interest Rate Home Loans - Unbiased Recommendations',
    twitterDescription:
      'Compare and secure the best home loan rates from 50+ banks with our effortless, privacy-first platform.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Home Loan Services',
      description: 'Home loans at best interest rates with unbiased recommendations',
    },
  },

  aboutUs: {
    title: 'About Zorrico - Making Home Loans Effortless & Unbiased | Privacy-First Platform',
    description:
      "Learn about Zorrico's mission to make home loans effortless with anonymous eligibility checking, unbiased recommendations, and best rates from 50+ banks.",
    keywords:
      'about zorrico, zorrico company, effortless home loans, unbiased home loan platform, privacy first lending, home loan aggregator',
    canonical: 'https://zorrico.com/about-us',
    ogTitle: 'About Zorrico - Effortless & Unbiased Home Loan Platform',
    ogDescription:
      'Zorrico is revolutionizing home loans with privacy-first approach, unbiased recommendations, and effortless processes for all stakeholders.',
    twitterTitle: 'About Zorrico - Privacy-First Home Loan Platform',
    twitterDescription:
      'Making home loans effortless with anonymous eligibility and unbiased recommendations from 50+ banks.',
  },

  contact: {
    title: 'Contact Zorrico - Home Loan Support & Assistance | Get Help',
    description:
      'Contact Zorrico for home loan assistance, eligibility queries, and support. Get expert guidance for your home loan journey with our dedicated team.',
    keywords:
      'contact zorrico, home loan support, zorrico customer service, home loan assistance, eligibility help, loan guidance',
    canonical: 'https://zorrico.com/contact',
    ogTitle: 'Contact Zorrico - Home Loan Support & Expert Guidance',
    ogDescription:
      'Get expert assistance for your home loan needs. Contact our dedicated team for eligibility queries and loan guidance.',
    twitterTitle: 'Contact Zorrico - Home Loan Support & Expert Help',
    twitterDescription:
      'Need assistance with home loans? Contact our expert team for personalized guidance and support.',
  },

  brokerLogin: {
    title: 'Broker Login - Zorrico Home Loan Platform | Lead Management & Commission Tracking',
    description:
      'Login to Zorrico broker platform. Manage leads, track commissions, and access verified home loan prospects. Comprehensive tools for mortgage brokers.',
    keywords:
      'broker login, mortgage broker platform, lead management, commission tracking, zorrico broker portal, verified leads',
    canonical: 'https://zorrico.com/broker-login',
  },

  builderLogin: {
    title: 'Builder Login - Zorrico Platform | Property Financing Solutions',
    description:
      'Builder login for Zorrico platform. Access financing solutions for your properties, manage buyer leads, and facilitate home loan approvals.',
    keywords:
      'builder login, property financing, builder platform, home loan facilitation, zorrico builder portal',
    canonical: 'https://zorrico.com/builder-login',
  },

  bankerLogin: {
    title: 'Banker Login - Zorrico Platform | Application Processing & Risk Assessment',
    description:
      'Banker login for loan processing, application review, and risk assessment tools. Streamlined workflow for financial institutions.',
    keywords:
      'banker login, loan processing platform, risk assessment tools, application review, zorrico banker portal',
    canonical: 'https://zorrico.com/banker-login',
  },
};

export default seoConfig;
