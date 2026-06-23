/**
 * Sway Beast Fitness - Analytics Map
 * Strictly tracking only the 7 allowed events.
 */

type AllowedEvent = 
  | 'Assessment Started'
  | 'Assessment Completed'
  | 'Roadmap Viewed'
  | 'Trial Requested'
  | 'Membership Requested'
  | 'WhatsApp Clicked'
  | 'Call Clicked';

interface AnalyticsProperties {
  source?: string;
  medium?: string;
  campaign?: string;
  goal?: string;
  [key: string]: any;
}

export const trackEvent = (eventName: AllowedEvent, properties?: AnalyticsProperties) => {
  // Prevent tracking bloat. Only allowed events pass.
  
  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    properties: {
      ...properties,
      // Default UTMs if not present (to prevent dirty analytics)
      utm_source: properties?.source || 'direct',
      utm_medium: properties?.medium || 'organic',
    }
  };

  // In production, this would fire to Mixpanel/Google Analytics/PostHog
  // For Phase 2 local development, we strictly log to verify the funnel
  console.log(`[Analytics Tracked]: ${eventName}`, payload);
};
