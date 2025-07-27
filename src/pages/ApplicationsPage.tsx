import React, { useEffect, useState } from "react";
import FinanceLoader from '../components/UI/FinanceLoader';

const ApplicationsPage = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return <FinanceLoader />;
  }
  return <div>Applications Page</div>;
};
export default ApplicationsPage;
