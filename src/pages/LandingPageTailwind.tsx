import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { MetaPixelTracker } from '../utils/metaPixel';
import SEOHead from '../components/SEO/SEOHead';

// Enhanced Bank Logo Component with base64 fallback
const BankLogo = ({
  src,
  fallback,
  alt,
  name,
  fallbackColor,
  darkMode,
}: {
  src: string;
  fallback?: string;
  alt: string;
  name: string;
  fallbackColor: string;
  darkMode: boolean;
}) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleImageError = () => {
    if (fallback && currentSrc !== fallback) {
      // Try base64 fallback first
      setCurrentSrc(fallback);
    } else {
      // Show gradient fallback
      setImageError(true);
    }
  };

  return (
    <div className='aspect-square flex items-center justify-center mb-3 p-2 relative'>
      {!imageError ? (
        <img
          src={currentSrc}
          alt={alt}
          className={`max-w-full max-h-full object-contain transition-all duration-300 ${
            darkMode ? 'brightness-110' : 'brightness-100'
          } hover:scale-105`}
          style={{ maxHeight: '60px' }}
          onError={handleImageError}
        />
      ) : (
        <div
          className={`w-full h-full rounded-xl bg-gradient-to-br ${fallbackColor} flex items-center justify-center text-sm lg:text-base font-bold text-white shadow-lg`}
        >
          {name}
        </div>
      )}
    </div>
  );
};

