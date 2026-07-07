import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Experience, User } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import {
  currentUserActions,
  updateProfileSelectors,
} from '@/src/use-cases/current-user';
import { onboardingActions } from '@/src/use-cases/onboarding';
import { StyledOnboardingStepContainer } from '../../../onboarding.styles';
import { ProfileLivePreviewPanel } from '../ProfileLivePreview/ProfileLivePreviewPanel';
import { StepExperiencesContent } from './StepExperiencesContent';

const NULL_USER = { id: '' } as unknown as User;

interface UseStepExperiencesProps {
  user: User | null;
}

export const useStepExperiences = ({ user }: UseStepExperiencesProps) => {
  const dispatch = useDispatch();
  const profileComplete = useCurrentUserProfileComplete();
  const { updateUserProfile } = useUpdateProfile(user ?? NULL_USER);

  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectUpdateProfileStatus
  );

  const [experiences, setExperiences] = useState<Experience[]>(
    (profileComplete?.experiences as Experience[]) ?? []
  );

  useEffect(() => {
    if (profileComplete?.experiences) {
      setExperiences(profileComplete.experiences as Experience[]);
    }
  }, [profileComplete?.experiences]);

  const pendingResolveRef = useRef<((value: boolean) => void) | null>(null);

  useEffect(() => {
    if (!pendingResolveRef.current) {
      return;
    }
    if (updateProfileStatus === ReduxRequestEvents.SUCCEEDED) {
      pendingResolveRef.current(true);
      pendingResolveRef.current = null;
    } else if (updateProfileStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        onboardingActions.setFormErrorMessage(
          'Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.'
        )
      );
      pendingResolveRef.current(false);
      pendingResolveRef.current = null;
    }
  }, [dispatch, updateProfileStatus]);

  const handleChange = useCallback(
    (next: Experience[]) => {
      setExperiences(next);
      dispatch(
        currentUserActions.profileCompleteDraftUpdated({ experiences: next })
      );
    },
    [dispatch]
  );

  const onboardingStepExperiences: WizardStep = {
    summary: {
      title: 'Expériences professionnelles',
      duration: '~2 minutes',
    },
    hideGenericStepHeader: undefined,
    title: 'Vos expériences professionnelles',
    smallTitle: 'Expériences',
    description:
      'Ajoutez vos expériences professionnelles pour compléter votre profil.',
    content: (
      <StyledOnboardingStepContainer>
        <StepExperiencesContent
          experiences={experiences}
          onChange={handleChange}
        />
      </StyledOnboardingStepContainer>
    ),
    sidePanelContent: () => <ProfileLivePreviewPanel />,
    mobileBottomSheet: false,
    isNextEnabled: true,
    isStepCompleted: async () => {
      return (profileComplete?.experiences?.length ?? 0) > 0;
    },
    onSubmit: async () => {
      if (!user) {
        return false;
      }

      return new Promise<boolean>((resolve) => {
        dispatch(currentUserActions.updateProfileReset());
        pendingResolveRef.current = resolve;
        updateUserProfile({ experiences });
      });
    },
    section: 'profil',
  };

  return { onboardingStepExperiences };
};
