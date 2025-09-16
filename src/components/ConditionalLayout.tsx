import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Routes where we don't want header and footer (lead capture gates)
  const noLayoutRoutes = [
    '/apply-instant',
    '/instant-approval',
    '/quick-apply',
    '/apply-now',
    '/get-loan',
    '/loan-application',
  ];

  // Check if current route should not have layout
  const shouldHideLayout = noLayoutRoutes.includes(location.pathname);

  if (shouldHideLayout) {
    // For lead capture routes, render without header/footer
    return <main style={{ minHeight: '100vh' }}>{children}</main>;
  }

  // For all other routes, render with header and footer
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 88px)' }}>{children}</main>
      <Footer />
    </>
  );
};

export default ConditionalLayout;
