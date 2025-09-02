# Google Analytics & Search Console Setup Guide

## Google Analytics 4 (GA4) Setup

1. **Create GA4 Property:**
   - Go to https://analytics.google.com
   - Create new property: "HomeLoanMittra"
   - Property Type: Web
   - Business Category: Finance & Insurance
   - Business Size: Small
   - Intended Use: Get insights on customers

2. **Install GA4 Tracking Code:**
   Add this to your index.html <head> section:

   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

3. **Enhanced Ecommerce Events:**
   Track these important events:
   - loan_application_start
   - loan_calculator_use
   - eligibility_check
   - rate_comparison
   - form_submission

## Google Search Console Setup

1. **Add Property:**
   - Go to https://search.google.com/search-console
   - Add property: https://homeloanmittra.com
   - Verify ownership using HTML file method

2. **Submit Sitemap:**
   - Submit: https://homeloanmittra.com/sitemap.xml

3. **Important Pages to Monitor:**
   - Homepage performance
   - Home loans page
   - Calculator pages
   - Contact/application pages

## Google Tag Manager (Recommended)

1. **Create GTM Container:**
   - Go to https://tagmanager.google.com
   - Create container for homeloanmittra.com
   - Install GTM code in <head> and <body>

2. **Key Tags to Set Up:**
   - Google Analytics 4
   - Facebook Pixel (for ads)
   - LinkedIn Insight Tag
   - Conversion tracking

## Search Console HTML Verification File
Create a file named: google[verification-code].html
Content: google-site-verification: google[verification-code].html
Place in: frontend/public/

Replace [verification-code] with actual code from Search Console.
