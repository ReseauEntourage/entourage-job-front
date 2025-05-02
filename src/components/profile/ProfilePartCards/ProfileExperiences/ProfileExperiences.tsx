import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IlluMalette } from 'assets/icons/icons';
import { CVExperienceOrFormation } from '../../CVExperienceOrFormation';
import { ProfilePartCard } from '../Card/Card/Card';
import { Experience } from 'src/api/types';
import { Text } from 'src/components/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { StyledProfileExperiencesList } from './ProfileExperiences.styles';

export interface ProfileExperiencesProps {
  userId: string;
  userFirstName: string;
  experiences?: Experience[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileExperiences = ({
  userId,
  userFirstName,
  experiences = [],
  isEditable = false,
  smallCard = false,
}: ProfileExperiencesProps) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const isOwnProfile = userId === currentUserId;
  const isCompleted = experiences.length > 0;

  const fallback = useMemo(() => {
    const content = isEditable ? (
      <Text>
        Vous n’avez pas encore renseigner d’expérience professionnelle. Si vous
        avez de l&apos;expérience, nous vous invitons à la partager. Elle est
        essentielle pour nos coachs et pour les recruteurs.
      </Text>
    ) : (
      <Text>{`${userFirstName} n’a pas encore renseigné ses expériences professionnelles`}</Text>
    );
    return {
      content,
      icon: <IlluMalette />,
    };
  }, [isEditable, userFirstName]);

  const suggestHelpToComplete = useCallback(() => {
    // console.log('Suggest help to complete');
  }, []);

  return (
    <ProfilePartCard
      title="Expériences et compétences"
      isCompleted={isCompleted}
      isEditable={isEditable}
      // iaGenerated
      smallCard={smallCard}
      fallback={fallback}
      ctaTitle={
        !isOwnProfile && !isCompleted
          ? `Accompagner ${userFirstName} dans la valorisation de ses expériences`
          : undefined
      }
      ctaCallback={
        !isOwnProfile && !isCompleted ? suggestHelpToComplete : undefined
      }
    >
      <StyledProfileExperiencesList>
        {experiences.map((experience: Experience) => {
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
