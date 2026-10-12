import React from 'react';
import type { Experience } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { CVExperienceOrFormation } from '@/src/features/profile/CVExperienceOrFormation/CVExperienceOrFormation';
import { useEditableExperiencesByIndex } from '@/src/features/profile/hooks/useEditableExperiences';
import { StepAddItemButton } from './StepAddItemButton';
import {
  StyledContainer,
  StyledList,
  StyledListWithAdd,
} from './StepExperiencesContent.styles';

interface StepExperiencesContentProps {
  experiences: Experience[];
  onChange: (next: Experience[]) => void;
  showSectionTitle?: boolean;
}

export const StepExperiencesContent = ({
  experiences,
  onChange,
  showSectionTitle = false,
}: StepExperiencesContentProps) => {
  const { addExperience, editExperience, deleteExperience } =
    useEditableExperiencesByIndex({
      experiences,
      includeSkillId: true,
      onChange,
    });

  return (
    <StyledContainer>
      {showSectionTitle && (
        <Text weight="semibold">Expériences professionnelles</Text>
      )}

      {experiences.length > 0 ? (
        <StyledListWithAdd>
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
          <StepAddItemButton
            variant="inline"
            label="Ajouter une autre expérience"
            onClick={addExperience}
          />
        </StyledListWithAdd>
      ) : (
        <>
          <StepAddItemButton
            variant="empty"
            label="Ajouter une expérience"
            helpText="Poste, structure et dates."
            onClick={addExperience}
          />
          {!showSectionTitle && (
            <Text color="darkGray" size="small">
              Vous pouvez passer cette étape.
            </Text>
          )}
        </>
      )}
    </StyledContainer>
  );
};
