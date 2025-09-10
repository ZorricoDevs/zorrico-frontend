import React from 'react';
import { Helmet } from 'react-helmet-async';
import { seoConfig, SEOConfig } from '../../config/seoConfig';

interface SEOHeadProps {
  page: string;
  customConfig?: Partial<SEOConfig>;
}

const SEOHead: React.FC<SEOHeadProps> = ({ page, customConfig }) => {
  const config = { ...seoConfig[page], ...customConfig };

  if (!config) {
    console.warn(`SEO config not found for page: ${page}`);
    return null;
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{config.title}</title>
      <meta name='description' content={config.description} />
      <meta name='keywords' content={config.keywords} />

      {/* Canonical URL */}
      {config.canonical && <link rel='canonical' href={config.canonical} />}

      {/* Open Graph Meta Tags */}
      <meta property='og:title' content={config.ogTitle || config.title} />
      <meta property='og:description' content={config.ogDescription || config.description} />
      <meta property='og:url' content={config.canonical || ''} />
      <meta property='og:type' content='website' />
      {config.ogImage && <meta property='og:image' content={config.ogImage} />}
      <meta property='og:site_name' content='Zorrico' />
      <meta property='og:locale' content='en_IN' />

      {/* Twitter Meta Tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={config.twitterTitle || config.ogTitle || config.title} />
      <meta
        name='twitter:description'
        content={config.twitterDescription || config.ogDescription || config.description}
      />
      {config.ogImage && <meta name='twitter:image' content={config.ogImage} />}
      <meta name='twitter:creator' content='@Zorrico' />
      <meta name='twitter:site' content='@Zorrico' />

      {/* Additional SEO Tags */}
      <meta
        name='robots'
        content='index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
      />
      <meta name='googlebot' content='index, follow' />
      <meta name='theme-color' content='#1976d2' />

      {/* JSON-LD Structured Data */}
      {config.jsonLd && <script type='application/ld+json'>{JSON.stringify(config.jsonLd)}</script>}
    </Helmet>
  );
};

export default SEOHead;
