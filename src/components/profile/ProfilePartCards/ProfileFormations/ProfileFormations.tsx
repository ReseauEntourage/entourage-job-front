import React, { useCallback } from 'react';
import { IlluMalette } from 'assets/icons/icons';
import { CVExperienceOrFormation } from '../../CVExperienceOrFormation';
import { ProfilePartCard } from '../Card/Card/Card';
import { CVFormation } from 'src/api/types';
import { Text } from 'src/components/utils';
import { StyledProfileFormationsList } from './ProfileFormations.styles';

export interface ProfileExperiencesProps {
  formations?: CVFormation[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileFormations = ({
  formations = [],
  isEditable = false,
  smallCard = false,
}: ProfileExperiencesProps) => {
  const isCompleted = formations.length > 0;

  const editModal = useCallback(() => {}, []);

  return (
    <ProfilePartCard
      title="Formations"
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editModal}
      iaGenerated
      smallCard={smallCard}
      fallback={{
        content: <Text>Vous n’avez pas encore renseigné vos formations</Text>,
        icon: <IlluMalette />,
      }}
    >
      <StyledProfileFormationsList>
        {formations.map((formation: CVFormation) => {
          return (
            <CVExperienceOrFormation
              key={formation.id}
              title={formation.title}
              description={formation.description}
              dateStart={formation.dateStart}
              dateEnd={formation.dateEnd}
              location={formation.location}
              structure={formation.institution}
              skills={formation.skills}
            />
          );
        })}
      </StyledProfileFormationsList>
    </ProfilePartCard>
  );
};
