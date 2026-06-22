import React from 'react';

export interface WizardStep {
  summary: {
    title: string;
    description?: string;
    duration: string;
  };
  hideGenericStepHeader: undefined | true;
  title: React.ReactNode;
  smallTitle: string;
  description: React.ReactNode;
  content: React.ReactNode;
  isStepCompleted?: () => Promise<boolean>;
  incrementationIsAllowed?: () => Promise<boolean>;
  onSubmit?: () => Promise<boolean | void>;
  confirmationStep?: {
    title: string;
    subtitle: string;
    submitBtnTxt: string;
    id: string;
  };
}
