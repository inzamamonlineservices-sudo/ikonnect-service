import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '../lib/analytics';

export const useAnalytics = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Track page views when route changes
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      trackPageView(location);
    }
  }, [location]);

  return null;
};