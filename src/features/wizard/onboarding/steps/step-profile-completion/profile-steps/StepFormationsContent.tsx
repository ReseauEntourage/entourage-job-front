import React from 'react';
import type { Formation } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { CVExperienceOrFormation } from '@/src/features/profile/CVExperienceOrFormation/CVExperienceOrFormation';
import { useEditableFormationsByIndex } from '@/src/features/profile/hooks/useEditableFormations';
import { StepAddItemButton } from './StepAddItemButton';
import {
  StyledContainer,
  StyledList,
  StyledListWithAdd,
} from './StepFormationsContent.styles';

interface StepFormationsContentProps {
  formations: Formation[];
  onChange: (next: Formation[]) => void;
  showSectionTitle?: boolean;
}

export const StepFormationsContent = ({
  formations,
  onChange,
  showSectionTitle = false,
}: StepFormationsContentProps) => {
  const { addFormation, editFormation, deleteFormation } =
    useEditableFormationsByIndex({
      formations,
      includeSkillId: true,
      onChange,
    });

  return (
    <StyledContainer>
      {showSectionTitle && <Text weight="semibold">Formations</Text>}

      {formations.length > 0 ? (
        <StyledListWithAdd>
          <StyledList>
            {formations.map((formation, idx) => (
              <CVExperienceOrFormation
                key={formation.id ?? `${formation.title}-${idx}`}
                title={formation.title}
                description={formation.description}
                startDate={formation.startDate}
                endDate={formation.endDate}
                location={formation.location}
                structure={formation.institution}
                skills={formation.skills || []}
                isEditable
                editItem={() => editFormation(idx)}
                deleteItem={() => deleteFormation(idx)}
              />
            ))}
          </StyledList>
          <StepAddItemButton
            variant="inline"
            label="Ajouter une autre formation"
            onClick={addFormation}
          />
        </StyledListWithAdd>
      ) : (
        <>
          <StepAddItemButton
            variant="empty"
            label="Ajouter une formation"
            helpText="Intitulé, établissement et dates."
            onClick={addFormation}
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
