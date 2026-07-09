import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, UserProfileLanguage } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { FilterConstant } from '@/src/constants/utils';
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
import { sortByOrder } from '@/src/utils';
import { StyledOnboardingStepContainer } from '../../../onboarding.styles';
import { ProfileLivePreviewPanel } from '../ProfileLivePreview/ProfileLivePreviewPanel';
import {
  profileCompletionCvFields,
  PROFILE_COMPLETION_FORM_ID,
} from '../profileCompletionFormSchema';

const NULL_USER = { id: '' } as unknown as User;

interface SkillsFormValues {
  skills: FilterConstant<string>[];
  languages: FilterConstant<string>[];
  interests: FilterConstant<string>[];
}

// skills = index 1, languages = index 2, interests = index 3
const [, skillsField, languagesField, interestsField] =
  profileCompletionCvFields;

const skillsFormSchema = {
  id: PROFILE_COMPLETION_FORM_ID,
  fields: [skillsField, languagesField, interestsField],
};

interface UseStepSkillsProps {
  user: User | null;
}

export const useStepSkills = ({ user }: UseStepSkillsProps) => {
  const dispatch = useDispatch();
  const profileComplete = useCurrentUserProfileComplete();
  const { updateUserProfile } = useUpdateProfile(user ?? NULL_USER);
  const formRef = useRef<FormWithValidationRef>(null);

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

  const initialValues = useMemo<SkillsFormValues>(
    () => ({
      skills:
        profileComplete?.skills?.map((s) => ({
          value: s.name,
          label: s.name,
        })) ?? [],
      languages:
        profileComplete?.userProfileLanguages
          ?.map((ul) => {
            const id = ul.language?.id;
            const name = ul.language?.name;
            if (!id || !name) {
              return null;
            }
            return { value: id, label: name } as FilterConstant<string>;
          })
          .filter((v): v is FilterConstant<string> => v !== null) ?? [],
      interests:
        profileComplete?.interests && profileComplete.interests.length > 0
          ? sortByOrder(profileComplete.interests).map((i) => ({
              value: i.name,
              label: i.name,
            }))
          : [],
    }),
    [
      profileComplete?.skills,
      profileComplete?.userProfileLanguages,
      profileComplete?.interests,
    ]
  );

  // Pousse chaque changement vers le draft pour alimenter l'aperçu de profil en direct.
  const handleWatch = useCallback(
    (formValues: SkillsFormValues, { name }: { name?: string }) => {
      if (name === 'skills') {
        dispatch(
          currentUserActions.profileCompleteDraftUpdated({
            skills: (formValues.skills ?? [])
              .filter(
                (
                  s: FilterConstant<string> | undefined
                ): s is FilterConstant<string> => !!s
              )
              .map((s: FilterConstant<string>) => ({ name: s.value })),
          })
        );
      } else if (name === 'languages') {
        dispatch(
          currentUserActions.profileCompleteDraftUpdated({
            userProfileLanguages: (formValues.languages ?? [])
              .filter(
                (
                  l: FilterConstant<string> | undefined
                ): l is FilterConstant<string> => !!l
              )
              .map((l: FilterConstant<string>) => ({
                languageId: l.value,
                language: {
                  id: l.value,
                  name: String(l.label),
                  value: l.value,
                },
              })),
          })
        );
      } else if (name === 'interests') {
        dispatch(
          currentUserActions.profileCompleteDraftUpdated({
            interests: (formValues.interests ?? [])
              .filter(
                (
                  int: FilterConstant<string> | undefined
                ): int is FilterConstant<string> => !!int
              )
              .map((int: FilterConstant<string>, order: number) => ({
                name: int.value,
                order,
              })),
          })
        );
      }
    },
    [dispatch]
  );

  const handleFormWithValidationSubmit = useCallback(
    (values: SkillsFormValues) =>
      new Promise<void>((resolve) => {
        dispatch(currentUserActions.updateProfileReset());
        pendingResolveRef.current = resolve;

        updateUserProfile({
          skills: values.skills.map((s) => ({ name: s.value })),
          userProfileLanguages: values.languages.map((l) => ({
            languageId: l.value,
          })) as UserProfileLanguage[],
          interests: values.interests.map((int, order) => ({
            name: int.value,
            order,
          })),
        });
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

  const onboardingStepSkills: WizardStep = {
    id: 'skills',
    summary: {
      title: 'Compétences et intérêts',
      duration: '~2 minutes',
    },
    hideGenericStepHeader: undefined,
    title: "Vos compétences et centres d'intérêt",
    smallTitle: 'Compétences',
    description:
      "Partagez vos compétences, langues parlées et centres d'intérêt.",
    content: (
      <StyledOnboardingStepContainer>
        <FormWithValidationSync
          key={profileComplete ? 'loaded' : 'pending'}
          formSchema={skillsFormSchema}
          defaultValues={initialValues}
          onSubmit={handleFormWithValidationSubmit}
          onWatch={handleWatch}
          formRef={formRef}
        />
      </StyledOnboardingStepContainer>
    ),
    sidePanelContent: () => <ProfileLivePreviewPanel />,
    mobileBottomSheet: false,
    buttonLabel: 'Terminer mon profil',
    isNextEnabled: true,
    isStepCompleted: async () => true,
    onSubmit,
    section: 'profil',
  };

  return { onboardingStepSkills };
};
