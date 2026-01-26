import React, { useEffect, useState } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';
import { LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { H4 } from '@/src/components/ui/Headings';
import {
  SelectAsync,
  SelectCreatable,
  TextInput,
} from '@/src/components/ui/Inputs';
import { COLORS } from '@/src/constants/styles';
import {
  loadBusinessSectorsOptions,
  loadCompaniesOptions,
} from '@/src/features/forms/utils/loadOptions.utils';
import {
  StyledAccordionHeader,
  StyledAccordionHeaderIcon,
  StyledAccordionHeaderTitleContainer,
} from '../Content.styles';
import { ProfileCompletionFormValues } from '../types';

export const ProfessionalInfoAccordion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    control,
    formState: { errors, submitCount },
  } = useFormContext<ProfileCompletionFormValues>();

  useEffect(() => {
    if (
      submitCount > 0 &&
      (!!errors.currentJob ||
        !!errors.companyName ||
        !!errors.businessSectorIds ||
        !!errors.linkedinUrl)
    ) {
      setIsOpen(true);
    }
  }, [
    errors.businessSectorIds,
    errors.companyName,
    errors.currentJob,
    errors.linkedinUrl,
    submitCount,
  ]);

  return (
    <Accordion
      headerContent={
        <StyledAccordionHeader>
          <StyledAccordionHeaderIcon>
            <LucidIcon name="Briefcase" color={COLORS.white} size={24} />
          </StyledAccordionHeaderIcon>
          <StyledAccordionHeaderTitleContainer>
            <H4 title="Informations professionnelles" noMarginBottom />
            <Text>Expérience et compétences</Text>
          </StyledAccordionHeaderTitleContainer>
        </StyledAccordionHeader>
      }
      keepContentMounted
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Controller
        control={control}
        name="currentJob"
        rules={{
          required: 'Veuillez renseigner votre métier.',
          maxLength: {
            value: 50,
            message: 'Votre métier ne peut pas dépasser 50 caractères.',
          },
        }}
        render={({ field }) => (
          <TextInput
            id="onboarding-currentJob"
            name="onboarding-currentJob"
            title={
              <Text weight="semibold">
                Mon métier <span aria-hidden="true">*</span>
              </Text>
            }
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={submitCount > 0 ? errors.currentJob : undefined}
            showLabel
            placeholder="Ecrivez votre métier"
            maxLength={50}
          />
        )}
      />

      <Controller
        control={control}
        name="companyName"
        render={({ field }) => (
          <SelectCreatable
            id="onboarding-companyName"
            name="onboarding-companyName"
            title={
              <Text weight="semibold">
                L'entreprise dans laquelle je travaille
              </Text>
            }
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={
              submitCount > 0
                ? (errors.companyName as unknown as FieldError | undefined)
                : undefined
            }
            showLabel
            placeholder="Sélectionnez ou ajoutez le nom de votre entreprise"
            options={[]}
            isMulti={false}
            openMenuOnClick
            maxChar={60}
            loadOptions={loadCompaniesOptions}
          />
        )}
      />

      <Controller
        control={control}
        name="businessSectorIds"
        rules={{
          validate: (value) =>
            (Array.isArray(value) && value.length > 0) ||
            'Veuillez sélectionner au moins un secteur.',
        }}
        render={({ field }) => (
          <SelectAsync
            id="onboarding-businessSectorIds"
            name="onboarding-businessSectorIds"
            title={
              <Text weight="semibold">
                Les secteurs dans lesquels j'ai du réseau{' '}
                <span aria-hidden="true">*</span>
              </Text>
            }
            value={field.value || []}
            onChange={(value) => field.onChange(value || [])}
            onBlur={field.onBlur}
            error={
              submitCount > 0
                ? (errors.businessSectorIds as unknown as
                    | FieldError
                    | undefined)
                : undefined
            }
            showLabel
            placeholder="Sélectionnez un ou plusieurs secteurs dans la liste"
            isMulti
            openMenuOnClick
            loadOptions={(callback, inputValue) =>
              loadBusinessSectorsOptions(callback, inputValue)
            }
          />
        )}
      />

      <Controller
        control={control}
        name="linkedinUrl"
        rules={{
          validate: (fieldValue) => {
            return (
              !fieldValue ||
              (!!fieldValue && fieldValue.includes('linkedin.com'))
            );
          },
        }}
        render={({ field }) => (
          <TextInput
            id="onboarding-linkedinUrl"
            name="onboarding-linkedinUrl"
            title={<Text weight="semibold">Profil LinkedIn</Text>}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={submitCount > 0 ? errors.linkedinUrl : undefined}
            showLabel
            placeholder="https://www.linkedin.com/in/votre-profil"
          />
        )}
      />
    </Accordion>
  );
};
