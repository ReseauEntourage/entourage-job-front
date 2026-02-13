import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { H4 } from '@/src/components/ui/Headings';
import { COLORS } from '@/src/constants/styles';
import {
  StyledAccordionHeader,
  StyledAccordionHeaderIcon,
  StyledAccordionHeaderTitleContainer,
} from '../../Content.styles';
import {
  profileCompletionFormSchema,
  profileCompletionProfessionalInfoCandidateRows,
} from '../../profileCompletionFormSchema';
import type { ProfileCompletionFormValues } from '../../types';
import { ProfileCompletionSchemaField } from '../ProfileCompletionSchemaField';
import { StyledTwoColumns } from './ProfesionalInfoAccordion.styles';

export const ProfessionalInfoAccordionCandidate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    formState: { errors, submitCount },
  } = useFormContext<ProfileCompletionFormValues>();

  useEffect(() => {
    if (
      submitCount > 0 &&
      (!!errors.businessSectorId0 ||
        !!errors.occupation0 ||
        !!errors.businessSectorId1 ||
        !!errors.occupation1)
    ) {
      setIsOpen(true);
    }
  }, [
    errors.businessSectorId0,
    errors.occupation0,
    errors.businessSectorId1,
    errors.occupation1,
    submitCount,
  ]);

  const rows = useMemo(() => {
    return profileCompletionProfessionalInfoCandidateRows;
  }, []);

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
      {rows.map((row) => (
        <StyledTwoColumns key={row.rowIndex}>
          {row.fields.map((field) => (
            <ProfileCompletionSchemaField
              key={String(field.name)}
              formSchema={profileCompletionFormSchema}
              field={field}
              showError={submitCount > 0}
            />
          ))}
        </StyledTwoColumns>
      ))}
    </Accordion>
  );
};
