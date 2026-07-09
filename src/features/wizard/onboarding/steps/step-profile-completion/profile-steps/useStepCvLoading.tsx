import React from 'react';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { ProfileLivePreviewPanel } from '../ProfileLivePreview/ProfileLivePreviewPanel';
import { CvLoadingAnimation } from './CvLoadingAnimation';

interface UseStepCvLoadingProps {
  onManualFallback: () => void;
}

export const useStepCvLoading = ({
  onManualFallback,
}: UseStepCvLoadingProps) => {
  const onboardingStepCvLoading: WizardStep = {
    id: 'cv-loading',
    summary: {
      title: 'Analyse du CV',
      duration: '~30 secondes',
    },
    hideGenericStepHeader: true,
    title: '',
    smallTitle: 'Analyse',
    description: '',
    content: <CvLoadingAnimation onManualFallback={onManualFallback} />,
    sidePanelContent: () => <ProfileLivePreviewPanel />,
    mobileBottomSheet: false,
    isNextEnabled: false,
    isStepCompleted: async () => true,
    section: 'profil',
  };

  return { onboardingStepCvLoading };
};
