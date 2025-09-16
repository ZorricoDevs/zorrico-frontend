import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useRouteBodyClass = () => {
  const location = useLocation();

  useEffect(() => {
    // Set the data-route attribute on the body element
    document.body.setAttribute('data-route', location.pathname);

    // Cleanup function to remove the attribute when component unmounts
    return () => {
      document.body.removeAttribute('data-route');
    };
  }, [location.pathname]);
};
