import React, { useCallback } from 'react';
import { IlluMalette } from 'assets/icons/icons';
import { CVExperienceOrFormation } from '../../CVExperienceOrFormation';
import { ProfilePartCard } from '../Card/Card/Card';
import { CVExperience } from 'src/api/types';
import { Text } from 'src/components/utils';
import { StyledProfileExperiencesList } from './ProfileExperiences.styles';

export interface ProfileExperiencesProps {
  experiences?: CVExperience[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileExperiences = ({
  experiences = [],
  isEditable = false,
  smallCard = false,
}: ProfileExperiencesProps) => {
  const isCompleted = experiences.length > 0;

  const editModal = useCallback(() => {}, []);

  return (
    <ProfilePartCard
      title="Expériences et compétences"
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editModal}
      iaGenerated
      smallCard={smallCard}
      fallback={{
        content: (
          <Text>
            Vous n’avez pas encore renseigner d’expérience professionnelle. Si
            vous avez de l&apos;expérience, nous vous invitons à la partager.
            Elle est essentielle pour nos coachs et pour les recruteurs.
          </Text>
        ),
        icon: <IlluMalette />,
      }}
    >
      <StyledProfileExperiencesList>
        {experiences.map((experience: CVExperience) => {
          return (
            <CVExperienceOrFormation
              key={experience.id}
              title={experience.title}
              description={experience.description}
              dateStart={experience.dateStart}
              dateEnd={experience.dateEnd}
              location={experience.location}
              structure={experience.company}
              skills={experience.skills}
            />
          );
        })}
      </StyledProfileExperiencesList>
    </ProfilePartCard>
  );
};
