import React, { useEffect, useState } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { H4, H5 } from '@/src/components/ui/Headings';
import { SelectCreatable } from '@/src/components/ui/Inputs';
import { COLORS } from '@/src/constants/styles';
import { loadSkillsOptions } from '@/src/features/forms/utils/loadOptions.utils';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import {
  currentUserActions,
  selectIsComplete,
} from '@/src/use-cases/current-user';
import {
  StyledAccordionHeader,
  StyledAccordionHeaderIcon,
  StyledAccordionHeaderTitleContainer,
} from '../Content.styles';
import { ProfileCompletionFormValues } from '../types';

export const CvCompletionAccordion = () => {
  const dispatch = useDispatch();
  const currentUser = useAuthenticatedUser();
  const userIsComplete = useSelector(selectIsComplete);
  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    formState: { errors, submitCount },
  } = useFormContext<ProfileCompletionFormValues>();

  useEffect(() => {
    if (submitCount > 0 && (!!errors.skills || !!errors.interests)) {
      setIsOpen(true);
    }
  }, [errors.interests, errors.skills, submitCount]);

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
