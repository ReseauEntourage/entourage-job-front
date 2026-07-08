import React from 'react';
import styled from 'styled-components';
import type { Experience } from '@/src/api/types';
import { Button, Text } from '@/src/components/ui';
import { CVExperienceOrFormation } from '@/src/features/profile/CVExperienceOrFormation/CVExperienceOrFormation';
import { useEditableExperiencesByIndex } from '@/src/features/profile/hooks/useEditableExperiences';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface StepExperiencesContentProps {
  experiences: Experience[];
  onChange: (next: Experience[]) => void;
}

export const StepExperiencesContent = ({
  experiences,
  onChange,
}: StepExperiencesContentProps) => {
  const { addExperience, editExperience, deleteExperience } =
    useEditableExperiencesByIndex({
      experiences,
      includeSkillId: true,
      onChange,
    });

  return (
    <StyledContainer>
      <StyledHeader>
        <Text weight="semibold">Expériences professionnelles</Text>
        <Button
          variant="default"
          size="small"
          color="darkGray"
          onClick={addExperience}
        >
          Ajouter une expérience
        </Button>
      </StyledHeader>

      {experiences.length > 0 ? (
        <StyledList>
          {experiences.map((experience, idx) => (
            <CVExperienceOrFormation
              key={experience.id ?? `${experience.title}-${idx}`}
              title={experience.title}
              description={experience.description}
              startDate={experience.startDate}
              endDate={experience.endDate}
              location={experience.location}
              structure={experience.company}
              skills={experience.skills || []}
              isEditable
              editItem={() => editExperience(idx)}
              deleteItem={() => deleteExperience(idx)}
            />
          ))}
        </StyledList>
      ) : (
        <Text color="darkGray" size="small">
          {
            "Aucune expérience ajoutée pour l'instant. Vous pouvez passer cette étape."
          }
        </Text>
      )}
    </StyledContainer>
  );
};
