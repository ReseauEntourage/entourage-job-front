import React from 'react';
import styled from 'styled-components';
import { ProfileCompletionSchemaField } from '../components/ProfileCompletionSchemaField';
import {
  buildIntroductionField,
  profileCompletionFormSchema,
} from '../profileCompletionFormSchema';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const introductionField = buildIntroductionField(
  'Cette présentation sera visible par les autres membres du réseau d’entraide. En quelques lignes, parlez de votre parcours et de ce que vous recherchez.'
);

export const StepPresentationContent = () => {
  return (
    <StyledContainer>
      <ProfileCompletionSchemaField
        formSchema={profileCompletionFormSchema}
        field={introductionField}
        showError={false}
      />
    </StyledContainer>
  );
};
