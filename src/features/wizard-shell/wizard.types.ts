import React from 'react';

export type WizardSectionId = 'inscription' | 'profil' | 'formation';

export interface WizardSection {
  id: WizardSectionId;
  label: string;
  duration?: string;
}

export const WIZARD_SECTIONS: WizardSection[] = [
  { id: 'inscription', label: 'Inscription', duration: '2 minutes' },
  { id: 'profil', label: 'Profil', duration: '3 minutes' },
  { id: 'formation', label: 'Formation', duration: '10 minutes' },
];

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
  sidePanelContent?: React.ReactNode;
  isNextEnabled?: boolean;
  buttonLabel?: string;
  isStepCompleted?: () => Promise<boolean>;
  incrementationIsAllowed?: () => Promise<boolean>;
  onSubmit?: () => Promise<boolean | void>;
  onSkip?: () => Promise<void>;
  confirmationStep?: {
    title: string;
    subtitle: string;
    submitBtnTxt: string;
    id: string;
  };
  section?: WizardSectionId;
}
