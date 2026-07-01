import React, { useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { User, UserProfileLanguage } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
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
import { StepSkillsContent } from './StepSkillsContent';

const NULL_USER = { id: '' } as unknown as User;

interface SkillsFormValues {
  skills: FilterConstant<string>[];
  languages: FilterConstant<string>[];
  interests: FilterConstant<string>[];
}

interface UseStepSkillsProps {
  user: User | null;
}

export const useStepSkills = ({ user }: UseStepSkillsProps) => {
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

  const formMethods = useForm<SkillsFormValues>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const hasPrefilledRef = useRef(false);
  useEffect(() => {
    if (!hasPrefilledRef.current) {
      hasPrefilledRef.current = true;
      formMethods.reset(initialValues);
    }
  }, [initialValues, formMethods]);

  const { watch } = formMethods;
  const skills = watch('skills') ?? [];
  const languages = watch('languages') ?? [];

  const onboardingStepSkills: WizardStep = {
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
        <FormProvider {...formMethods}>
          <StepSkillsContent />
        </FormProvider>
      </StyledOnboardingStepContainer>
    ),
    sidePanelContent: () => <ProfileLivePreviewPanel />,
    mobileBottomSheet: true,
    buttonLabel: 'Terminer mon profil',
    isNextEnabled: skills.length > 0 || languages.length > 0,
    isStepCompleted: async () => {
      return (
        (profileComplete?.skills?.length ?? 0) > 0 ||
        (profileComplete?.userProfileLanguages?.length ?? 0) > 0
      );
    },
    onSubmit: async () => {
      if (!user) {
        return false;
      }

      return new Promise<boolean>((resolve) => {
        formMethods.handleSubmit((values) => {
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
        })();
      });
    },
    section: 'profil',
  };

  return { onboardingStepSkills };
};
