import { useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  Experience,
  Formation,
  UserProfileLanguage,
  UserProfileSectorOccupation,
} from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { UserRoles } from '@/src/constants/users';
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
import { formatCareerPathSentence } from '@/src/utils/Formatting';
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
    const sortedSectorOccupations =
      user.userProfile?.sectorOccupations
        ?.slice()
        .sort((a, b) => a.order - b.order) ?? [];

    const sectorOccupation0 = sortedSectorOccupations[0];
    const sectorOccupation1 = sortedSectorOccupations[1];

    const businessSector0Id =
      sectorOccupation0?.businessSectorId ??
      sectorOccupation0?.businessSector?.id;
    const businessSector1Id =
      sectorOccupation1?.businessSectorId ??
      sectorOccupation1?.businessSector?.id;

    return {
      profileImage: null,
      profileImageObjectUrl: null,
      introduction: user.userProfile?.introduction ?? '',
      description: user.userProfile?.description ?? '',

      businessSectorId0: businessSector0Id
        ? {
            value: businessSector0Id,
            label:
              sectorOccupation0?.businessSector?.name ??
              String(businessSector0Id),
          }
        : null,
      occupation0: sectorOccupation0?.occupation?.name ?? '',
      businessSectorId1: businessSector1Id
        ? {
            value: businessSector1Id,
            label:
              sectorOccupation1?.businessSector?.name ??
              String(businessSector1Id),
          }
        : null,
      occupation1: sectorOccupation1?.occupation?.name ?? '',

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
      experiences: (user.userProfile?.experiences as Experience[]) ?? [],
      formations: (user.userProfile?.formations as Formation[]) ?? [],
      languages:
        user.userProfile?.userProfileLanguages
          ?.map((upLanguage) => {
            const languageId = upLanguage.language?.id;
            const languageName = upLanguage.language?.name;
            if (!languageId || !languageName) {
              return null;
            }
            return {
              value: languageId,
              label: languageName,
            } as FilterConstant<string>;
          })
          .filter((value): value is FilterConstant<string> => value !== null) ??
        [],
      linkedinUrl: user.userProfile?.linkedinUrl ?? '',
    };
  }, [
    user.userProfile?.sectorOccupations,
    user.userProfile?.introduction,
    user.userProfile?.description,
    user.userProfile?.currentJob,
    user.userProfile?.skills,
    user.userProfile.interests,
    user.userProfile?.experiences,
    user.userProfile?.formations,
    user.userProfile?.userProfileLanguages,
    user.userProfile?.linkedinUrl,
    user.company?.name,
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
      title: 'Compléter votre profil',
      description:
        'Permettez au reste de la communauté de vous découvrir et recevez des mises en relation personnalisées',
      duration: '~5 minutes',
    },
    title: 'Complétez votre profil',
    smallTitle: 'Compléter votre profil',
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

            pendingResolveRef.current = resolve;

            if (user.role === UserRoles.CANDIDATE) {
              pendingCompanyUpdateRef.current = false;

              const candidateCareerPathValues = {
                businessSectorId0: values.businessSectorId0 ?? undefined,
                occupation0: values.occupation0,
                businessSectorId1: values.businessSectorId1 ?? undefined,
                occupation1: values.occupation1,
              };

              updateUserProfile({
                introduction: values.introduction,
                description: values.description?.trim()
                  ? values.description.trim()
                  : null,
                linkedinUrl: values.linkedinUrl?.trim()
                  ? values.linkedinUrl.trim()
                  : null,
                sectorOccupations: formatCareerPathSentence(
                  candidateCareerPathValues
                ),
                skills: values.skills.map((skill) => ({ name: skill.value })),
                userProfileLanguages: values.languages.map((language) => ({
                  languageId: language.value,
                })) as UserProfileLanguage[],
                interests: values.interests.map((interest, order) => ({
                  name: interest.value,
                  order,
                })),
                experiences: values.experiences,
                formations: values.formations,
              });
              return;
            }

            const submittedCompanyName = values.companyName?.value
              ? String(values.companyName.value).trim()
              : null;
            const existingCompanyName = user.company?.name
              ? String(user.company.name).trim()
              : null;
            const shouldUpdateCompany =
              submittedCompanyName !== existingCompanyName;

            pendingCompanyUpdateRef.current = shouldUpdateCompany;
            if (shouldUpdateCompany) {
              updateUserCompany(submittedCompanyName);
            }

            updateUserProfile({
              introduction: values.introduction,
              description: values.description?.trim()
                ? values.description.trim()
                : null,
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
              userProfileLanguages: values.languages.map((language) => ({
                languageId: language.value,
              })) as UserProfileLanguage[],
              interests: values.interests.map((interest, order) => ({
                name: interest.value,
                order,
              })),
              experiences: values.experiences,
              formations: values.formations,
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
      subtitle:
        user.role === UserRoles.CANDIDATE
          ? 'Vous êtes désormais prêt à contacter des coachs prêts à vous soutenir'
          : 'Vous êtes désormais prêt à soutenir des candidats',
      submitBtnTxt: 'Démarrer l’aventure Entourage Pro',
    },
  } as OnboardingStep;

  return { onboardingStepProfileCompletion };
};
