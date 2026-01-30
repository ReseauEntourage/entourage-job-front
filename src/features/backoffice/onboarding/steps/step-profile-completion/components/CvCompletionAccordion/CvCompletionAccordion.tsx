import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Experience, Formation } from '@/src/api/types';
import { Alert, Button, LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { H4, H5 } from '@/src/components/ui/Headings';
import { SelectAsync, SelectCreatable } from '@/src/components/ui/Inputs';
import { TextArea } from '@/src/components/ui/Inputs/TextArea/TextArea';
import { COLORS } from '@/src/constants/styles';
import { FilterConstant } from '@/src/constants/utils';
import {
  loadLanguagesOptions,
  loadSkillsOptions,
} from '@/src/features/forms/utils/loadOptions.utils';
import { openModal } from '@/src/features/modals/Modal';
import { CVExperienceOrFormation } from '@/src/features/profile/CVExperienceOrFormation/CVExperienceOrFormation';
import { ProfileExperiencesModalEdit } from '@/src/features/profile/ProfilePartCards/ProfileExperiences/ProfileExperiencesModalEdit/ProfileExperiencesModalEdit';
import { ProfileFormationsModalEdit } from '@/src/features/profile/ProfilePartCards/ProfileFormations/ProfileFormationsModalEdit/ProfileFormationsModalEdit';
import { OpenAILegalMention } from '@/src/features/profile/ai/OpenAILegalMention';
import { ProfileGenerationLoadingIndicator } from '@/src/features/profile/ai/ProfileGenerationLoadingIndicator';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useProfileGeneration } from '@/src/hooks/useProfileGeneration';
import {
  currentUserActions,
  selectIsComplete,
  uploadExternalCvSelectors,
} from '@/src/use-cases/current-user';
import {
  StyledAccordionHeader,
  StyledAccordionHeaderIcon,
  StyledAccordionHeaderTitleContainer,
} from '../../Content.styles';
import { ProfileCompletionFormValues } from '../../types';
import {
  StyledAlertImportCVContainer,
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
    control,
    setValue,
    watch,
    formState: { errors, submitCount },
  } = useFormContext<ProfileCompletionFormValues>();

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

  const addExperience = useCallback(() => {
    openModal(
      <ProfileExperiencesModalEdit
        dispatchOnSubmit={(values) => {
          const nextExperience: Experience = {
            title: values.title || '',
            location: values.location || undefined,
            company: values.company || undefined,
            startDate: values.startDate || undefined,
            endDate: values.endDate || undefined,
            description: values.description || undefined,
            skills:
              values.skills?.map((skill: FilterConstant<string>) => ({
                id: String(skill.value ?? skill.label ?? ''),
                name: String(skill.value ?? skill.label ?? ''),
              })) || [],
          };

          setValue('experiences', [...experiences, nextExperience], {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    );
  }, [experiences, setValue]);

  const editExperience = useCallback(
    (index: number) => {
      const experience = experiences[index];
      openModal(
        <ProfileExperiencesModalEdit
          experience={experience}
          dispatchOnSubmit={(values) => {
            const nextExperience: Experience = {
              ...experience,
              title: values.title || '',
              location: values.location || undefined,
              company: values.company || undefined,
              startDate: values.startDate || undefined,
              endDate: values.endDate || undefined,
              description: values.description || undefined,
              skills:
                values.skills?.map((skill: FilterConstant<string>) => ({
                  id: String(skill.value ?? skill.label ?? ''),
                  name: String(skill.value ?? skill.label ?? ''),
                })) || [],
            };

            const nextExperiences = experiences.slice();
            nextExperiences[index] = nextExperience;
            setValue('experiences', nextExperiences, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />
      );
    },
    [experiences, setValue]
  );

  const deleteExperience = useCallback(
    (index: number) => {
      setValue(
        'experiences',
        experiences.filter((_, i) => i !== index),
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      );
    },
    [experiences, setValue]
  );

  const addFormation = useCallback(() => {
    openModal(
      <ProfileFormationsModalEdit
        dispatchOnSubmit={(values) => {
          const nextFormation: Formation = {
            title: values.title || '',
            location: values.location || undefined,
            institution: values.institution || undefined,
            startDate: values.startDate || undefined,
            endDate: values.endDate || undefined,
            description: values.description || undefined,
            skills:
              values.skills?.map((skill: FilterConstant<string>) => ({
                id: String(skill.value ?? skill.label ?? ''),
                name: String(skill.value ?? skill.label ?? ''),
              })) || [],
          };

          setValue('formations', [...formations, nextFormation], {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    );
  }, [formations, setValue]);

  const editFormation = useCallback(
    (index: number) => {
      const formation = formations[index];
      openModal(
        <ProfileFormationsModalEdit
          formation={formation}
          dispatchOnSubmit={(values) => {
            const nextFormation: Formation = {
              ...formation,
              title: values.title || '',
              location: values.location || undefined,
              institution: values.institution || undefined,
              startDate: values.startDate || undefined,
              endDate: values.endDate || undefined,
              description: values.description || undefined,
              skills:
                values.skills?.map((skill: FilterConstant<string>) => ({
                  id: String(skill.value ?? skill.label ?? ''),
                  name: String(skill.value ?? skill.label ?? ''),
                })) || [],
            };

            const nextFormations = formations.slice();
            nextFormations[index] = nextFormation;
            setValue('formations', nextFormations, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />
      );
    },
    [formations, setValue]
  );

  const deleteFormation = useCallback(
    (index: number) => {
      setValue(
        'formations',
        formations.filter((_, i) => i !== index),
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      );
    },
    [formations, setValue]
  );

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

    // On attend explicitement le succès de l'upload avant de lancer la génération.
    // Le flag permet de ne pas déclencher la génération si l'upload vient d'ailleurs.
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
        <>
          <Controller
            control={control}
            name="description"
            rules={{
              maxLength: {
                value: 1000,
                message:
                  'Le résumé de votre profil ne peut pas dépasser 1000 caractères.',
              },
            }}
            render={({ field }) => (
              <TextArea
                id="onboarding-profile-description"
                name="onboarding-profile-description"
                title={<Text weight="semibold">Résumé de votre profil</Text>}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={
                  submitCount > 0
                    ? (errors.description as FieldError | undefined)
                    : undefined
                }
                showLabel
                placeholder="En quelques lignes, présentez votre profil, vos objectifs et ce que vous recherchez."
                maxLength={1000}
                rows={4}
              />
            )}
          />

          <StyledExperienceOrFormationFormFieldContainer>
            <StyledExperienceOrFormationFormFieldLabelContainer>
              <Text weight="semibold">Expériences professionnelles</Text>
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
              <Text weight="semibold">Formations</Text>
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

          <Controller
            control={control}
            name="skills"
            render={({ field }) => (
              <SelectCreatable
                id="onboarding-skills"
                name="onboarding-skills"
                title={<Text weight="semibold">Compétences</Text>}
                value={field.value || []}
                onChange={(value) => field.onChange(value || [])}
                onBlur={field.onBlur}
                error={
                  submitCount > 0
                    ? (errors.skills as unknown as FieldError | undefined)
                    : undefined
                }
                showLabel
                placeholder="Sélectionnez une ou plusieurs compétences dans la liste"
                isMulti
                openMenuOnClick
                loadOptions={(callback, inputValue) =>
                  loadSkillsOptions(callback, inputValue, true)
                }
                options={[]}
                maxItems={50}
              />
            )}
          />

          <Controller
            control={control}
            name="languages"
            render={({ field }) => (
              <SelectAsync
                id="onboarding-languages"
                name="onboarding-languages"
                title={<Text weight="semibold">Langues parlées</Text>}
                value={field.value || []}
                onChange={(value) => field.onChange(value || [])}
                onBlur={field.onBlur}
                error={
                  submitCount > 0
                    ? (errors.languages as unknown as FieldError | undefined)
                    : undefined
                }
                showLabel
                placeholder="Sélectionnez une ou plusieurs langues"
                isMulti
                openMenuOnClick
                loadOptions={(callback, inputValue) =>
                  loadLanguagesOptions(callback, inputValue)
                }
              />
            )}
          />

          <Controller
            control={control}
            name="interests"
            render={({ field }) => (
              <SelectCreatable
                id="onboarding-interests"
                name="onboarding-interests"
                title={<Text weight="semibold">Centres d'intérêt</Text>}
                value={field.value || []}
                onChange={(value) => field.onChange(value || [])}
                onBlur={field.onBlur}
                error={
                  submitCount > 0
                    ? (errors.interests as unknown as FieldError | undefined)
                    : undefined
                }
                showLabel
                placeholder="Ajoutez jusqu’à 6 centres d’intérêt"
                isMulti
                openMenuOnClick
                maxChar={30}
                maxItems={6}
                options={[]}
              />
            )}
          />
        </>
      )}
    </Accordion>
  );
};
