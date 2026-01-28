import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Experience, Formation } from '@/src/api/types';
import { Alert, Button, LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { H4, H5 } from '@/src/components/ui/Headings';
import { SelectAsync, SelectCreatable } from '@/src/components/ui/Inputs';
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
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import {
  currentUserActions,
  selectIsComplete,
} from '@/src/use-cases/current-user';
import {
  StyledAccordionHeader,
  StyledAccordionHeaderIcon,
  StyledAccordionHeaderTitleContainer,
} from '../../Content.styles';
import { ProfileCompletionFormValues } from '../../types';
import {
  StyledExperienceOrFormationFormFieldContainer,
  StyledExperienceOrFormationFormFieldLabelContainer,
  StyledExperienceOrFormationList,
} from './CvCompletionAccordion.styles';

export const CvCompletionAccordion = () => {
  const dispatch = useDispatch();
  const currentUser = useAuthenticatedUser();
  const userIsComplete = useSelector(selectIsComplete);
  const [isOpen, setIsOpen] = useState(false);

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

        dispatch(currentUserActions.uploadExternalCvRequested(formData));
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
        variant={AlertVariant.Info}
        icon={
          <LucidIcon name="Sparkles" color={COLORS.primaryBlue} size={25} />
        }
      >
        <H5 title="Gagnez du temps avec l'IA" />
        <Text>
          Importez votre CV et laissez notre IA remplir automatiquement vos
          expériences, formations, compétences, langues et centres d’intérêt.
          Vous pourrez ensuite modifier ces informations si besoin.
        </Text>
      </Alert>
      <br />
      <Text weight="semibold">Votre CV existant</Text>

      {/* Button shown when CV has not been uploaded yet */}
      {!currentUser.userProfile.hasExternalCv && (
        <Button
          style={{ display: 'block', width: '100%' }}
          variant="primary"
          rounded={false}
          onClick={handleUploadCv}
        >
          Importer mon CV
        </Button>
      )}

      {/* Alert success shown when CV has been successfully uploaded */}
      {currentUser.userProfile.hasExternalCv && (
        <>
          <Alert
            variant={AlertVariant.Success}
            icon={<LucidIcon name="Check" color={COLORS.black} size={25} />}
          >
            <Text weight="semibold">Votre CV a bien été importé !</Text>
          </Alert>
          <br />
          <Button style={{ display: 'block', width: '100%' }} variant="primary">
            <LucidIcon name="Sparkles" />
            &nbsp; Remplir automatiquement mon profil avec l'IA
          </Button>
        </>
      )}

      <br />
      {/* Form should only be shown when user data is complete */}
      {userIsComplete && (
        <>
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

          <br />

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

          <br />

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
              />
            )}
          />

          <br />

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

          <br />

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
