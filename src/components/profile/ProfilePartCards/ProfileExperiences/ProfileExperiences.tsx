import React, { useCallback } from 'react';
import { CVExperienceOrFormation } from '../../CVExperienceOrFormation';
import { ProfilePartCard } from '../Card/Card/Card';
import { CVExperience } from 'src/api/types';
import { StyledProfileExperiencesList } from './ProfileExperiences.styles';

export interface ProfileExperiencesProps {
  experiences?: CVExperience[];
  isEditable?: boolean;
}

export const ProfileExperiences = ({
  experiences = [],
  isEditable = false,
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
