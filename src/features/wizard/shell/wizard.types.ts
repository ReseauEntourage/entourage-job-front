import React from 'react';

type WizardSectionId = 'inscription' | 'profil' | 'formation';

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
  hideGenericStepFooter?: boolean;
  title: React.ReactNode;
  smallTitle: string;
  description: React.ReactNode;
  content: React.ReactNode;
  sidePanelContent?: (mode: 'compact' | 'full') => React.ReactNode;
  mobileBottomSheet?: boolean;

  isNextEnabled?: boolean;
  buttonLabel?: string;
  isStepCompleted?: () => Promise<boolean>;
  incrementationIsAllowed?: () => Promise<boolean>;
  onSubmit?: () => Promise<boolean | void>;
  section?: WizardSectionId;
}
