// Analytics Service
// Structure ready for GA/Mixpanel integration

type EventName = 
  | 'game_start'
  | 'game_complete'
  | 'trick_complete'
  | 'theme_change'
  | 'rule_set_selected';

interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, any>;
}

class AnalyticsService {
  private initialized = false;
  private consentGiven = false;

  init(consent: boolean) {
    this.consentGiven = consent;
    this.initialized = true;
    // Initialize external providers here
  }

  track(event: AnalyticsEvent) {
    if (!this.initialized || !this.consentGiven) {
      // Respect DNT / Consent
      // Check navigator.doNotTrack if needed
      return;
    }

    console.log(`[Analytics] ${event.name}`, event.properties);

    // TODO: Send to external service
    // if (window.gtag) window.gtag('event', event.name, event.properties);
  }
}

export const analytics = new AnalyticsService();

