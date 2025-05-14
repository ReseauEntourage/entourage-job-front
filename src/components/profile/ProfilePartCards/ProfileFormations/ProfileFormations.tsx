import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IlluMalette } from 'assets/icons/icons';
import { CVExperienceOrFormation } from '../../CVExperienceOrFormation/CVExperienceOrFormation';
import { ProfilePartCard } from '../Card/Card/Card';
import { Formation } from 'src/api/types';
import { Text } from 'src/components/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { StyledProfileFormationsList } from './ProfileFormations.styles';

export interface ProfileExperiencesProps {
  userId: string;
  userFirstName: string;
  formations?: Formation[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileFormations = ({
  userId,
  userFirstName,
  formations = [],
  isEditable = false,
  smallCard = false,
}: ProfileExperiencesProps) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const isOwnProfile = userId === currentUserId;
  const isCompleted = formations.length > 0;

  const fallback = useMemo(() => {
    const content = isEditable ? (
      <Text>Vous n’avez pas encore renseigné vos formations</Text>
    ) : (
      <Text>{`${userFirstName} n'a pas encore renseigné ses formations`}</Text>
    );
    return {
      content,
      icon: <IlluMalette />,
    };
  }, [isEditable, userFirstName]);

  const suggestHelpToComplete = useCallback(() => {
    // console.log('Suggest help to complete');
  }, []);

  if (!isCompleted && !isEditable) {
    return null;
  }

  return (
    <ProfilePartCard
      title="Formations"
      isCompleted={isCompleted}
      isEditable={isEditable}
      // iaGenerated
      smallCard={smallCard}
      fallback={fallback}
      ctaTitle={
        !isOwnProfile && !isCompleted
          ? `Accompagner ${userFirstName} dans la valorisation de ses formations`
          : undefined
      }
      ctaCallback={
        !isOwnProfile && !isCompleted ? suggestHelpToComplete : undefined
      }
    >
      <StyledProfileFormationsList>
        {formations.map((formation: Formation) => {
          return (
            <CVExperienceOrFormation
              key={formation.id}
              title={formation.title}
              description={formation.description}
              startDate={formation.startDate}
              endDate={formation.endDate}
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
