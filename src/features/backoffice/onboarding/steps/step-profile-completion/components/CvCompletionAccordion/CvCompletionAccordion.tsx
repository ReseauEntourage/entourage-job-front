import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { H4, H5 } from '@/src/components/ui/Headings';
import { COLORS } from '@/src/constants/styles';
import { CVExperienceOrFormation } from '@/src/features/profile/CVExperienceOrFormation/CVExperienceOrFormation';
import { OpenAILegalMention } from '@/src/features/profile/ai/OpenAILegalMention';
import { ProfileGenerationLoadingIndicator } from '@/src/features/profile/ai/ProfileGenerationLoadingIndicator';
import { useEditableExperiencesByIndex } from '@/src/features/profile/hooks/useEditableExperiences';
import { useEditableFormationsByIndex } from '@/src/features/profile/hooks/useEditableFormations';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useProfileGeneration } from '@/src/hooks/useProfileGeneration';
import {
  currentUserActions,
  selectIsComplete,
  uploadExternalCvSelectors,
} from '@/src/use-cases/current-user';
import { sortByOrder } from '@/src/utils';
import {
  StyledAccordionHeader,
  StyledAccordionHeaderIcon,
  StyledAccordionHeaderTitleContainer,
} from '../../Content.styles';
import {
  profileCompletionCvFields,
  profileCompletionFormSchema,
} from '../../profileCompletionFormSchema';
import type { ProfileCompletionFormValues } from '../../types';
import { ProfileCompletionSchemaField } from '../ProfileCompletionSchemaField';
import {
  StyledAlertImportCVContainer,
  StyledCvContentFormContainer,
  StyledExperienceOrFormationFormFieldContainer,
  StyledExperienceOrFormationFormFieldLabelContainer,
  StyledExperienceOrFormationList,
} from './CvCompletionAccordion.styles';

