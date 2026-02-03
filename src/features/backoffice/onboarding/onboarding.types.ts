import React from 'react';

/**
 * OnboardingStep - Interface representing a single step in the onboarding process.
 */
export interface OnboardingStep {
  // Summary information about the step
  summary: {
    title: string; // Title of the step
    description?: string; // Brief description of the step
    duration: string; // Estimated duration of the step (e.g., "~10-15 minutes")
  };
  hideGenericStepHeader: undefined | true; // Whether to hide the generic header for this step
  title: React.ReactNode; // Main title of the step
  smallTitle: string; // Short title for progress bar
  description: React.ReactNode; // Brief description of the step
  content: React.ReactNode; // Main content component for the step
  isStepCompleted?: () => Promise<boolean>; // Function to check if the step is completed, so the step can be skipped
  incrementationIsAllowed?: () => Promise<boolean>; // Function to check if moving to the next step is allowed
  onSubmit?: () => Promise<boolean | void>; // Function to handle step submission; returns false to prevent moving to next step
  // Optional confirmation modal configuration before moving to the next step
  confirmationStep?: {
    title: string; // Title of the confirmation modal
    subtitle: string; // Subtitle of the confirmation modal
    submitBtnTxt: string; // Text for the submit button in the confirmation modal
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
  incrementationIsAllowed: boolean; // Whether moving to the next step is allowed
  nextOnboardingStep: OnboardingStep | null; // Next onboarding step object
  incrementStep: () => Promise<void>; // Function to move to the next onboarding step
  skipOnboarding: () => void; // Function to skip the onboarding process
  isLoading: boolean; // Loading state for onboarding actions
  formErrorMessage: string | null; // Error message related to the onboarding form
}
