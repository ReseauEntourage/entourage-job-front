import { useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileSectorOccupation } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { FilterConstant } from '@/src/constants/utils';
import { useUpdateUser } from '@/src/hooks';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import {
  currentUserActions,
  updateProfileSelectors,
  updateUserCompanySelectors,
} from '@/src/use-cases/current-user';
import { onboardingActions } from '@/src/use-cases/onboarding';
import { sortByOrder } from '@/src/utils';
import { StyledOnboardingStepContainer } from '../../onboarding.styles';
import { OnboardingStep } from '../../onboarding.types';
import { Content } from './Content';
import { ProfileCompletionFormValues } from './types';

export const useOnboardingStepProfileCompletion = () => {
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);
  const { updateUserCompany } = useUpdateUser(user);

  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectUpdateProfileStatus
  );

  const updateUserCompanyStatus = useSelector(
    updateUserCompanySelectors.selectUpdateUserCompanyStatus
  );

  const pendingResolveRef = useRef<((value: boolean) => void) | null>(null);
  const pendingCompanyUpdateRef = useRef<boolean>(false);

  const initialFormValues = useMemo<ProfileCompletionFormValues>(() => {
    return {
      profileImage: null,
      profileImageObjectUrl: null,
      introduction: user.userProfile?.introduction ?? '',
      currentJob: user.userProfile?.currentJob ?? '',
      companyName: user.company?.name
        ? { value: user.company.name, label: user.company.name }
        : null,
      businessSectorIds:
        user.userProfile?.sectorOccupations
          ?.slice()
          .sort((a, b) => a.order - b.order)
          ?.map((so) => {
            const businessSectorId =
              so.businessSectorId ?? so.businessSector?.id;
            if (!businessSectorId) {
              return null;
            }

            return {
              value: businessSectorId,
              label: so.businessSector?.name ?? businessSectorId,
            } as FilterConstant<string>;
          })
          .filter((value): value is FilterConstant<string> => value !== null) ??
        [],
      skills:
        user.userProfile?.skills?.map((skill) => ({
          value: skill.name,
          label: skill.name,
        })) ?? [],
      interests:
        user.userProfile?.interests && user.userProfile.interests.length > 0
          ? sortByOrder(user.userProfile.interests).map((interest) => ({
              value: interest.name,
              label: interest.name,
            }))
          : [],
      linkedinUrl: user.userProfile?.linkedinUrl ?? '',
    };
  }, [
    user.company?.name,
    user.userProfile?.currentJob,
    user.userProfile?.introduction,
    user.userProfile?.interests,
    user.userProfile?.linkedinUrl,
    user.userProfile?.sectorOccupations,
    user.userProfile?.skills,
  ]);

  useEffect(() => {
    if (!pendingResolveRef.current) {
      return;
    }

    if (
      updateProfileStatus === ReduxRequestEvents.FAILED ||
      (pendingCompanyUpdateRef.current &&
        updateUserCompanyStatus === ReduxRequestEvents.FAILED)
    ) {
      dispatch(
        onboardingActions.setFormErrorMessage(
          updateUserCompanyStatus === ReduxRequestEvents.FAILED
            ? 'Une erreur est survenue lors de la mise à jour de votre entreprise. Veuillez réessayer.'
            : 'Une erreur est survenue lors de la sauvegarde de votre profil. Veuillez réessayer.'
        )
      );
      pendingResolveRef.current(false);
      pendingResolveRef.current = null;
      pendingCompanyUpdateRef.current = false;
      return;
    }

    if (updateProfileStatus === ReduxRequestEvents.SUCCEEDED) {
      if (
        !pendingCompanyUpdateRef.current ||
        updateUserCompanyStatus === ReduxRequestEvents.SUCCEEDED
      ) {
        pendingResolveRef.current(true);
        pendingResolveRef.current = null;
        pendingCompanyUpdateRef.current = false;
        return;
      }
    }
  }, [dispatch, updateProfileStatus, updateUserCompanyStatus]);

  const formMethods = useForm<ProfileCompletionFormValues>({
    defaultValues: initialFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
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
            dispatch(currentUserActions.updateUserCompanyReset());

            const submittedCompanyName = values.companyName?.value
              ? String(values.companyName.value).trim()
              : null;
            const existingCompanyName = user.company?.name
              ? String(user.company.name).trim()
              : null;
            const shouldUpdateCompany =
              submittedCompanyName !== existingCompanyName;

            pendingResolveRef.current = resolve;

            pendingCompanyUpdateRef.current = shouldUpdateCompany;
            if (shouldUpdateCompany) {
              updateUserCompany(submittedCompanyName);
            }

            updateUserProfile({
              introduction: values.introduction,
              currentJob: values.currentJob,
              linkedinUrl: values.linkedinUrl?.trim()
                ? values.linkedinUrl.trim()
                : null,
              sectorOccupations: values.businessSectorIds.map(
                (businessSector, idx) =>
                  ({
                    businessSectorId: businessSector.value,
                    order: idx,
                  } as UserProfileSectorOccupation)
              ),
              skills: values.skills.map((skill) => ({ name: skill.value })),
              interests: values.interests.map((interest, order) => ({
                name: interest.value,
                order,
              })),
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
