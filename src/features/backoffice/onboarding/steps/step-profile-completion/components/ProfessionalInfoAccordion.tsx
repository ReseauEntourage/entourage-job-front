import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { H4 } from '@/src/components/ui/Headings';
import { TextInput } from '@/src/components/ui/Inputs';
import { COLORS } from '@/src/constants/styles';
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
    if (submitCount > 0 && !!errors.currentJob) {
      setIsOpen(true);
    }
  }, [errors.currentJob, submitCount]);

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
            error={errors.currentJob}
            showLabel
            placeholder="Ecrivez votre métier"
            maxLength={50} // TODO: Ajuster la limite pour le TextInput avec la limite existante dans l'édition de profil classique
          />
        )}
      />
    </Accordion>
  );
};
