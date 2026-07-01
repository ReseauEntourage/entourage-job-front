import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { currentUserActions } from '@/src/use-cases/current-user';
import { StyledOnboardingStepContainer } from '../../../onboarding.styles';
import { ProfileLivePreviewPanel } from '../ProfileLivePreview/ProfileLivePreviewPanel';
import { StepCvChoiceContent } from './StepCvChoiceContent';
import { ProfileMode } from './types';

interface UseStepCvChoiceProps {
  user: User | null;
  setProfileMode: (mode: ProfileMode) => void;
  triggerAdvance: () => void;
}

export const useStepCvChoice = ({
  user,
  setProfileMode,
  triggerAdvance,
}: UseStepCvChoiceProps) => {
  const dispatch = useDispatch();
  const profileComplete = useCurrentUserProfileComplete();

  const handleCvSelected = useCallback(
    (formData: FormData) => {
      dispatch(currentUserActions.uploadExternalCvRequested({ formData }));
      setProfileMode('cv');
      triggerAdvance();
    },
    [dispatch, setProfileMode, triggerAdvance]
  );

  const handleManualChoice = useCallback(() => {
    setProfileMode('manual');
    triggerAdvance();
  }, [setProfileMode, triggerAdvance]);

  const isCandidate = user?.role === UserRoles.CANDIDATE;

  const onboardingStepCvChoice: WizardStep = {
    summary: {
      title: 'Construction du profil',
      duration: '~3 minutes',
    },
    hideGenericStepHeader: undefined,
    title: isCandidate
      ? "Construisons votre profil : c'est ce que verront les coachs. Deux façons de faire."
      : "Construisons votre profil : c'est ce que verront les personnes que vous soutenez. Deux façons de faire.",
    smallTitle: 'Profil',
    description: '',
    content: (
      <StyledOnboardingStepContainer>
        <StepCvChoiceContent
          onCvSelected={handleCvSelected}
          onManualChoice={handleManualChoice}
        />
      </StyledOnboardingStepContainer>
    ),
    sidePanelContent: () => <ProfileLivePreviewPanel />,
    mobileBottomSheet: true,
    isNextEnabled: false,
    isStepCompleted: async () => {
      return (
        !!profileComplete?.hasExternalCv ||
        (profileComplete?.experiences?.length ?? 0) > 0 ||
        (profileComplete?.formations?.length ?? 0) > 0
      );
    },
    section: 'profil',
  };

  return { onboardingStepCvChoice };
};
