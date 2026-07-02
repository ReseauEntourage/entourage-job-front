import React from 'react';
import styled from 'styled-components';
import type { Experience, Formation } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { ProfileCompletionSchemaField } from '../components/ProfileCompletionSchemaField';
import {
  profileCompletionFormSchema,
  profileCompletionCvFields,
  buildIntroductionField,
} from '../profileCompletionFormSchema';
import { StepExperiencesContent } from './StepExperiencesContent';
import { StepFormationsContent } from './StepFormationsContent';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledSectionTitle = styled.div`
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e5e5;
`;

const introductionField = buildIntroductionField(
  'En quelques lignes, présentez votre parcours et vos objectifs.'
);

const [descriptionField, skillsField, languagesField, interestsField] =
  profileCompletionCvFields;

interface StepCvRecapContentProps {
  experiences: Experience[];
  formations: Formation[];
  onExperiencesChange: (next: Experience[]) => void;
  onFormationsChange: (next: Formation[]) => void;
}

export const StepCvRecapContent = ({
  experiences,
  formations,
  onExperiencesChange,
  onFormationsChange,
}: StepCvRecapContentProps) => {
  return (
    <StyledContainer>
      <StyledSection>
        <ProfileCompletionSchemaField
          formSchema={profileCompletionFormSchema}
          field={introductionField}
          showError={false}
        />
        <ProfileCompletionSchemaField
          formSchema={profileCompletionFormSchema}
          field={descriptionField}
          showError={false}
        />
      </StyledSection>

      <StyledSection>
        <StepExperiencesContent
          experiences={experiences}
          onChange={onExperiencesChange}
        />
      </StyledSection>

      <StyledSection>
        <StepFormationsContent
          formations={formations}
          onChange={onFormationsChange}
        />
      </StyledSection>

      <StyledSection>
        <StyledSectionTitle>
          <Text weight="semibold">Compétences</Text>
        </StyledSectionTitle>
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
      </StyledSection>
    </StyledContainer>
  );
};
