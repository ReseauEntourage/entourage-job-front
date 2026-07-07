import React, { useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '@/src/api/types';
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
import { StepPresentationContent } from './StepPresentationContent';

const NULL_USER = { id: '' } as unknown as User;

interface PresentationFormValues {
  introduction: string;
}

interface UseStepPresentationProps {
  user: User | null;
}

export const useStepPresentation = ({ user }: UseStepPresentationProps) => {
  const dispatch = useDispatch();
  const profileComplete = useCurrentUserProfileComplete();
  const { updateUserProfile } = useUpdateProfile(user ?? NULL_USER);

  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectUpdateProfileStatus
  );

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

  const initialValues = useMemo<PresentationFormValues>(
    () => ({
      introduction: profileComplete?.introduction ?? '',
    }),
    [profileComplete?.introduction]
  );

  const formMethods = useForm<PresentationFormValues>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const hasPrefilledRef = useRef(false);
  useEffect(() => {
    if (hasPrefilledRef.current) {
      return;
    }
    if (!initialValues.introduction) {
      return;
    }
    hasPrefilledRef.current = true;
    formMethods.reset(initialValues);
  }, [initialValues, formMethods]);

  const { formState } = formMethods;

  const onboardingStepPresentation: WizardStep = {
    summary: {
      title: 'Présentation',
      duration: '~1 minute',
    },
    hideGenericStepHeader: undefined,
    title: 'Présentez-vous en quelques lignes',
    smallTitle: 'Présentation',
    description:
      'Ce texte apparaîtra en tête de votre profil auprès des personnes qui le consulteront.',
    content: (
      <StyledOnboardingStepContainer>
        <FormProvider {...formMethods}>
          <StepPresentationContent />
        </FormProvider>
      </StyledOnboardingStepContainer>
    ),
    sidePanelContent: () => <ProfileLivePreviewPanel />,
    mobileBottomSheet: false,
    isNextEnabled: formState.isValid,
    isStepCompleted: async () => {
      return !!profileComplete?.introduction?.trim();
    },
    onSubmit: async () => {
      if (!user) {
        return false;
      }

      return new Promise<boolean>((resolve) => {
        formMethods.handleSubmit(
          (values) => {
            dispatch(currentUserActions.updateProfileReset());
            pendingResolveRef.current = resolve;
            updateUserProfile({ introduction: values.introduction });
          },
          () => resolve(false)
        )();
      });
    },
    section: 'profil',
  };

  return { onboardingStepPresentation };
};
