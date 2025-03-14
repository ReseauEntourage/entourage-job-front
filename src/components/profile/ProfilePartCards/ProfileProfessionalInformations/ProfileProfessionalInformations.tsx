import React from 'react';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardTagList } from '../Card/CardTagList/CardTagList';
import { Skill } from 'src/api/types';
import { ProfileCareerPathSentence } from 'src/components/backoffice/profile/ProfileProfessionalInformationCard/ProfileCareerPathSentence';
import { Text } from 'src/components/utils';
import { AmbitionsPrefixesType } from 'src/constants';
import { StyledContentContainer } from './ProfileProfessionalInformations.styles';

type Ambition = {
  name: string;
  order: number;
  prefix: AmbitionsPrefixesType;
};

type BusinessLine = {
  name: string;
  order: number;
};

export interface ProfileProfessionalInformationsProps {
  ambitions: Ambition[];
  businessLines: BusinessLine[];
  description: string;
  skills: Skill[];
  smallCard?: boolean;
}

export const ProfileProfessionalInformations = ({
  ambitions,
  businessLines,
  description,
  skills,
  smallCard = false,
}: ProfileProfessionalInformationsProps) => {
  return (
    <ProfilePartCard
      title="Informations professionnelles"
      smallCard={smallCard}
    >
      <StyledContentContainer>
        <ProfileCareerPathSentence
          ambitions={ambitions}
          businessLines={businessLines}
        />
        <Text>{description}</Text>
        <CardTagList items={skills} />
      </StyledContentContainer>
    </ProfilePartCard>
  );
};
