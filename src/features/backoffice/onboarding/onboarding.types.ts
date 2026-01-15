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
  onSubmit?: () => Promise<boolean | void>;
  confirmationStep?: {
    title: string;
    subtitle: string;
    submitBtnTxt: string;
  };
}

/**
 * UseOnboardingReturn - Interface defining the return type of useOnboarding hook.
 */
export interface UseOnboardingReturn {
  onboardingSteps: OnboardingStep[]; // Array of onboarding steps
  totalDuration: string; // Total estimated duration of the onboarding process
  currentOnboardingIdx: number | null; // Index of the current onboarding step
  currentOnboardingStep: OnboardingStep | null; // Current onboarding step object
  currentOnboardingStepContent: React.ReactNode | undefined; // Content component of the current onboarding step
  nextStepAllowed: boolean; // Whether moving to the next step is allowed
  nextOnboardingStep: OnboardingStep | null; // Next onboarding step object
  incrementStep: () => Promise<void>; // Function to move to the next onboarding step
  skipOnboarding: () => void; // Function to skip the onboarding process
  isLoading: boolean; // Loading state for onboarding actions
  formErrorMessage: string | null; // Error message related to the onboarding form
}
