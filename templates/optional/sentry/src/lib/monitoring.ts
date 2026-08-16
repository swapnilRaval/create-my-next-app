import { publicEnv } from '@/config/env';

export function initMonitoring() {
  if (!publicEnv.sentryDsn) {
    return;
  }
  // Initialize Sentry here after installing @sentry/nextjs and setting SENTRY_DSN.
}
