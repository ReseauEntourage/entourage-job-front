import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formation, User } from '@/src/api/types';
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
import { StepFormationsContent } from './StepFormationsContent';

const NULL_USER = { id: '' } as unknown as User;

interface UseStepFormationsProps {
  user: User | null;
}

export const useStepFormations = ({ user }: UseStepFormationsProps) => {
  const dispatch = useDispatch();
  const profileComplete = useCurrentUserProfileComplete();
  const { updateUserProfile } = useUpdateProfile(user ?? NULL_USER);

  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectUpdateProfileStatus
  );

  const [formations, setFormations] = useState<Formation[]>(
    (profileComplete?.formations as Formation[]) ?? []
  );

  useEffect(() => {
    if (profileComplete?.formations) {
      setFormations(profileComplete.formations as Formation[]);
    }
  }, [profileComplete?.formations]);

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
    (next: Formation[]) => {
      setFormations(next);
      dispatch(
        currentUserActions.profileCompleteDraftUpdated({ formations: next })
      );
    },
    [dispatch]
  );

  const onboardingStepFormations: WizardStep = {
    id: 'formations',
    summary: {
      title: 'Formations',
      duration: '~1 minute',
    },
    hideGenericStepHeader: undefined,
    title: 'Vos formations',
    description: 'Ajoutez vos formations pour compléter votre profil.',
    content: (
      <StyledOnboardingStepContainer>
        <StepFormationsContent
          formations={formations}
          onChange={handleChange}
        />
      </StyledOnboardingStepContainer>
    ),
    sidePanelContent: () => <ProfileLivePreviewPanel />,
    mobileBottomSheet: false,
    isNextEnabled: true,
    isStepCompleted: async () => {
      return (profileComplete?.formations?.length ?? 0) > 0;
    },
    onSubmit: async () => {
      if (!user) {
        return false;
      }

      return new Promise<boolean>((resolve) => {
        dispatch(currentUserActions.updateProfileReset());
        pendingResolveRef.current = resolve;
        updateUserProfile({ formations });
      });
    },
    section: 'profil',
  };

  return { onboardingStepFormations };
};
