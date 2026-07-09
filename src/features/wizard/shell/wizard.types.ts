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

export type WizardStepId =
  // Inscription
  | 'nudges'
  | 'sectors-jobs'
  | 'network-preview'
  | 'candidate-info'
  | 'candidate-eligibility'
  | 'coach-info'
  | 'company-role'
  | 'company-selection'
  | 'referer-account'
  | 'account'
  // Confirmation email
  | 'email-confirmation'
  // Onboarding
  | 'social-situation'
  | 'photo'
  | 'cv-choice'
  | 'cv-loading'
  | 'cv-recap'
  | 'presentation'
  | 'experiences'
  | 'formations'
  | 'skills'
  | 'elearning'
  | 'webinar'
  | 'match-recap';

export interface WizardStep {
  /** Identifiant stable permettant de retrouver un step sans dépendre de sa position */
  id: WizardStepId;
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
  /** Évaluée par le moteur à l'arrivée sur l'étape : si true, l'étape est sautée sans interaction utilisateur */
  isAutoSkippable?: () => Promise<boolean>;
  incrementationIsAllowed?: () => Promise<boolean>;
  onSubmit?: () => Promise<boolean | void>;
  section?: WizardSectionId;
}
