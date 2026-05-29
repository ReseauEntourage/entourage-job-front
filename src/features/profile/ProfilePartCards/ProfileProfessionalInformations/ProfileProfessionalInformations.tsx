import React from 'react';
import { Text } from '@/src/components/ui';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { UserRoles } from '@/src/constants/users';
import { ProfileCareerPathSentence } from '@/src/features/backoffice/profile/ProfileProfessionalInformationCard/ProfileCareerPathSentence';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardTagList } from '../Card/CardTagList/CardTagList';
import { Company, Skill, UserProfileSectorOccupation } from 'src/api/types';
import { StyledContentContainer } from './ProfileProfessionalInformations.styles';

interface ProfileProfessionalInformationsProps {
  userFirstName: string;
  sectorOccupations: UserProfileSectorOccupation[];
  description: string;
  skills: Skill[];
  role: UserRoles;
  currentJob?: string;
  company: Company | null;
}

export const ProfileProfessionalInformations = ({
  userFirstName,
  sectorOccupations,
  description,
  skills,
  role,
  currentJob,
  company,
}: ProfileProfessionalInformationsProps) => {
  const isEmpty = !sectorOccupations.length && !description && !skills.length;
  return (
    <ProfilePartCard
      title="Informations professionnelles"
      fallback={{
        content: (
          <Text>
            {`${userFirstName} n'a pas encore renseigné ses informations professionnelles`}
          </Text>
        ),
        icon: <SvgIcon name="IlluBulleQuestion" width={80} height={80} />,
      }}
      isEmpty={isEmpty}
    >
      <StyledContentContainer>
        {(sectorOccupations.length > 0 || company) && (
          <ProfileCareerPathSentence
            company={company}
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
