import React from 'react';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardTagList } from '../Card/CardTagList/CardTagList';
import { BusinessSector, Occupation, Skill } from 'src/api/types';
import { ProfileCareerPathSentence } from 'src/components/backoffice/profile/ProfileProfessionalInformationCard/ProfileCareerPathSentence';
import { Text } from 'src/components/utils';
import { StyledContentContainer } from './ProfileProfessionalInformations.styles';

export interface ProfileProfessionalInformationsProps {
  userFirstName: string;
  occupations: Occupation[];
  businessSectors: BusinessSector[];
  description: string;
  skills: Skill[];
  smallCard?: boolean;
}

export const ProfileProfessionalInformations = ({
  userFirstName,
  occupations,
  businessSectors,
  description,
  skills,
  smallCard = false,
}: ProfileProfessionalInformationsProps) => {
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
      isEmpty={!occupations.length && !businessSectors.length && !description}
    >
      <StyledContentContainer>
        <ProfileCareerPathSentence
          occupations={occupations}
          businessSectors={businessSectors}
        />
        <Text>{description}</Text>
        <CardTagList items={skills} />
      </StyledContentContainer>
    </ProfilePartCard>
  );
};
