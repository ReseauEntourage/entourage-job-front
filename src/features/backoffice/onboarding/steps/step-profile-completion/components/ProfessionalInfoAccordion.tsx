import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { H4 } from '@/src/components/ui/Headings';
import { COLORS } from '@/src/constants/styles';
import {
  StyledAccordionHeader,
  StyledAccordionHeaderIcon,
  StyledAccordionHeaderTitleContainer,
} from '../Content.styles';
import {
  profileCompletionFormSchema,
  profileCompletionProfessionalInfoCoachFields,
} from '../profileCompletionFormSchema';
import type { ProfileCompletionFormValues } from '../types';
import { ProfileCompletionSchemaField } from './ProfileCompletionSchemaField';

export const ProfessionalInfoAccordion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
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
      {profileCompletionProfessionalInfoCoachFields.map((field) => (
        <ProfileCompletionSchemaField
          key={String(field.name)}
          formSchema={profileCompletionFormSchema}
          field={field}
          showError={submitCount > 0}
        />
      ))}
    </Accordion>
  );
};
