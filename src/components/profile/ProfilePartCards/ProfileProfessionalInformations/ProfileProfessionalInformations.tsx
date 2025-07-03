import React from 'react';
import { UserRoles } from '@/src/constants/users';
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
  role: UserRoles;
  currentJob?: string;
  smallCard?: boolean;
}

export const ProfileProfessionalInformations = ({
  userFirstName,
  sectorOccupations,
  description,
  skills,
  role,
  currentJob,
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
          <ProfileCareerPathSentence
            sectorOccupations={sectorOccupations}
            role={role}
            currentJob={currentJob}
          />
        )}
        {description && <Text>{description}</Text>}
        {skills.length > 0 && (
          <>
            <Text>J&apos;ai des compétences dans :</Text>
            <CardTagList items={skills} />
          </>
        )}
      </StyledContentContainer>
    </ProfilePartCard>
  );
};
