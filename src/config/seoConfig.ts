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
  landingPage: {
    title: 'Home Loan Application - Easy Home Loan Process | Zorrico',
    description:
      "Apply for home loan with Zorrico's streamlined process. Get competitive interest rates from multiple banks. Expert guidance and personalized loan solutions. Apply now!",
    keywords:
      'home loan application, apply home loan online, competitive home loan rates, home loan approval process, personalized loan solutions, zorrico home loans',
    canonical: 'https://zorrico.com/apply-instant',
    ogTitle: 'Apply for Home Loan - Quick Process & Competitive Rates | Zorrico',
    ogDescription:
      'Apply for home loan with expert guidance and competitive rates. Streamlined process with personalized solutions for your dream home.',
    twitterTitle: 'Home Loan Application - Quick Process & Competitive Rates',
    twitterDescription:
      'Apply for home loan with expert guidance. Competitive rates and personalized solutions. Start your application today!',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Home Loan Application',
      description: 'Apply for home loan with competitive interest rates and expert guidance',
      url: 'https://zorrico.com/apply-instant',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Zorrico',
        url: 'https://zorrico.com',
      },
      provider: {
        '@type': 'Organization',
        name: 'Zorrico',
        description: 'Premium home loan experts providing personalized loan solutions',
      },
      offers: {
        '@type': 'Offer',
        description: 'Home loan application with competitive rates',
        category: 'Financial Service',
      },
    },
  },

  homepage: {
    title: 'Zorrico - Effortless Home Loan Process & Best Interest Rates',
    description:
      'Zorrico - Making home loans effortless with best interest rates. Anonymous eligibility checker, unbiased recommendations from 50+ banks.',
    keywords:
      'zorrico, home loan eligibility checker, best interest rate home loans, effortless home loans, anonymous eligibility check, unbiased home loan comparison, privacy first home loans, home loan brokers platform, builder financing solutions',
    canonical: 'https://zorrico.com/',
    ogTitle: 'Zorrico - Effortless Home Loan Process & Best Interest Rates',
    ogDescription:
      'Making home loans effortless with best interest rates. Anonymous eligibility checker, unbiased recommendations from 50+ banks.',
    twitterTitle: 'Zorrico - Effortless Home Loan Process & Best Interest Rates',
    twitterDescription:
      'Making home loans effortless with best interest rates. Anonymous eligibility checker, unbiased recommendations from 50+ banks.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Zorrico',
      description:
        'Making home loans effortless with best interest rates and anonymous eligibility checker',
      url: 'https://zorrico.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://zorrico.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
      about: {
        '@type': 'FinancialService',
        name: 'Home Loan Services',
        description: 'Anonymous home loan eligibility checker and comparison platform',
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

  newsroom: {
    title: 'Zorrico Newsroom - Latest Updates & Home Loan Industry Insights',
    description:
      'Stay updated with Zorrico latest news, announcements, and home loan industry insights. Market trends, digital banking updates, and platform developments.',
    keywords:
      'zorrico newsroom, home loan news, banking industry updates, financial services news, mortgage market trends, digital banking news',
    canonical: 'https://zorrico.com/newsroom',
    ogTitle: 'Zorrico Newsroom - Latest Home Loan Industry News & Updates',
    ogDescription:
      'Get the latest updates on home loan industry trends, digital banking innovations, and Zorrico platform developments.',
    twitterTitle: 'Zorrico Newsroom - Home Loan Industry News & Updates',
    twitterDescription:
      'Stay informed with latest home loan industry news, market trends, and Zorrico platform updates.',
  },

  careers: {
    title: 'Careers at Zorrico - Join Our Fintech Team | Remote & Office Opportunities',
    description:
      'Join Zorrico fintech team transforming home loan experience. Remote and office opportunities for developers, analysts, and finance professionals.',
    keywords:
      'zorrico careers, fintech jobs, home loan industry careers, remote fintech jobs, software developer jobs, financial analyst jobs',
    canonical: 'https://zorrico.com/careers',
    ogTitle: 'Careers at Zorrico - Transform Home Loan Experience with Us',
    ogDescription:
      'Join our mission to make home loans effortless. Exciting opportunities for developers, analysts, and finance professionals.',
    twitterTitle: 'Careers at Zorrico - Fintech Opportunities',
    twitterDescription:
      'Join our fast-growing fintech platform. Work with us to transform how people experience home loans.',
  },

  termsOfUse: {
    title: 'Terms of Use - Zorrico Home Loan Platform | Legal Terms & Conditions',
    description:
      'Terms of use for Zorrico home loan platform. Legal terms, conditions, and user agreements for customers, brokers, and builders.',
    keywords:
      'zorrico terms of use, legal terms, platform conditions, user agreement, home loan platform terms',
    canonical: 'https://zorrico.com/termsofuse',
  },

  privacyPolicy: {
    title: 'Privacy Policy - Zorrico | Data Protection & Privacy Commitment',
    description:
      'Zorrico privacy policy explaining our commitment to data protection, anonymous eligibility checking, and user privacy safeguards.',
    keywords:
      'zorrico privacy policy, data protection, user privacy, anonymous eligibility, privacy first platform',
    canonical: 'https://zorrico.com/privacypolicy',
  },
};

export default seoConfig;
