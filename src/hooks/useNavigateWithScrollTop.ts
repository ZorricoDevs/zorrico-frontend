import { useNavigate } from 'react-router-dom';

/**
 * Custom hook that provides navigation with automatic scroll to top
 * This ensures that when users navigate to a new page, they start at the top
 * instead of maintaining the previous page's scroll position
 */
export const useNavigateWithScrollTop = () => {
  const navigate = useNavigate();

  const navigateWithScrollToTop = (path: string, options?: { replace?: boolean }) => {
    navigate(path, options);

    // Small delay to ensure navigation completes before scrolling
    // This is necessary because navigation is asynchronous
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 100);
  };

  return navigateWithScrollToTop;
};

export default useNavigateWithScrollTop;
