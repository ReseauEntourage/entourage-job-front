import { useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import {
  currentUserActions,
  updateProfileSelectors,
} from '@/src/use-cases/current-user';
import { onboardingActions } from '@/src/use-cases/onboarding';
import { StyledOnboardingStepContainer } from '../../onboarding.styles';
import { OnboardingStep } from '../../onboarding.types';
import { Content } from './Content';
import { ProfileCompletionFormValues } from './types';

export const useOnboardingStepProfileCompletion = () => {
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);

  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectUpdateProfileStatus
  );

  const pendingResolveRef = useRef<((value: boolean) => void) | null>(null);

  const initialFormValues = useMemo<ProfileCompletionFormValues>(() => {
    return {
      profileImage: null,
      profileImageObjectUrl: null,
      introduction: user.userProfile?.introduction ?? '',
      currentJob: user.userProfile?.currentJob ?? '',
    };
  }, [user.userProfile?.currentJob, user.userProfile?.introduction]);

  useEffect(() => {
    if (!pendingResolveRef.current) {
      return;
    }

    if (updateProfileStatus === ReduxRequestEvents.SUCCEEDED) {
      pendingResolveRef.current(true);
      pendingResolveRef.current = null;
      return;
    }

    if (updateProfileStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        onboardingActions.setFormErrorMessage(
          'Une erreur est survenue lors de la sauvegarde de votre profil. Veuillez réessayer.'
        )
      );
      pendingResolveRef.current(false);
      pendingResolveRef.current = null;
    }
  }, [dispatch, updateProfileStatus]);

  const formMethods = useForm<ProfileCompletionFormValues>({
    defaultValues: initialFormValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: false, // Keep values when inputs are unmounted
  });

  // If user data arrives/updates after the form is created (async fetch),
  // prefill the form without overriding user edits.
  useEffect(() => {
    formMethods.reset(initialFormValues, { keepDirtyValues: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFormValues]);

  const onboardingStepProfileCompletion = {
    summary: {
      title: 'Compléter le profil',
      description:
        'Permettez au reste de la communauté de vous découvrir et recevez des mises en relation personnalisées',
      duration: '~4-5 minutes',
    },
    title: 'Complétez votre profil',
    smallTitle: 'Compléter le profil',
    description:
      'Permettez au reste de la communauté de vous découvrir et recevez des mises en relation personnalisées',
    content: (
      <StyledOnboardingStepContainer>
        <FormProvider {...formMethods}>
          <Content />
        </FormProvider>
      </StyledOnboardingStepContainer>
    ),
    onSubmit: async () => {
      dispatch(onboardingActions.setFormErrorMessage(null));

      return await new Promise<boolean>((resolve) => {
        formMethods.handleSubmit(
          async (values) => {
            dispatch(currentUserActions.updateProfileReset());
            pendingResolveRef.current = resolve;
            updateUserProfile({
              introduction: values.introduction,
              currentJob: values.currentJob,
            });
          },
          () => {
            dispatch(
              onboardingActions.setFormErrorMessage(
                'Veuillez compléter les champs obligatoires avant de passer à l’étape suivante.'
              )
            );
            resolve(false);
          }
        )();
      });
    },
    confirmationStep: {
      title: 'Félicitations ! Vous avez complété votre profil',
      subtitle: 'Vous êtes maintenant prêt à utiliser Entourage Pro',
      submitBtnTxt: 'Démarrer l’aventure Entourage Pro',
    },
  } as OnboardingStep;

  return { onboardingStepProfileCompletion };
};
