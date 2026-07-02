import React from 'react';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { ProfileLivePreviewPanel } from '../ProfileLivePreview/ProfileLivePreviewPanel';
import { CvLoadingAnimation } from './CvLoadingAnimation';

export const useStepCvLoading = () => {
  const onboardingStepCvLoading: WizardStep = {
    summary: {
      title: 'Analyse du CV',
      duration: '~30 secondes',
    },
    hideGenericStepHeader: true,
    title: '',
    smallTitle: 'Analyse',
    description: '',
    content: <CvLoadingAnimation />,
    sidePanelContent: () => <ProfileLivePreviewPanel />,
    mobileBottomSheet: false,
    isNextEnabled: false,
    isStepCompleted: async () => true,
    section: 'profil',
  };

  return { onboardingStepCvLoading };
};