export const CvCompletionAccordion = () => {
  const dispatch = useDispatch();
  const currentUser = useAuthenticatedUser();
  const userIsComplete = useSelector(selectIsComplete);
  const [isOpen, setIsOpen] = useState(false);

  const isUploadExternalCvRequested = useSelector(
    uploadExternalCvSelectors.selectIsUploadExternalCvRequested
  );
  const isUploadExternalCvSucceeded = useSelector(
    uploadExternalCvSelectors.selectIsUploadExternalCvSucceeded
  );
  const isUploadExternalCvFailed = useSelector(
    uploadExternalCvSelectors.selectIsUploadExternalCvFailed
  );

  const [
    shouldGenerateProfileAfterUpload,
    setShouldGenerateProfileAfterUpload,
  ] = useState(false);

  const [hasJustGeneratedProfile, setHasJustGeneratedProfile] = useState(false);

  const { generateProfileFromCV, isLoading: isProfileGenerationLoading } =
    useProfileGeneration({
      onProfileGenerated: () => {
        setHasJustGeneratedProfile(true);
      },
    });

  useEffect(() => {
    if (isProfileGenerationLoading) {
      setHasJustGeneratedProfile(false);
    }
  }, [isProfileGenerationLoading]);

  const isGenerated = hasJustGeneratedProfile || currentUser.hasExtractedCvData;
  const shouldShowUploadButton =
    !currentUser.userProfile.hasExternalCv &&
    !isProfileGenerationLoading &&
    !isGenerated;

  const {
    setValue,
    watch,
    formState: { errors, submitCount },
  } = useFormContext<ProfileCompletionFormValues>();

  const [profileDescriptionField, ...cvSecondaryFields] =
    profileCompletionCvFields;

  const hasAppliedGeneratedCvValuesRef = useRef(false);

  useEffect(() => {
    // Synchronize from the server only when a generation has just been triggered from this component.
    if (!hasJustGeneratedProfile) {
      hasAppliedGeneratedCvValuesRef.current = false;
      return;
    }

    if (hasAppliedGeneratedCvValuesRef.current) {
      return;
    }

    // Wait for the user refetch (triggered after the pusher event) to get the generated data in currentUser.
    if (!currentUser.hasExtractedCvData) {
      return;
    }

    const nextDescription = currentUser.userProfile?.description ?? '';

    const nextSkills =
      currentUser.userProfile?.skills?.map((skill) => ({
        value: skill.name,
        label: skill.name,
      })) ?? [];

    const nextInterests =
      currentUser.userProfile?.interests &&
      currentUser.userProfile.interests.length > 0
        ? sortByOrder(currentUser.userProfile.interests).map((interest) => ({
            value: interest.name,
            label: interest.name,
          }))
        : [];

    const nextLanguages =
      currentUser.userProfile?.userProfileLanguages
        ?.map((upLanguage) => {
          const languageId = upLanguage.language?.id;
          const languageName = upLanguage.language?.name;
          if (!languageId || !languageName) {
            return null;
          }
          return {
            value: languageId,
            label: languageName,
          };
        })
        .filter(
          (value): value is { value: string; label: string } => value !== null
        ) ?? [];

    const nextExperiences = currentUser.userProfile?.experiences ?? [];
    const nextFormations = currentUser.userProfile?.formations ?? [];

    // CV accordion fields: force sync from generated values.
    setValue('description', nextDescription, { shouldValidate: true });
    setValue('skills', nextSkills, { shouldValidate: true });
    setValue('interests', nextInterests, { shouldValidate: true });
    setValue('languages', nextLanguages, { shouldValidate: true });
    setValue('experiences', nextExperiences, { shouldValidate: true });
    setValue('formations', nextFormations, { shouldValidate: true });

    hasAppliedGeneratedCvValuesRef.current = true;
  }, [
    currentUser.hasExtractedCvData,
    currentUser.userProfile,
    hasJustGeneratedProfile,
    setValue,
  ]);

  useEffect(() => {
    if (
      submitCount > 0 &&
      (!!errors.skills || !!errors.languages || !!errors.interests)
    ) {
      setIsOpen(true);
    }
  }, [errors.interests, errors.languages, errors.skills, submitCount]);

  const watchedExperiences = watch('experiences');
  const watchedFormations = watch('formations');
  const experiences = useMemo(
    () => watchedExperiences ?? [],
    [watchedExperiences]
  );
  const formations = useMemo(
    () => watchedFormations ?? [],
    [watchedFormations]
  );

  const setExperiences = useCallback(
    (nextExperiences: typeof experiences) => {
      setValue('experiences', nextExperiences, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const setFormations = useCallback(
    (nextFormations: typeof formations) => {
      setValue('formations', nextFormations, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const { addExperience, editExperience, deleteExperience } =
    useEditableExperiencesByIndex({
      experiences,
      includeSkillId: true,
      onChange: setExperiences,
    });

  const { addFormation, editFormation, deleteFormation } =
    useEditableFormationsByIndex({
      formations,
      includeSkillId: true,
      onChange: setFormations,
    });

  const handleUploadCv = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.style.display = 'none';

    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        if (file.type !== 'application/pdf') {
          return;
        }
        const formData = new FormData();
        formData.append('file', file);

        setShouldGenerateProfileAfterUpload(true);
        dispatch(
          currentUserActions.uploadExternalCvRequested({
            formData,
          })
        );
      }
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  // Fetch the complete user if not already done
  useEffect(() => {
    if (!userIsComplete) {
      dispatch(currentUserActions.fetchCompleteUserRequested());
    }
  }, [userIsComplete, dispatch]);

  useEffect(() => {
    if (!shouldGenerateProfileAfterUpload) {
      return;
    }

    // Explicitly wait for the upload success before starting the generation.
    // The flag prevents triggering the generation if the upload comes from elsewhere.
    if (isUploadExternalCvSucceeded && currentUser.userProfile.hasExternalCv) {
      setShouldGenerateProfileAfterUpload(false);
      void generateProfileFromCV();
    }
  }, [
    shouldGenerateProfileAfterUpload,
    isUploadExternalCvSucceeded,
    currentUser.userProfile.hasExternalCv,
    generateProfileFromCV,
  ]);

  useEffect(() => {
    if (!shouldGenerateProfileAfterUpload) {
      return;
    }

    if (isUploadExternalCvFailed) {
      setShouldGenerateProfileAfterUpload(false);
    }
  }, [shouldGenerateProfileAfterUpload, isUploadExternalCvFailed]);

  return (
    <Accordion
      headerContent={
        <StyledAccordionHeader>
          <StyledAccordionHeaderIcon>
            <LucidIcon name="FileText" color={COLORS.white} size={24} />
          </StyledAccordionHeaderIcon>
          <StyledAccordionHeaderTitleContainer>
            <H4 title="CV et informations complémentaires" noMarginBottom />
            <Text>Votre CV et informations complémentaires</Text>
          </StyledAccordionHeaderTitleContainer>
        </StyledAccordionHeader>
      }
      keepContentMounted
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Alert
        variant={isGenerated ? AlertVariant.Success : AlertVariant.Info}
        icon={
          isGenerated ? (
            <LucidIcon name="Check" color={COLORS.black} size={25} />
          ) : (
            <LucidIcon name="Sparkles" color={COLORS.primaryBlue} size={25} />
          )
        }
      >
        <StyledAlertImportCVContainer>
          {isGenerated ? (
            <>
              <H5 title="Votre profil est à présent complet" noMarginBottom />
              <Text>
                Votre profil a été rempli automatiquement à partir de votre CV.
                <br />
                Vous pouvez ajuster les informations si besoin.
              </Text>
            </>
          ) : (
            <>
              <H5 title="Gagnez du temps avec l'IA" noMarginBottom />
              <Text>
                Importez votre CV et laissez notre IA remplir automatiquement
                vos expériences, formations, compétences, langues et centres
                d’intérêt. Vous pourrez ensuite modifier ces informations si
                besoin.
              </Text>
            </>
          )}

          {isProfileGenerationLoading && <ProfileGenerationLoadingIndicator />}

          {/* Button shown when CV has not been uploaded yet */}
          {shouldShowUploadButton && (
            <>
              <Button
                variant="secondary"
                onClick={handleUploadCv}
                disabled={isUploadExternalCvRequested}
              >
                Importer mon CV et remplir mon profil avec l'IA
              </Button>
              <OpenAILegalMention center={false} />
            </>
          )}
        </StyledAlertImportCVContainer>
      </Alert>

      <br />

      {/* Form should only be shown when user data is complete */}
      {userIsComplete && (
        <StyledCvContentFormContainer $disabled={isProfileGenerationLoading}>
          <ProfileCompletionSchemaField
            formSchema={profileCompletionFormSchema}
            field={profileDescriptionField}
            showError={submitCount > 0}
          />

          <StyledExperienceOrFormationFormFieldContainer>
            <StyledExperienceOrFormationFormFieldLabelContainer>
              <Text>Expériences professionnelles</Text>
              <Button
                variant="default"
                size="small"
                color="darkGray"
                onClick={addExperience}
              >
                Ajouter une expérience
              </Button>
            </StyledExperienceOrFormationFormFieldLabelContainer>
            <StyledExperienceOrFormationList>
              {experiences.map((experience, idx) => (
                <CVExperienceOrFormation
                  key={experience.id ?? `${experience.title}-${idx}`}
                  title={experience.title}
                  description={experience.description}
                  startDate={experience.startDate}
                  endDate={experience.endDate}
                  location={experience.location}
                  structure={experience.company}
                  skills={experience.skills || []}
                  isEditable
                  editItem={() => editExperience(idx)}
                  deleteItem={() => deleteExperience(idx)}
                />
              ))}
            </StyledExperienceOrFormationList>
          </StyledExperienceOrFormationFormFieldContainer>

          <StyledExperienceOrFormationFormFieldContainer>
            <StyledExperienceOrFormationFormFieldLabelContainer>
              <Text>Formations</Text>
              <Button
                variant="default"
                size="small"
                color="darkGray"
                onClick={addFormation}
              >
                Ajouter une formation
              </Button>
            </StyledExperienceOrFormationFormFieldLabelContainer>
            <StyledExperienceOrFormationList>
              {formations.map((formation, idx) => (
                <CVExperienceOrFormation
                  key={formation.id ?? `${formation.title}-${idx}`}
                  title={formation.title}
                  description={formation.description}
                  startDate={formation.startDate}
                  endDate={formation.endDate}
                  location={formation.location}
                  structure={formation.institution}
                  skills={formation.skills || []}
                  isEditable
                  editItem={() => editFormation(idx)}
                  deleteItem={() => deleteFormation(idx)}
                />
              ))}
            </StyledExperienceOrFormationList>
          </StyledExperienceOrFormationFormFieldContainer>

          {cvSecondaryFields.map((field) => (
            <ProfileCompletionSchemaField
              key={String(field.name)}
              formSchema={profileCompletionFormSchema}
              field={field}
              showError={submitCount > 0}
            />
          ))}
        </StyledCvContentFormContainer>
      )}
    </Accordion>
  );
};
