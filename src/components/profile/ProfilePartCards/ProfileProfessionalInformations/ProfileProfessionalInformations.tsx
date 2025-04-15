import React from 'react';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardTagList } from '../Card/CardTagList/CardTagList';
import { Skill, UserProfileSectorOccupation } from 'src/api/types';
import { ProfileCareerPathSentence } from 'src/components/backoffice/profile/ProfileProfessionalInformationCard/ProfileCareerPathSentence';
import { Text } from 'src/components/utils';
import { StyledContentContainer } from './ProfileProfessionalInformations.styles';

export interface ProfileProfessionalInformationsProps {
  userFirstName: string;
  sectorOccupations: UserProfileSectorOccupation[];
  description: string;
  skills: Skill[];
  smallCard?: boolean;
}

export const ProfileProfessionalInformations = ({
  userFirstName,
  sectorOccupations,
  description,
  skills,
  smallCard = false,
}: ProfileProfessionalInformationsProps) => {
  const isEmpty = !sectorOccupations.length && !description && !skills.length;
  return (
    <ProfilePartCard
      title="Informations professionnelles"
      smallCard={smallCard}
      fallback={{
        content: (
          <Text>
            {`${userFirstName} n'a pas encore renseigné ses informations professionnelles`}
          </Text>
        ),
        icon: <IlluBulleQuestion />,
      }}
      isEmpty={isEmpty}
    >
      <StyledContentContainer>
        {sectorOccupations.length > 0 && (
          <ProfileCareerPathSentence sectorOccupations={sectorOccupations} />
        )}
        <Text>{description}</Text>
        <CardTagList items={skills} />
      </StyledContentContainer>
    </ProfilePartCard>
  );
};