// Main Component
const LandingPageTailwind: React.FC = () => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  // Indian cities for location dropdown
  const indianCities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Pune',
    'Chennai',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Pimpri & Chinchwad',
    'Patna',
    'Vadodara',
    'Ghaziabad',
    'Ludhiana',
    'Coimbatore',
    'Agra',
    'Madurai',
    'Nashik',
    'Faridabad',
    'Meerut',
    'Rajkot',
    'Kalyan & Dombivali',
    'Vasai Virar',
    'Varanasi',
    'Srinagar',
    'Dhanbad',
    'Jodhpur',
    'Amritsar',
    'Raipur',
    'Allahabad',
    'Gwalior',
    'Jabalpur',
    'Aurangabad',
    'Solapur',
    'Navi Mumbai',
    'Hubli',
  ];

  // Top Indian Banks Data - Using GitHub raw URLs for guaranteed availability
  const topBanks = [
    {
      name: 'SBI',
      logo: 'https://raw.githubusercontent.com/ZorricoDevs/zorrico-frontend/9e10279789e293808885cbb53d9903f6ca625293/public/assets/bank-logos/sbi.svg',
      fallback:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA1NkIzIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNCSTwvdGV4dD4KPC9zdmc+',
      alt: 'State Bank of India',
      fallbackColor: 'from-blue-800 to-blue-900',
    },
    {
      name: 'HDFC Bank',
      logo: 'https://raw.githubusercontent.com/ZorricoDevs/zorrico-frontend/9e10279789e293808885cbb53d9903f6ca625293/public/assets/bank-logos/hdfc.svg',
      fallback:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkYwMDBGIi8+Cjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhERkM8L3RleHQ+Cjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJhbms8L3RleHQ+Cjwvc3ZnPg==',
      alt: 'HDFC Bank',
      fallbackColor: 'from-blue-700 to-blue-800',
    },
    {
      name: 'ICICI Bank',
      logo: 'https://raw.githubusercontent.com/ZorricoDevs/zorrico-frontend/9e10279789e293808885cbb53d9903f6ca625293/public/assets/bank-logos/icici.svg',
      fallback:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkY2QjAwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPklDSUNJPC90ZXh0Pgo8dGV4dCB4PSI1MCIgeT0iNjUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CYW5rPC90ZXh0Pgo8L3N2Zz4=',
      alt: 'ICICI Bank',
      fallbackColor: 'from-orange-600 to-red-600',
    },
    {
      name: 'Axis Bank',
      logo: 'https://raw.githubusercontent.com/ZorricoDevs/zorrico-frontend/9e10279789e293808885cbb53d9903f6ca625293/public/assets/bank-logos/axis.svg',
      fallback:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjOTMzNkIzIi8+Cjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF4aXM8L3RleHQ+Cjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJhbms8L3RleHQ+Cjwvc3ZnPg==',
      alt: 'Axis Bank',
      fallbackColor: 'from-purple-700 to-purple-800',
    },
    {
      name: 'Kotak Bank',
      logo: 'https://raw.githubusercontent.com/ZorricoDevs/zorrico-frontend/refs/heads/main/public/assets/bank-logos/kotak.png',
      fallback:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjREMyNjI2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPktPVEFLPC90ZXh0Pgo8dGV4dCB4PSI1MCIgeT0iNjUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CYW5rPC90ZXh0Pgo8L3N2Zz4=',
      alt: 'Kotak Mahindra Bank',
      fallbackColor: 'from-red-600 to-red-700',
    },
    {
      name: 'PNB',
      logo: 'https://raw.githubusercontent.com/ZorricoDevs/zorrico-frontend/9e10279789e293808885cbb53d9903f6ca625293/public/assets/bank-logos/pnb.svg',
      fallback:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMjU2M0VCIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBOQjwvdGV4dD4KPC9zdmc+',
      alt: 'Punjab National Bank',
      fallbackColor: 'from-blue-600 to-blue-700',
    },
    {
      name: 'Canara Bank',
      logo: 'https://raw.githubusercontent.com/ZorricoDevs/zorrico-frontend/9e10279789e293808885cbb53d9903f6ca625293/public/assets/bank-logos/canara.svg',
      fallback:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkY5OTAwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhbmFyYTwvdGV4dD4KPHRleHQgeD0iNTAiIHk9IjY1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QmFuazwvdGV4dD4KPC9zdmc+',
      alt: 'Canara Bank',
      fallbackColor: 'from-orange-500 to-orange-600',
    },
    {
      name: 'Bank of India',
      logo: 'https://raw.githubusercontent.com/ZorricoDevs/zorrico-frontend/9e10279789e293808885cbb53d9903f6ca625293/public/assets/bank-logos/bankofindia.svg',
      fallback:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNEY0NkU1Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJhbmsgb2Y8L3RleHQ+Cjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkluZGlhPC90ZXh0Pgo8L3N2Zz4=',
      alt: 'Bank of India',
      fallbackColor: 'from-indigo-600 to-indigo-700',
    },
    {
      name: 'Union Bank',
      logo: 'https://raw.githubusercontent.com/ZorricoDevs/zorrico-frontend/refs/heads/main/public/assets/bank-logos/union.png',
      fallback:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMTU4MDNEIi8+Cjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlVuaW9uPC90ZXh0Pgo8dGV4dCB4PSI1MCIgeT0iNjUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CYW5rPC90ZXh0Pgo8L3N2Zz4=',
      alt: 'Union Bank of India',
      fallbackColor: 'from-green-600 to-green-700',
    },
    {
      name: 'IDFC First',
      logo: 'https://raw.githubusercontent.com/ZorricoDevs/zorrico-frontend/9e10279789e293808885cbb53d9903f6ca625293/public/assets/bank-logos/idfc.svg',
      fallback:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjODMzNUQxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPklERkM8L3RleHQ+Cjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZpcnN0PC90ZXh0Pgo8L3N2Zz4=',
      alt: 'IDFC First Bank',
      fallbackColor: 'from-purple-600 to-indigo-600',
    },
  ]; // Unique Features Data
  const uniqueFeatures = [
    {
      icon: '⚡',
      title: 'Instant Eligibility Check',
      highlight: 'Smart System',
      description:
        'Find out your home loan eligibility in just 30 seconds with our smart assessment system. Quick, simple, and hassle-free.',
    },
    {
      icon: '🏦',
      title: 'Compare Multiple Banks',
      highlight: 'Best Offers',
      description:
        'Access exclusive offers from leading banks. Our platform compares multiple options to find your perfect match.',
    },
    {
      icon: '🔒',
      title: 'Secure Process',
      highlight: '256-bit SSL',
      description:
        'Your data is protected with 256-bit SSL encryption and secure processes to ensure complete confidentiality.',
    },
    {
      icon: '📱',
      title: 'Digital First Process',
      highlight: 'Paperless',
      description:
        'Seamless paperless process — upload and verify documents digitally for faster approval.',
    },
    {
      icon: '🎯',
      title: 'Personalized Offers',
      highlight: 'Smart Matching',
      description:
        'Smart matching system recommends the best loan products based on your profile and needs.',
    },
    {
      icon: '👨‍💼',
      title: 'Expert Guidance',
      highlight: 'Dedicated Support',
      description:
        'Our loan advisors guide you through every step of the process with expert advice whenever you need it.',
    },
  ];

  // Track landing page views for Meta Pixel
  useEffect(() => {
    MetaPixelTracker.trackPageView();
    MetaPixelTracker.trackViewContent('Landing Page', 'page');
  }, []);

  return (
    <>
      <SEOHead page='homepage' />
      <div
        className={`min-h-screen transition-all duration-300 ${
          darkMode
            ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        }`}
      >
        {/* Processing Fee Waiver Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='relative overflow-hidden'
        >
          <div className='bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3 px-4 relative'>
            {/* Animated background effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 opacity-50 animate-pulse'></div>

            <div className='relative z-10 flex items-center justify-center'>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='flex items-center space-x-2 text-center'
              >
                <span className='text-lg lg:text-xl'>🎉</span>
                <span className='text-sm sm:text-base lg:text-lg font-bold tracking-wide'>
                  PROCESSING FEE WAIVED – LIMITED PERIOD
                </span>
                <span className='text-lg lg:text-xl'>🎉</span>
              </motion.div>
            </div>

            {/* Blinking effect for urgency */}
            <motion.div
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              className='absolute right-4 top-1/2 transform -translate-y-1/2 hidden sm:block'
            >
              <span className='text-xs lg:text-sm font-semibold bg-white text-red-600 px-2 py-1 rounded-full shadow-md'>
                HURRY!
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Apply Now Button for Mobile - Full width bar positioned above bottom */}
        <motion.button
          onClick={() => {
            // Track mobile button click for Meta Pixel
            MetaPixelTracker.trackInitiateCheckout();
            MetaPixelTracker.trackCustomEvent('MobileApplyNowClicked', {
              content_name: 'Mobile Home Loan Application',
              content_category: 'Finance',
              content_type: 'product',
              value: 1,
              currency: 'INR',
            });
            window.location.href = '/apply-instant';
          }}
          className={`fixed bottom-10 left-3 right-3 z-50 lg:hidden px-6 py-6 rounded-xl font-bold text-white shadow-2xl ${
            darkMode
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          } transition-all duration-300`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1, type: 'spring', stiffness: 500, damping: 15 }}
        >
          Apply Now 🚀
        </motion.button>

        {/* Enhanced Hero Section */}
        <section className='relative py-16 lg:py-24 overflow-hidden'>
          {/* Background Elements */}
          <div className='absolute inset-0'>
            <div className='absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl'></div>
            <div className='absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl'></div>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl'></div>
          </div>

          <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative'>
            <div className='max-w-5xl mx-auto'>
              {/* Main Content - Enhanced Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className='space-y-8 text-center'
              >
                {/* Main Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h1
                    className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Get Your{' '}
                    <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
                      Dream Home Loan
                    </span>
                    <br />
                    Quick & Hassle-Free! ⚡
                  </h1>
                  <p
                    className={`text-xl lg:text-2xl mt-6 leading-relaxed ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Check your eligibility instantly and access offers from 50+ top banks.{' '}
                    <span className='font-bold text-blue-600'>
                      Simple, fast, and transparent process
                    </span>{' '}
                    with the best available rates!
                  </p>
                </motion.div>

                {/* Enhanced Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className='grid grid-cols-2 sm:grid-cols-4 gap-6'
                >
                  {[
                    { value: '₹5Cr', label: 'Home Loan Upto', icon: '💰' },
                    { value: '100%', label: 'Paperwork Done', icon: '😊' },
                    { value: '50+', label: 'Partner Banks', icon: '🏦' },
                    { value: '30 Sec', label: 'Eligibility Check', icon: '⚡' },
                  ].map(stat => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`p-4 lg:p-6 rounded-2xl text-center ${
                        darkMode
                          ? 'bg-slate-800/50 border border-slate-700/50'
                          : 'bg-white/70 border border-white/50'
                      } backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <div className='text-2xl lg:text-3xl mb-2'>{stat.icon}</div>
                      <div
                        className={`text-2xl lg:text-3xl font-bold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {stat.value}
                      </div>
                      <div
                        className={`text-sm lg:text-base font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Value Propositions */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className='space-y-4'
                >
                  {[
                    '✅ Lowest interest rates starting from ~8.35% p.a. (as per bank policy)',
                    '✅ Exclusive offers with reduced/zero processing fees (limited time)',
                    '✅ Unbiased Home Loan comparisons from 50+ top banks',
                    '✅ Expert guidance from experienced loan advisors',
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className={`flex items-center space-x-3 text-lg ${
                        darkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}
                    >
                      <span className='font-medium'>{benefit}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Button for Large Screens */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className='flex justify-center'
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Track button click for Meta Pixel
                      MetaPixelTracker.trackInitiateCheckout();
                      MetaPixelTracker.trackCustomEvent('ApplyNowClicked', {
                        content_name: 'Home Loan Application',
                        content_category: 'Finance',
                        content_type: 'product',
                        value: 1,
                        currency: 'INR',
                      });
                      MetaPixelTracker.trackViewContent('Apply Instant Landing Page', 'page');
                      window.location.href = '/apply-instant';
                    }}
                    className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300'
                  >
                    Start Your Home Loan Journey
                    <svg
                      className='ml-3 w-6 h-6'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 7l5 5m0 0l-5 5m5-5H6'
                      />
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Top Indian Banks Section */}
        <section
          className={`py-16 lg:py-20 ${
            darkMode ? 'bg-slate-800/50' : 'bg-white/70'
          } backdrop-blur-sm`}
        >
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='text-center mb-12'
            >
              <h2
                className={`text-3xl lg:text-4xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Partner Banks & Financial Institutions
              </h2>
              <p
                className={`text-lg lg:text-xl ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                } max-w-3xl mx-auto`}
              >
                We partner with India&apos;s top banks to offer you the best home loan deals with
                competitive interest rates
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8'
            >
              {topBanks.map((bank, index) => (
                <motion.div
                  key={bank.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`p-4 lg:p-6 rounded-2xl ${
                    darkMode
                      ? 'bg-slate-700/50 border border-slate-600/50'
                      : 'bg-white border border-gray-200'
                  } shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
                >
                  <BankLogo
                    src={bank.logo}
                    fallback={bank.fallback}
                    alt={bank.alt}
                    name={bank.name}
                    fallbackColor={bank.fallbackColor}
                    darkMode={darkMode}
                  />
                  <p
                    className={`text-center text-sm font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {bank.name}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='mt-12 text-center'
            >
              <p className={`text-lg font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                ✨ And 25+ more leading financial institutions
              </p>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section
          className={`py-16 lg:py-20 ${
            darkMode
              ? 'bg-gradient-to-br from-slate-900 to-blue-900'
              : 'bg-gradient-to-br from-blue-50 to-indigo-50'
          }`}
        >
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='text-center mb-16'
            >
              <h2
                className={`text-3xl lg:text-4xl font-bold mb-6 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                What Makes Us Different? 🌟
              </h2>
              <p
                className={`text-lg lg:text-xl ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                } max-w-3xl mx-auto`}
              >
                Experience a smarter way of getting home loans with seamless technology and
                personalized service
              </p>
            </motion.div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10'>
              {uniqueFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`p-6 lg:p-8 rounded-2xl ${
                    darkMode
                      ? 'bg-slate-800/50 border border-slate-700/50'
                      : 'bg-white/80 border border-white/50'
                  } backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className='text-4xl lg:text-5xl mb-6'>{feature.icon}</div>
                  <div className='flex items-center space-x-3 mb-4'>
                    <h3
                      className={`text-xl lg:text-2xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {feature.highlight}
                    </span>
                  </div>
                  <p
                    className={`text-base lg:text-lg leading-relaxed ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPageTailwind;
