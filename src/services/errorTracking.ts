// Error Tracking Service
// Structure ready for Sentry integration

interface ErrorContext {
  userAction?: string;
  gameState?: any;
  componentStack?: string;
}

class ErrorTrackingService {

  init() {
    // Sentry.init({...})
  }

  captureException(error: any, context?: ErrorContext) {
    console.error('[ErrorTracker] Captured:', error);
    if (context) {
      console.error('[ErrorTracker] Context:', context);
    }

    // TODO: Send to Sentry
    // Sentry.captureException(error, { extra: context });
  }
}

export const errorTracker = new ErrorTrackingService();

