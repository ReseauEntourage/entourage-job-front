import React from 'react';
import { WizardSectionId } from '@/src/features/wizard-shell/wizard.types';

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
  isNextEnabled?: boolean; // Synchronous reactive flag — when false, the next button is disabled
  isStepCompleted?: () => Promise<boolean>; // Function to check if the step is completed, so the step can be skipped
  incrementationIsAllowed?: () => Promise<boolean>; // Function to check if moving to the next step is allowed
  onSubmit?: () => Promise<boolean | void>; // Function to handle step submission; returns false to prevent moving to next step
  // Optional confirmation modal configuration before moving to the next step
  confirmationStep?: {
    title: string; // Title of the confirmation modal
    subtitle: string; // Subtitle of the confirmation modal
    submitBtnTxt: string; // Text for the submit button in the confirmation modal
    id: string; // ID for the confirmation modal (used for testing)
  };
  section?: WizardSectionId;
}
