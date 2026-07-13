import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  Experience,
  Formation,
  User,
  UserProfileLanguage,
} from '@/src/api/types';
import { Text, Alert, LucidIcon } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { ReduxRequestEvents } from '@/src/constants';
import { COLORS } from '@/src/constants/styles';
import { FilterConstant } from '@/src/constants/utils';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
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
import { StepCvRecapContent } from './StepCvRecapContent';

const NULL_USER = { id: '' } as unknown as User;

interface CvRecapFormValues {
  description: string;
  experiences: Experience[];
  formations: Formation[];
  skills: FilterConstant<string>[];
  languages: FilterConstant<string>[];
  interests: FilterConstant<string>[];
}

interface UseStepCvRecapProps {
  user: User | null;
}

export const useStepCvRecap = ({ user }: UseStepCvRecapProps) => {
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

  const initialValues = useMemo<CvRecapFormValues>(
    () => ({
      description: profileComplete?.description ?? '',
      experiences: (profileComplete?.experiences as Experience[]) ?? [],
      formations: (profileComplete?.formations as Formation[]) ?? [],
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
      profileComplete?.description,
      profileComplete?.experiences,
      profileComplete?.formations,
      profileComplete?.skills,
      profileComplete?.userProfileLanguages,
      profileComplete?.interests,
    ]
  );

  const formMethods = useForm<CvRecapFormValues>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const hasPrefilledRef = useRef(false);
  useEffect(() => {
    if (hasPrefilledRef.current) {
      return;
    }
    const hasData =
      !!initialValues.description ||
      initialValues.experiences.length > 0 ||
      initialValues.skills.length > 0 ||
      initialValues.languages.length > 0;
    if (!hasData) {
      return;
    }
    hasPrefilledRef.current = true;
    formMethods.reset(initialValues);
  }, [initialValues, formMethods]);

  const { watch, setValue, formState } = formMethods;
  const experiences = watch('experiences') ?? [];
  const formations = watch('formations') ?? [];

  useEffect(() => {
    const subscription = formMethods.watch((formValues, { name }) => {
      if (name === 'description') {
        dispatch(
          currentUserActions.profileCompleteDraftUpdated({
            description: formValues.description,
          })
        );
      } else if (name === 'skills') {
        dispatch(
          currentUserActions.profileCompleteDraftUpdated({
            skills: (formValues.skills ?? [])
              .filter((s): s is FilterConstant<string> => !!s)
              .map((s) => ({ name: s.value })),
          })
        );
      } else if (name === 'languages') {
        dispatch(
          currentUserActions.profileCompleteDraftUpdated({
            userProfileLanguages: (formValues.languages ?? [])
              .filter((l): l is FilterConstant<string> => !!l)
              .map((l) => ({
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
              .filter((int): int is FilterConstant<string> => !!int)
              .map((int, order) => ({ name: int.value, order })),
          })
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [dispatch, formMethods]);

  const handleExperiencesChange = useCallback(
    (next: Experience[]) => {
      setValue('experiences', next, { shouldDirty: true });
      dispatch(
        currentUserActions.profileCompleteDraftUpdated({ experiences: next })
      );
    },
    [dispatch, setValue]
  );
  const handleFormationsChange = useCallback(
    (next: Formation[]) => {
      setValue('formations', next, { shouldDirty: true });
      dispatch(
        currentUserActions.profileCompleteDraftUpdated({ formations: next })
      );
    },
    [dispatch, setValue]
  );

  const onboardingStepCvRecap: WizardStep = {
    id: 'cv-recap',
    summary: {
      title: 'Récapitulatif du profil',
      duration: '~3 minutes',
    },
    hideGenericStepHeader: undefined,
    title: 'Vérifiez et complétez votre profil',
    smallTitle: 'Récap',
    description: null,
    content: (
      <StyledOnboardingStepContainer>
        <Alert
          variant="outlined"
          type={AlertType.Info}
          icon={<LucidIcon name="Sparkles" color={COLORS.primaryBlue} />}
        >
          <Text color="darkBlue" size="small">
            Pré-rempli depuis votre CV. Vérifiez et corrigez si besoin : tout
            est modifiable, éditez, supprimez ou ajoutez.
          </Text>
        </Alert>
        <FormProvider {...formMethods}>
          <StepCvRecapContent
            experiences={experiences}
            formations={formations}
            onExperiencesChange={handleExperiencesChange}
            onFormationsChange={handleFormationsChange}
          />
        </FormProvider>
      </StyledOnboardingStepContainer>
    ),
    sidePanelContent: () => <ProfileLivePreviewPanel />,
    mobileBottomSheet: false,
    isNextEnabled: formState.isValid,
    isStepCompleted: async () => {
      return (
        !!profileComplete?.hasExternalCv &&
        !!profileComplete?.description?.trim()
      );
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

            updateUserProfile({
              description: values.description,
              experiences: values.experiences,
              formations: values.formations,
              skills: values.skills.map((s) => ({ name: s.value })),
              userProfileLanguages: values.languages.map((l) => ({
                languageId: l.value,
              })) as UserProfileLanguage[],
              interests: values.interests.map((int, order) => ({
                name: int.value,
                order,
              })),
            });
          },
          () => resolve(false)
        )();
      });
    },
    section: 'profil',
  };

  return { onboardingStepCvRecap };
};
