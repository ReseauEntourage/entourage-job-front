import React from 'react';

/**
 * OnboardingStep - Interface representing a single step in the onboarding process.
 */
export interface OnboardingStep {
  summary: {
    title: string;
    description?: string;
    duration: string;
  };
  title: React.ReactNode;
  smallTitle: string;
  description: React.ReactNode;
  content: React.ReactNode;
  onSubmit?: () => boolean | void;
}
