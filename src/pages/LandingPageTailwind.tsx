import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { loanAPI } from '../services/api';

// Alert Components
const SuccessAlert = ({ onClose }: { onClose: () => void }) => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className='fixed top-4 right-4 z-50 max-w-md'
    >
      <div
        className={`p-4 rounded-xl shadow-2xl border ${
          darkMode
            ? 'bg-green-900/90 border-green-700 text-green-100'
            : 'bg-green-50 border-green-200 text-green-800'
        } backdrop-blur-sm`}
      >
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <p className='text-sm font-medium'>
              Success! Your application has been submitted. We&apos;ll contact you soon with loan
              offers.
            </p>
          </div>
          <div className='ml-auto pl-3'>
            <button
              onClick={onClose}
              className='inline-flex rounded-md p-1.5 hover:bg-green-200 dark:hover:bg-green-800 transition-colors'
            >
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ErrorAlert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className='fixed top-4 right-4 z-50 max-w-md'
    >
      <div
        className={`p-4 rounded-xl shadow-2xl border ${
          darkMode
            ? 'bg-red-900/90 border-red-700 text-red-100'
            : 'bg-red-50 border-red-200 text-red-800'
        } backdrop-blur-sm`}
      >
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <p className='text-sm font-medium'>{message}</p>
          </div>
          <div className='ml-auto pl-3'>
            <button
              onClick={onClose}
              className='inline-flex rounded-md p-1.5 hover:bg-red-200 dark:hover:bg-red-800 transition-colors'
            >
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const LandingPageTailwind: React.FC = () => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);

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

  // Top Indian Banks Data
  const topBanks = [
    {
      name: 'SBI',
      logo: '/assets/bank-logos/sbi.svg',
      alt: 'State Bank of India',
      fallbackColor: 'from-blue-800 to-blue-900',
    },
    {
      name: 'HDFC Bank',
      logo: '/assets/bank-logos/hdfc.svg',
      alt: 'HDFC Bank',
      fallbackColor: 'from-blue-700 to-blue-800',
    },
    {
      name: 'ICICI Bank',
      logo: '/assets/bank-logos/icici.svg',
      alt: 'ICICI Bank',
      fallbackColor: 'from-orange-600 to-red-600',
    },
    {
      name: 'Axis Bank',
      logo: '/assets/bank-logos/axis.svg',
      alt: 'Axis Bank',
      fallbackColor: 'from-purple-700 to-purple-800',
    },
    {
      name: 'Kotak Bank',
      logo: '/assets/bank-logos/kotak.png',
      alt: 'Kotak Mahindra Bank',
      fallbackColor: 'from-red-600 to-red-700',
    },
    {
      name: 'PNB',
      logo: '/assets/bank-logos/pnb.svg',
      alt: 'Punjab National Bank',
      fallbackColor: 'from-blue-600 to-blue-700',
    },
    {
      name: 'Canara Bank',
      logo: '/assets/bank-logos/canara.svg',
      alt: 'Canara Bank',
      fallbackColor: 'from-orange-500 to-orange-600',
    },
    {
      name: 'Bank of India',
      logo: '/assets/bank-logos/bankofindia.svg',
      alt: 'Bank of India',
      fallbackColor: 'from-indigo-600 to-indigo-700',
    },
    {
      name: 'Union Bank',
      logo: '/assets/bank-logos/union.png',
      alt: 'Union Bank of India',
      fallbackColor: 'from-green-600 to-green-700',
    },
    {
      name: 'IDFC First',
      logo: '/assets/bank-logos/idfc.svg',
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

  const filteredCities = indianCities.filter(city =>
    city.toLowerCase().includes(formData.location.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Transform form data to match backend expected format
      const submissionData = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        propertyLocation: formData.location,
        // Optional fields that can be added later
        occupation: '',
        companyName: '',
        workExperience: '',
        currentAddress: '',
        panNumber: '',
        bankName: '',
        eligibilityDetails: {},
      };

      await loanAPI.submitEligibilityForm(submissionData);
      setShowSuccess(true);
      setFormData({ name: '', phone: '', email: '', location: '' });
      setShowMobileForm(false);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage('Failed to submit application. Please try again.');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
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

      {/* Floating Apply Now Button for Mobile */}
      <motion.button
        onClick={() => setShowMobileForm(true)}
        className={`fixed bottom-6 right-6 z-50 lg:hidden px-6 py-4 rounded-full font-bold text-white shadow-2xl ${
          darkMode
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        } transition-all duration-300`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
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
          <div className='grid lg:grid-cols-12 gap-12 lg:gap-16 items-center'>
            {/* Left Column - Enhanced Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className='lg:col-span-7 space-y-8'
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
                className='hidden lg:block'
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMobileForm(true)}
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

            {/* Right Column - Enhanced Professional Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='lg:col-span-5 relative hidden lg:block'
            >
              {/* Form Background Glow */}
              <div className='absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl'></div>

              <div
                className={`relative p-8 rounded-2xl shadow-2xl ${
                  darkMode
                    ? 'bg-slate-800/90 border border-slate-700/50'
                    : 'bg-white/95 border border-white/50'
                } backdrop-blur-md`}
              >
                {/* Form Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className='text-center mb-8'
                >
                  <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg'>
                    <span className='text-white text-2xl'>🏠</span>
                  </div>
                  <h2
                    className={`text-2xl lg:text-3xl font-bold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Get Your Dream Home Loan
                  </h2>
                  <p
                    className={`text-lg ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    } font-semibold`}
                  >
                    ⚡ Quick eligibility check in 30 seconds
                  </p>
                  <div
                    className={`mt-4 p-3 rounded-lg ${
                      darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'
                    }`}
                  >
                    <p className='text-sm font-semibold'>
                      ✅ 100% Free • Just Effortless Loans • Bank-Grade Security
                    </p>
                  </div>
                </motion.div>

                {/* Form */}
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  onSubmit={handleSubmit}
                  className='space-y-6'
                >
                  {/* Name Field */}
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-3 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Full Name *
                    </label>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      placeholder='Enter your full name'
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 text-lg ${
                        errors.name
                          ? 'border-red-500 focus:border-red-500'
                          : darkMode
                            ? 'border-slate-600 focus:border-blue-500 bg-slate-700 text-white placeholder-gray-400'
                            : 'border-gray-300 focus:border-blue-500 bg-white placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm`}
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-red-500 text-sm mt-2 font-medium'
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-3 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Phone Number *
                    </label>
                    <input
                      type='tel'
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      placeholder='Enter 10-digit mobile number'
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 text-lg ${
                        errors.phone
                          ? 'border-red-500 focus:border-red-500'
                          : darkMode
                            ? 'border-slate-600 focus:border-blue-500 bg-slate-700 text-white placeholder-gray-400'
                            : 'border-gray-300 focus:border-blue-500 bg-white placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm`}
                    />
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-red-500 text-sm mt-2 font-medium'
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-3 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Email Address *
                    </label>
                    <input
                      type='email'
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      placeholder='Enter your email address'
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 text-lg ${
                        errors.email
                          ? 'border-red-500 focus:border-red-500'
                          : darkMode
                            ? 'border-slate-600 focus:border-blue-500 bg-slate-700 text-white placeholder-gray-400'
                            : 'border-gray-300 focus:border-blue-500 bg-white placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm`}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-red-500 text-sm mt-2 font-medium'
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Location Field */}
                  <div className='relative'>
                    <label
                      className={`block text-sm font-semibold mb-3 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Property Location *
                    </label>
                    <input
                      type='text'
                      value={formData.location}
                      onChange={e => {
                        handleInputChange('location', e.target.value);
                        setShowLocationDropdown(true);
                      }}
                      onFocus={() => setShowLocationDropdown(true)}
                      placeholder='Enter city name'
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 text-lg ${
                        errors.location
                          ? 'border-red-500 focus:border-red-500'
                          : darkMode
                            ? 'border-slate-600 focus:border-blue-500 bg-slate-700 text-white placeholder-gray-400'
                            : 'border-gray-300 focus:border-blue-500 bg-white placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm`}
                    />

                    {/* City Dropdown */}
                    {showLocationDropdown && formData.location && filteredCities.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-xl border z-10 ${
                          darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'
                        } shadow-lg`}
                      >
                        {filteredCities.slice(0, 5).map(city => (
                          <button
                            key={city}
                            type='button'
                            onClick={() => {
                              handleInputChange('location', city);
                              setShowLocationDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-opacity-80 transition-colors ${
                              darkMode ? 'hover:bg-slate-600 text-white' : 'hover:bg-gray-100'
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {errors.location && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-red-500 text-sm mt-2 font-medium'
                      >
                        {errors.location}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type='submit'
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-white text-xl transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                    } mt-8`}
                  >
                    {isSubmitting ? (
                      <div className='flex items-center justify-center'>
                        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3'></div>
                        Processing Application...
                      </div>
                    ) : (
                      'Apply Now 🚀'
                    )}
                  </motion.button>
                </motion.form>

                {/* Trust Indicators */}
                <div className='mt-6 pt-6 border-t border-gray-200 dark:border-slate-700'>
                  <div className='flex items-center justify-center space-x-6 text-xs text-gray-500'>
                    <div className='flex items-center'>
                      <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      SSL Secured
                    </div>
                    <div className='flex items-center'>
                      <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Verified Process
                    </div>
                    <div className='flex items-center'>
                      <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
                      </svg>
                      Secured
                    </div>
                  </div>
                </div>
              </div>
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
                <div className='aspect-square flex items-center justify-center mb-3 p-2'>
                  <img
                    src={bank.logo}
                    alt={bank.alt}
                    className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                      darkMode ? 'brightness-110' : 'brightness-100'
                    } hover:scale-105`}
                    style={{ maxHeight: '60px' }}
                    onError={e => {
                      // Fallback to gradient background on error
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div
                    className={`hidden w-full h-full rounded-xl bg-gradient-to-br ${bank.fallbackColor} items-center justify-center text-sm lg:text-base font-bold text-white shadow-lg`}
                  >
                    {bank.name}
                  </div>
                </div>
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

      {/* Mobile Form Modal */}
      <AnimatePresence>
        {showMobileForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden'
            onClick={() => setShowMobileForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
              className={`absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl ${
                darkMode
                  ? 'bg-slate-800 border-t border-slate-700'
                  : 'bg-white border-t border-gray-200'
              } p-6`}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className='flex items-center justify-between mb-6'>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Apply for Home Loan
                </h2>
                <button
                  onClick={() => setShowMobileForm(false)}
                  className={`p-2 rounded-full ${
                    darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                  } transition-colors`}
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Form */}
              <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Name Field */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Full Name *
                  </label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder='Enter your full name'
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500'
                        : darkMode
                          ? 'border-slate-600 focus:border-blue-500 bg-slate-700 text-white placeholder-gray-400'
                          : 'border-gray-300 focus:border-blue-500 bg-white placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                  {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Phone Number *
                  </label>
                  <input
                    type='tel'
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    placeholder='Enter 10-digit mobile number'
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      errors.phone
                        ? 'border-red-500 focus:border-red-500'
                        : darkMode
                          ? 'border-slate-600 focus:border-blue-500 bg-slate-700 text-white placeholder-gray-400'
                          : 'border-gray-300 focus:border-blue-500 bg-white placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                  {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Email Address *
                  </label>
                  <input
                    type='email'
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder='Enter your email address'
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : darkMode
                          ? 'border-slate-600 focus:border-blue-500 bg-slate-700 text-white placeholder-gray-400'
                          : 'border-gray-300 focus:border-blue-500 bg-white placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                  {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
                </div>

                {/* Location Field */}
                <div className='relative'>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Property Location *
                  </label>
                  <input
                    type='text'
                    value={formData.location}
                    onChange={e => {
                      handleInputChange('location', e.target.value);
                      setShowLocationDropdown(true);
                    }}
                    onFocus={() => setShowLocationDropdown(true)}
                    placeholder='Enter city name'
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      errors.location
                        ? 'border-red-500 focus:border-red-500'
                        : darkMode
                          ? 'border-slate-600 focus:border-blue-500 bg-slate-700 text-white placeholder-gray-400'
                          : 'border-gray-300 focus:border-blue-500 bg-white placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />

                  {/* City Dropdown for Mobile */}
                  {showLocationDropdown && formData.location && filteredCities.length > 0 && (
                    <div
                      className={`absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-xl border z-10 ${
                        darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'
                      } shadow-lg`}
                    >
                      {filteredCities.slice(0, 5).map(city => (
                        <button
                          key={city}
                          type='button'
                          onClick={() => {
                            handleInputChange('location', city);
                            setShowLocationDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-opacity-80 transition-colors ${
                            darkMode ? 'hover:bg-slate-600 text-white' : 'hover:bg-gray-100'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}

                  {errors.location && (
                    <p className='text-red-500 text-sm mt-1'>{errors.location}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type='submit'
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                  } mt-6`}
                >
                  {isSubmitting ? (
                    <div className='flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3'></div>
                      Processing...
                    </div>
                  ) : (
                    'Apply Now 🚀'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts */}
      <AnimatePresence>
        {showSuccess && <SuccessAlert onClose={() => setShowSuccess(false)} />}
        {showError && <ErrorAlert message={errorMessage} onClose={() => setShowError(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default LandingPageTailwind;
