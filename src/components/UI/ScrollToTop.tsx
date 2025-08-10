import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Automatically scrolls to the top of the page when the route changes
 * This ensures users always start at the top of a new page
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the pathname changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
