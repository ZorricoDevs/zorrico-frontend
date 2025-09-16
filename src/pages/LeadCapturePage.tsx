import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { loanAPI } from '../services/api';

// Simplified form data interface with only name and phone
interface LeadCaptureFormData {
  name: string;
  phone: string;
}

interface LeadCapturePageProps {
  onFormSubmit: (data: LeadCaptureFormData) => void;
}

const LeadCapturePage: React.FC<LeadCapturePageProps> = ({ onFormSubmit }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState<LeadCaptureFormData>({
    name: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<LeadCaptureFormData>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof LeadCaptureFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LeadCaptureFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare data for gate submission (no user email needed)
      const submissionData = {
        fullName: formData.name, // Backend expects 'fullName' field
        phone: formData.phone,
        email: 'no-email@gate.submission', // Marker to indicate no customer email should be sent
        loanAmount: 'Not specified',
        city: 'Not specified',
        source: 'website-form', // Use allowed enum value
        skipCustomerEmail: true, // Flag to skip customer email
      };

      // Use the same API endpoint as the landing page form
      await loanAPI.submitEligibilityForm(submissionData);

      // Call the parent callback
      onFormSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Still proceed with form submission even if API fails
      onFormSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Full-screen professional background */}
      <div
        className={`fixed inset-0 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}
      >
        {/* Subtle pattern overlay */}
        <div className={`absolute inset-0 ${isDark ? 'opacity-5' : 'opacity-10'}`}>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.05'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h40V20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
        {/* Floating geometric shapes */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div
            className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full ${isDark ? 'bg-blue-500/5' : 'bg-blue-200/20'} blur-xl`}
          ></div>
          <div
            className={`absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-200/20'} blur-xl`}
          ></div>
          <div
            className={`absolute top-1/2 right-1/3 w-24 h-24 rounded-full ${isDark ? 'bg-purple-500/5' : 'bg-purple-200/20'} blur-xl`}
          ></div>
        </div>
      </div>

      {/* Content Container */}
      <div className='relative min-h-screen flex items-center justify-center px-4 py-8'>
        <div className='w-full max-w-md mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className='text-center'
          >
            {/* Logo Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='mb-8'
            >
              <div className='inline-flex items-center justify-center w-20 h-20 mb-6 relative'>
                <div
                  className={`absolute inset-0 rounded-2xl ${isDark ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-white to-gray-50'} shadow-2xl`}
                ></div>
                <img
                  src='/zorrico-logo.svg'
                  alt='Zorrico'
                  className='w-12 h-12 relative z-10'
                  onError={e => {
                    // Fallback to emoji if logo fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <span className='text-blue-600 text-3xl font-bold relative z-10 hidden'>Z</span>
              </div>

              <h1
                className={`text-3xl lg:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                Welcome to{' '}
                <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                  Zorrico
                </span>
              </h1>

              <p className={`text-lg mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                India&apos;s Fastest Home Loan Platform
              </p>

              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}
              >
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Quick 2-Second Process • Unbiased comparison from 50+ Banks • Free Guidance
              </div>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`relative p-8 rounded-3xl shadow-2xl backdrop-blur-sm border ${
                isDark ? 'bg-slate-800/90 border-slate-700/50' : 'bg-white/95 border-white/20'
              }`}
            >
              {/* Form Header */}
              <div className='text-center mb-6'>
                <h2
                  className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Get Started in Seconds
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enter your details to unlock exclusive home loan offers
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Name Field */}
                <div className='space-y-2'>
                  <label
                    className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                  >
                    Full Name
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 text-base ${
                        errors.name
                          ? 'border-red-400 focus:border-red-500 bg-red-50'
                          : isDark
                            ? 'border-slate-600 bg-slate-700/50 text-white focus:border-blue-400 focus:bg-slate-700'
                            : 'border-gray-200 bg-white focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder-gray-400`}
                      placeholder='Enter your full name'
                    />
                    <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                      <svg
                        className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-300'}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='text-red-500 text-sm font-medium'
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Phone Field */}
                <div className='space-y-2'>
                  <label
                    className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                  >
                    Mobile Number
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-4'>
                      <span
                        className={`text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        +91
                      </span>
                    </div>
                    <input
                      type='tel'
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-16 pr-12 py-4 rounded-xl border-2 transition-all duration-300 text-base ${
                        errors.phone
                          ? 'border-red-400 focus:border-red-500 bg-red-50'
                          : isDark
                            ? 'border-slate-600 bg-slate-700/50 text-white focus:border-blue-400 focus:bg-slate-700'
                            : 'border-gray-200 bg-white focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder-gray-400`}
                      placeholder='Enter your mobile number'
                      maxLength={10}
                    />
                    <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                      <svg
                        className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-300'}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='text-red-500 text-sm font-medium'
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type='submit'
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02, y: -2 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg shadow-xl transition-all duration-300 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl transform hover:shadow-blue-500/25'
                  }`}
                >
                  {loading ? (
                    <span className='flex items-center justify-center gap-3'>
                      <svg
                        className='animate-spin h-5 w-5'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className='flex items-center justify-center gap-2'>
                      Get My Home Loan Options
                      <svg
                        className='w-5 h-5'
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
                    </span>
                  )}
                </motion.button>
              </form>

              {/* Trust Indicators */}
              <div
                className={`mt-8 p-4 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-gray-50/50'}`}
              >
                <div className='flex items-center justify-center gap-8 text-sm'>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
                      <svg
                        className='w-4 h-4 text-green-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      100% Secure
                    </span>
                  </div>

                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                      <svg
                        className='w-4 h-4 text-blue-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Unbiased Home Loan
                    </span>
                  </div>

                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center'>
                      <svg
                        className='w-4 h-4 text-purple-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Free Guidance
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Footer Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`text-xs mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              By proceeding, you agree to our Terms & Conditions and Privacy Policy
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LeadCapturePage;
