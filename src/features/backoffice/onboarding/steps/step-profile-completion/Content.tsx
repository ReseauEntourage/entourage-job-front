import React from 'react';
import { Text } from '@/src/components/ui';
import { AccordionGroup } from '@/src/components/ui/Accordion/AccordionGroup';
import { CompletionStatus } from './CompletionStatus';
import { StyledProfileSubHeader } from './Content.styles';
import { CvCompletionAccordion } from './components/CvCompletionAccordion';
import { PersonalInfoAccordion } from './components/PersonalInfoAccordion';
import { ProfessionalInfoAccordion } from './components/ProfessionalInfoAccordion';

export const Content = () => {
  return (
    <>
      <StyledProfileSubHeader>
        <Text>Les champs marqués d’un astérisque (*) sont obligatoires</Text>
        <CompletionStatus completion={75} />
      </StyledProfileSubHeader>
      <br />
      <br />
      <AccordionGroup>
        <PersonalInfoAccordion />
        <ProfessionalInfoAccordion />
        <CvCompletionAccordion />
      </AccordionGroup>
    </>
  );
};
