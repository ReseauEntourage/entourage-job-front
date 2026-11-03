import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from '@/src/api';
import { User } from '@/src/api/types';
import { GA_TAGS } from '@/src/constants/tags';
import { UserRoles } from '@/src/constants/users';
import {
  WizardStep,
  WizardStepId,
} from '@/src/features/wizard/shell/wizard.types';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { gaEvent } from '@/src/lib/gtag';
import { currentUserActions } from '@/src/use-cases/current-user';
import { StyledOnboardingStepContainer } from '../../../onboarding.styles';
import { ProfileLivePreviewPanel } from '../ProfileLivePreview/ProfileLivePreviewPanel';
import { StepCvChoiceContent } from './StepCvChoiceContent';
import { ProfileMode } from './types';

interface UseStepCvChoiceProps {
  user: User | null;
  requestAdvanceWithProfileMode: (
    stepId: WizardStepId,
    nextMode: ProfileMode
  ) => void;
}

export const useStepCvChoice = ({
  user,
  requestAdvanceWithProfileMode,
}: UseStepCvChoiceProps) => {
  const dispatch = useDispatch();
  const profileComplete = useCurrentUserProfileComplete();

  const handleCvSelected = useCallback(
    (formData: FormData) => {
      dispatch(currentUserActions.uploadExternalCvRequested({ formData }));
      requestAdvanceWithProfileMode('cv-choice', 'cv');
    },
    [dispatch, requestAdvanceWithProfileMode]
  );

  const handleManualChoice = useCallback(() => {
    requestAdvanceWithProfileMode('cv-choice', 'manual');
  }, [requestAdvanceWithProfileMode]);

  // "Je le remplis plus tard": stored on the account so that a later resume
  // of the onboarding never brings the user back to this step. With the
  // 'pending' mode no CV/manual step is inserted: the next step is the one
  // after the profile section.
  const [isSkipping, setIsSkipping] = useState(false);
  const handleSkip = useCallback(async () => {
    if (!user) {
      return;
    }
    setIsSkipping(true);
    try {
      const skippedAt = new Date().toISOString();
      await Api.putUser(user.id, { onboardingProfileSkippedAt: skippedAt });
      dispatch(
        currentUserActions.updateUserSucceeded({
          user: { onboardingProfileSkippedAt: skippedAt },
        })
      );
      gaEvent(GA_TAGS.ONBOARDING_PROFILE_SKIP_CLIC);
      requestAdvanceWithProfileMode('cv-choice', 'pending');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSkipping(false);
    }
  }, [user, dispatch, requestAdvanceWithProfileMode]);

  const isCandidate = user?.role === UserRoles.CANDIDATE;

  const onboardingStepCvChoice: WizardStep = {
    id: 'cv-choice',
    summary: {
      title: 'Construction du profil',
      duration: '~3 minutes',
    },
    hideGenericStepHeader: undefined,
    title: isCandidate
      ? "Construisons votre profil : c'est ce que verront les coachs. Deux façons de faire."
      : "Construisons votre profil : c'est ce que verront les personnes que vous soutenez. Deux façons de faire.",
    description: '',
    content: (
      <StyledOnboardingStepContainer>
        <StepCvChoiceContent
          onCvSelected={handleCvSelected}
          onManualChoice={handleManualChoice}
          onSkip={handleSkip}
          isSkipping={isSkipping}
        />
      </StyledOnboardingStepContainer>
    ),
    sidePanelContent: () => <ProfileLivePreviewPanel />,
    mobileBottomSheet: false,
    isNextEnabled: false,
    isStepCompleted: async () => {
      return (
        !!user?.onboardingProfileSkippedAt ||
        !!profileComplete?.hasExternalCv ||
        (profileComplete?.experiences?.length ?? 0) > 0 ||
        (profileComplete?.formations?.length ?? 0) > 0
      );
    },
    section: 'profil',
  };

  return { onboardingStepCvChoice };
};
