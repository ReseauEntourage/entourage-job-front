import React from 'react';
import type { Formation } from '@/src/api/types';
import { Button, Text } from '@/src/components/ui';
import { CVExperienceOrFormation } from '@/src/features/profile/CVExperienceOrFormation/CVExperienceOrFormation';
import { useEditableFormationsByIndex } from '@/src/features/profile/hooks/useEditableFormations';
import {
  StyledContainer,
  StyledHeader,
  StyledList,
} from './StepFormationsContent.styles';

interface StepFormationsContentProps {
  formations: Formation[];
  onChange: (next: Formation[]) => void;
}

export const StepFormationsContent = ({
  formations,
  onChange,
}: StepFormationsContentProps) => {
  const { addFormation, editFormation, deleteFormation } =
    useEditableFormationsByIndex({
      formations,
      includeSkillId: true,
      onChange,
    });

  return (
    <StyledContainer>
      <StyledHeader>
        <Text weight="semibold">Formations</Text>
        <Button
          variant="default"
          size="small"
          color="darkGray"
          onClick={addFormation}
        >
          Ajouter une formation
        </Button>
      </StyledHeader>

      {formations.length > 0 ? (
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
      ) : (
        <Text color="darkGray" size="small">
          {
            "Aucune formation ajoutée pour l'instant. Vous pouvez passer cette étape."
          }
        </Text>
      )}
    </StyledContainer>
  );
};
