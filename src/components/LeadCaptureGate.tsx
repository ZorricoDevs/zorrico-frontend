import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AccessManager,
  shouldBypassLeadCapture,
  requiresLeadCapture,
} from '../utils/accessManager';
import LeadCapturePage from '../pages/LeadCapturePage';
import { MetaPixelTracker } from '../utils/metaPixel';

interface LeadCaptureGateProps {
  children: React.ReactNode;
}

interface LeadCaptureFormData {
  name: string;
  phone: string;
}

const LeadCaptureGate: React.FC<LeadCaptureGateProps> = ({ children }) => {
  const location = useLocation();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null); // null = loading
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // Check access on mount and route changes
  useEffect(() => {
    const checkAccess = () => {
      setIsCheckingAccess(true);

      // Check if current route should bypass lead capture (main website)
      if (shouldBypassLeadCapture(location.pathname)) {
        setHasAccess(true);
        setIsCheckingAccess(false);
        return;
      }

      // Check if current route requires lead capture
      if (!requiresLeadCapture(location.pathname)) {
        setHasAccess(true);
        setIsCheckingAccess(false);
        return;
      }

      // Route requires lead capture - check if user has already filled the form
      const userHasAccess = AccessManager.hasAccess();

      if (userHasAccess) {
        // Track returning user
        MetaPixelTracker.trackCustomEvent('ReturningUserAccess', {
          content_name: 'Returning User Access',
          lead_data: AccessManager.getLeadData(),
        });
      }

      setHasAccess(userHasAccess);
      setIsCheckingAccess(false);
    };

    checkAccess();
  }, [location.pathname]);

  // Handle form submission
  const handleFormSubmit = (formData: LeadCaptureFormData) => {
    // Grant access
    AccessManager.grantAccess(formData);

    // Track successful lead capture
    MetaPixelTracker.trackCustomEvent('LeadCaptureSuccess', {
      content_name: 'Lead Capture Gate Completed',
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

  // Show main application
  return <>{children}</>;
};

export default LeadCaptureGate;
