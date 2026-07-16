import React, { useMemo } from 'react';
import type { Experience, Formation } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import { ProfileCompletionSchemaField } from '../components/ProfileCompletionSchemaField';
import {
  profileCompletionFormSchema,
  profileCompletionCvFields,
  buildIntroductionField,
} from '../profileCompletionFormSchema';
import {
  StyledContainer,
  StyledSection,
  StyledSectionTitle,
} from './StepCvRecapContent.styles';
import { StepExperiencesContent } from './StepExperiencesContent';
import { StepFormationsContent } from './StepFormationsContent';

const [skillsField, languagesField, interestsField] = profileCompletionCvFields;

interface StepCvRecapContentProps {
  userRole: UserRoles | undefined;
  experiences: Experience[];
  formations: Formation[];
  onExperiencesChange: (next: Experience[]) => void;
  onFormationsChange: (next: Formation[]) => void;
}

export const StepCvRecapContent = ({
  userRole,
  experiences,
  formations,
  onExperiencesChange,
  onFormationsChange,
}: StepCvRecapContentProps) => {
  const introductionField = useMemo(
    () => buildIntroductionField(userRole),
    [userRole]
  );

  return (
    <StyledContainer>
      <StyledSection>
        <ProfileCompletionSchemaField
          formSchema={profileCompletionFormSchema}
          field={introductionField}
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
