import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessManager } from '../utils/accessManager';
import LeadCapturePage from '../pages/LeadCapturePage';
import LandingPageTailwind from '../pages/LandingPageTailwind';
import { MetaPixelTracker } from '../utils/metaPixel';

interface LeadCaptureFormData {
  name: string;
  phone: string;
}

const LeadCaptureLandingPage: React.FC = () => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null); // null = loading
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const navigate = useNavigate();

  // Check access on mount
  useEffect(() => {
    const checkAccess = () => {
      setIsCheckingAccess(true);

      // Check if user has already filled the form
      const userHasAccess = AccessManager.hasAccess();

      if (userHasAccess) {
        // Track returning user for landing page
        MetaPixelTracker.trackCustomEvent('ReturningUserLandingAccess', {
          content_name: 'Lead Capture Landing Page Access',
          lead_data: AccessManager.getLeadData(),
        });
      }

      setHasAccess(userHasAccess);
      setIsCheckingAccess(false);
    };

    checkAccess();
  }, []);

  // Handle form submission
  const handleFormSubmit = (formData: LeadCaptureFormData) => {
    // Grant access
    AccessManager.grantAccess(formData);

    // Track successful lead capture from landing page
    MetaPixelTracker.trackCustomEvent('LandingPageLeadCaptureSuccess', {
      content_name: 'Lead Capture Landing Page Completed',
      lead_data: formData,
      value: 0, // No loan amount specified in simplified form
      currency: 'INR',
    });

    // Update access state
    setHasAccess(true);
  };

  // Loading state
  if (isCheckingAccess) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50'>
        <div className='text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-xl'>
            <span className='text-white text-2xl'>🏠</span>
          </div>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600 font-medium'>Loading Zorrico...</p>
        </div>
      </div>
    );
  }

  // Show lead capture if no access
  if (!hasAccess) {
    return <LeadCapturePage onFormSubmit={handleFormSubmit} />;
  }

  // Show landing page content
  return <LandingPageTailwind />;
};

export default LeadCaptureLandingPage;
