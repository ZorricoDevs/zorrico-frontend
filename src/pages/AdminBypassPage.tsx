import React from 'react';
import { AccessManager } from '../utils/accessManager';

const AdminBypassPage: React.FC = () => {
  const handleBypass = () => {
    AccessManager.bypassLeadCapture();
    window.location.href = '/';
  };

  const handleClearAccess = () => {
    AccessManager.clearAccess();
    window.location.href = '/';
  };

  const leadData = AccessManager.getLeadData();
  const hasAccess = AccessManager.hasAccess();

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>Access Denied</h1>
          <p className='text-gray-600'>This page is only available in development mode.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6'>
        <h1 className='text-2xl font-bold mb-6 text-gray-800'>Lead Capture Gate - Admin Control</h1>

        <div className='space-y-6'>
          {/* Current Status */}
          <div className='p-4 bg-blue-50 rounded-lg'>
            <h2 className='text-lg font-semibold mb-2 text-blue-800'>Current Status</h2>
            <p className={`font-medium ${hasAccess ? 'text-green-600' : 'text-red-600'}`}>
              Access: {hasAccess ? '✅ GRANTED' : '❌ DENIED'}
            </p>
            {leadData && (
              <div className='mt-2 text-sm text-gray-600'>
                <p>
                  Lead: {leadData.name} ({leadData.email})
                </p>
                <p>Phone: {leadData.phone}</p>
                <p>Loan Amount: {leadData.loanAmount}</p>
                <p>City: {leadData.city}</p>
                <p>Captured: {new Date(leadData.timestamp).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className='space-y-4'>
            <button
              onClick={handleBypass}
              className='w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors'
            >
              🚀 Bypass Lead Capture (Dev Mode)
            </button>

            <button
              onClick={handleClearAccess}
              className='w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors'
            >
              🗑️ Clear Access (Force Lead Capture)
            </button>
          </div>

          {/* Instructions */}
          <div className='p-4 bg-yellow-50 rounded-lg'>
            <h3 className='text-lg font-semibold mb-2 text-yellow-800'>Development Instructions</h3>
            <ul className='text-sm text-yellow-700 space-y-1'>
              <li>
                • Use &quot;Bypass&quot; to access the main site without filling the lead form
              </li>
              <li>• Use &quot;Clear Access&quot; to test the lead capture gate</li>
              <li>• Access expires after 24 hours automatically</li>
              <li>
                • Add <code>?bypass=true</code> to any URL for instant bypass
              </li>
              <li>• Public routes (privacy, terms, etc.) always bypass lead capture</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className='p-4 bg-gray-50 rounded-lg'>
            <h3 className='text-lg font-semibold mb-2 text-gray-800'>Quick Links</h3>
            <div className='space-y-2'>
              <a href='/' className='block text-blue-600 hover:underline'>
                🏠 Homepage
              </a>
              <a href='/?bypass=true' className='block text-blue-600 hover:underline'>
                🏠 Homepage (with bypass)
              </a>
              <a href='/privacy-policy' className='block text-blue-600 hover:underline'>
                📄 Privacy Policy (public route)
              </a>
              <a href='/eligibility-checker' className='block text-blue-600 hover:underline'>
                🧮 Eligibility Checker
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBypassPage;
