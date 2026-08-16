'use client';

import * as React from 'react';
import { publicEnv } from '@/config/env';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (!publicEnv.gaMeasurementId) {
      return;
    }
    // Load your analytics snippet here only after a measurement ID exists.
  }, []);

  return <>{children}</>;
}
