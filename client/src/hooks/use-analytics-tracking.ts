import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AnalyticsEvent {
  eventType: string;
  page: string;
  data?: Record<string, any>;
  sessionId?: string;
}

export function useAnalyticsTracking() {
  const [location] = useLocation();
  
  // Generate or get session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('analytics-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics-session-id', sessionId);
    }
    return sessionId;
  };

  const trackEventMutation = useMutation({
    mutationFn: async (event: AnalyticsEvent) => {
      return apiRequest('/api/analytics/event', 'POST', {
        ...event,
        sessionId: event.sessionId || getSessionId()
      });
    }
  });

  // Track page views
  useEffect(() => {
    trackEventMutation.mutate({
      eventType: 'page_view',
      page: location,
      data: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }
    });
  }, [location]);

  // Return function to track custom events
  const trackEvent = (eventType: string, data?: Record<string, any>) => {
    trackEventMutation.mutate({
      eventType,
      page: location,
      data: {
        ...data,
        timestamp: new Date().toISOString()
      }
    });
  };

  return { trackEvent };
}