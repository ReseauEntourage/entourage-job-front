import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { FormWithValidationRef } from '@/src/features/forms/FormWithValidation';
import { FormWithValidationSync } from '@/src/features/wizard/FormWithValidationSync';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { useStepFormSubmit } from '@/src/features/wizard/useStepFormSubmit';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import {
  currentUserActions,
  updateProfileSelectors,
} from '@/src/use-cases/current-user';
import { onboardingActions } from '@/src/use-cases/onboarding';
import { StyledOnboardingStepContainer } from '../../../onboarding.styles';
import { ProfileLivePreviewPanel } from '../ProfileLivePreview/ProfileLivePreviewPanel';
import {
  buildIntroductionField,
  PROFILE_COMPLETION_FORM_ID,
} from '../profileCompletionFormSchema';

const NULL_USER = { id: '' } as unknown as User;

interface PresentationFormValues {
  description: string;
}

const introductionField = buildIntroductionField(
  'Ce texte apparaîtra en tête de votre profil auprès des personnes qui le consulteront.'
);

const presentationFormSchema = {
  id: PROFILE_COMPLETION_FORM_ID,
  fields: [introductionField],
};

// Reflète les contraintes du champ description (isRequired, minLength: 50,
// maxLength: 500) pour piloter isNextEnabled sans attendre une soumission.
const isIntroductionValid = (description: string | null | undefined) => {
  const length = description?.trim().length ?? 0;
  return length >= 50 && length <= 500;
};

interface UseStepPresentationProps {
  user: User | null;
}

export const useStepPresentation = ({ user }: UseStepPresentationProps) => {
  const dispatch = useDispatch();
  const profileComplete = useCurrentUserProfileComplete();
  const { updateUserProfile } = useUpdateProfile(user ?? NULL_USER);
  const formRef = useRef<FormWithValidationRef>(null);
  const [isNextEnabled, setIsNextEnabled] = useState(() =>
    isIntroductionValid(profileComplete?.description)
  );

  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectUpdateProfileStatus
  );

  const pendingResolveRef = useRef<(() => void) | null>(null);
  const lastSubmitFailedRef = useRef(false);

  useEffect(() => {
    if (!pendingResolveRef.current) {
      return;
    }
    if (updateProfileStatus === ReduxRequestEvents.SUCCEEDED) {
      lastSubmitFailedRef.current = false;
      const resolve = pendingResolveRef.current;
      pendingResolveRef.current = null;
      resolve();
    } else if (updateProfileStatus === ReduxRequestEvents.FAILED) {
      lastSubmitFailedRef.current = true;
      dispatch(
        onboardingActions.setFormErrorMessage(
          'Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.'
        )
      );
      const resolve = pendingResolveRef.current;
      pendingResolveRef.current = null;
      resolve();
    }
  }, [dispatch, updateProfileStatus]);

  // Pousse chaque frappe vers le draft pour alimenter l'aperçu de profil en direct,
  // et recalcule isNextEnabled (le champ est requis, 50 à 500 caractères).
  const handleWatch = useCallback(
    (formValues: PresentationFormValues) => {
      dispatch(
        currentUserActions.profileCompleteDraftUpdated({
          description: formValues.description,
        })
      );
      setIsNextEnabled(isIntroductionValid(formValues.description));
    },
    [dispatch]
  );

  const handleFormWithValidationSubmit = useCallback(
    (values: PresentationFormValues) =>
      new Promise<void>((resolve) => {
        dispatch(currentUserActions.updateProfileReset());
        pendingResolveRef.current = resolve;
        updateUserProfile({ description: values.description });
      }),
    [dispatch, updateUserProfile]
  );

  const submitViaForm = useStepFormSubmit(formRef);
  const onSubmit = useCallback(async () => {
    if (!user) {
      return false;
    }
    const validated = await submitViaForm();
    if (validated === false) {
      return false;
    }
    return lastSubmitFailedRef.current ? false : undefined;
  }, [user, submitViaForm]);

  const onboardingStepPresentation: WizardStep = {
    id: 'presentation',
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
        <FormWithValidationSync
          // FormWithValidation ne relit ses defaultValues qu'au montage : la key force
          // un remontage quand profileComplete arrive (fetch async), pour préremplir le
          // texte existant au lieu de le laisser vide.
          key={profileComplete ? 'loaded' : 'pending'}
          formSchema={presentationFormSchema}
          defaultValues={{ description: profileComplete?.description ?? '' }}
          onSubmit={handleFormWithValidationSubmit}
          onWatch={handleWatch}
          formRef={formRef}
        />
      </StyledOnboardingStepContainer>
    ),
    sidePanelContent: () => <ProfileLivePreviewPanel />,
    mobileBottomSheet: false,
    isNextEnabled,
    isStepCompleted: async () => {
      return !!profileComplete?.description?.trim();
    },
    onSubmit,
    section: 'profil',
  };

  return { onboardingStepPresentation };
};
