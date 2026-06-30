import React from 'react';
import styled from 'styled-components';
import { ProfileCompletionSchemaField } from '../components/ProfileCompletionSchemaField';
import {
  profileCompletionFormSchema,
  profileCompletionCvFields,
} from '../profileCompletionFormSchema';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// skills = index 1, languages = index 2, interests = index 3
const [, skillsField, languagesField, interestsField] =
  profileCompletionCvFields;

export const StepSkillsContent = () => {
  return (
    <StyledContainer>
      <ProfileCompletionSchemaField
        formSchema={profileCompletionFormSchema}
        field={skillsField}
        showError={false}
      />
      <ProfileCompletionSchemaField
        formSchema={profileCompletionFormSchema}
        field={languagesField}
        showError={false}
      />
      <ProfileCompletionSchemaField
        formSchema={profileCompletionFormSchema}
        field={interestsField}
        showError={false}
      />
    </StyledContainer>
  );
};
