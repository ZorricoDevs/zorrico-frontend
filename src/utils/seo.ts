// Enhanced SEO Utilities for React Components
// Place this in: src/utils/seo.ts

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
}

export const generateMetaTags = (seo: SEOData) => {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.jpg',
    url = 'https://zorrico.com',
    type = 'website',
    publishDate,
    modifiedDate,
    author = 'Zorrico',
  } = seo;

  return {
    title: `${title} | Zorrico`,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'author', content: author },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      ...(publishDate ? [{ property: 'article:published_time', content: publishDate }] : []),
      ...(modifiedDate ? [{ property: 'article:modified_time', content: modifiedDate }] : []),
    ],
  };
};

// Page-specific SEO data
export const pageSEO = {
  home: {
    title: 'Instant Home Loan Approval | Compare Best Rates from 50+ Banks',
    description:
      'Get instant home loan approval with Zorrico. Compare rates from 50+ banks, calculate EMI, and complete your home loan journey digitally. Trusted by 10,000+ customers.',
    keywords: [
      'zorrico',
      'home loan',
      'instant approval',
      'compare rates',
      'EMI calculator',
      'digital home loan',
      'best home loan rates',
    ],
  },
  homeLoans: {
    title: 'Home Loans - Compare Best Rates & Get Instant Approval',
    description:
      'Explore home loan options from top banks with Zorrico. Get competitive rates, flexible tenure, and instant pre-approval. Apply online for hassle-free home loan processing.',
    keywords: [
      'zorrico home loans',
      'home loan products',
      'home loan rates',
      'home loan comparison',
      'best home loan',
      'home loan apply online',
    ],
  },
  calculator: {
    title: 'Home Loan EMI Calculator | Calculate Monthly Payments',
    description:
      "Use Zorrico's free home loan EMI calculator to calculate monthly payments, total interest, and loan amount. Plan your home purchase with accurate EMI calculations.",
    keywords: [
      'zorrico calculator',
      'EMI calculator',
      'home loan calculator',
      'loan calculator',
      'mortgage calculator',
      'EMI computation',
    ],
  },
  about: {
    title: 'About Zorrico | Leading Digital Home Loan Platform',
    description:
      "Learn about Zorrico, India's trusted digital platform for home loans. Our mission is to make home loan approvals instant and transparent.",
    keywords: [
      'about zorrico',
      'digital home loan platform',
      'fintech company',
      'home loan services',
    ],
  },
  contact: {
    title: 'Contact Us | Zorrico Customer Support',
    description:
      'Get in touch with Zorrico for home loan queries, support, or assistance. Our expert team is ready to help you with your home loan journey.',
    keywords: ['contact zorrico', 'customer support', 'home loan help', 'loan assistance'],
  },
};

// Structured data schemas
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'Zorrico',
  url: 'https://zorrico.com',
  logo: 'https://zorrico.com/logo.png',
  description:
    'Digital platform for instant home loan approvals and rate comparison across 50+ banks in India',
  areaServed: 'IN',
  serviceType: 'Home Loan Services',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressRegion: 'India',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-XXXXXXXXXX',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://www.facebook.com/zorrico',
    'https://www.twitter.com/zorrico',
    'https://www.linkedin.com/company/zorrico',
    'https://www.instagram.com/zorrico_official',
  ],
};

// FAQ Schema for common questions
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How quickly can I get home loan approval?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With Zorrico, you can get instant pre-approval in minutes and final approval within 24-48 hours, depending on document verification.',
      },
    },
    {
      '@type': 'Question',
      name: 'What documents are required for home loan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Basic documents include identity proof, address proof, income proof (salary slips/ITR), bank statements, and property documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I compare home loan rates from different banks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Zorrico allows you to compare home loan rates from 50+ banks and choose the best offer that suits your needs.',
      },
    },
  ],
};

export default {
  generateMetaTags,
  pageSEO,
  organizationSchema,
  faqSchema,
};
