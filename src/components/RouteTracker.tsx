import React from 'react';
import { useRouteBodyClass } from '../hooks/useRouteBodyClass';

const RouteTracker: React.FC = () => {
  useRouteBodyClass();
  return null; // This component doesn't render anything
};

export default RouteTracker;
