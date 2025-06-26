import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { UserProfileSectorOccupation } from 'src/api/types';
import { Text } from 'src/components/utils';
import { Tag } from 'src/components/utils/Tag';

interface ProfileCareerPathSentenceProps {
  sectorOccupations: UserProfileSectorOccupation[];
  currentJob?: string;
  role: UserRoles;
}

export const ProfileCareerPathSentence = ({
  sectorOccupations,
  currentJob,
  role,
}: ProfileCareerPathSentenceProps) => {
  const hasSecondPart = sectorOccupations?.length > 1;

  const getOccupationIfExists = (index) => {
    if (sectorOccupations[index].occupation) {
      return (
        <>
          {' comme '}
          <strong>{sectorOccupations[index].occupation?.name}</strong>
        </>
      );
    }
    return null;
  };

  const hasSameBusinessSector =
    hasSecondPart &&
    sectorOccupations[1].businessSector?.name ===
      sectorOccupations[0].businessSector?.name &&
    sectorOccupations[1].occupation;

  if (role === UserRoles.COACH) {
    return (
      <>
        <Text>
          Je travaille comme <strong>{currentJob}</strong>
        </Text>
        <Text>
          J&apos;ai du réseau dans :{' '}
          {sectorOccupations.map((sectorOccupation, index) => (
            <Tag content={sectorOccupation.businessSector?.name} key={index} />
          ))}
        </Text>
      </>
    );
  }
  return (
    <>
      <Text>
        J&apos;aimerais travailler dans{' '}
        <Tag content={sectorOccupations[0].businessSector?.name} />
        {getOccupationIfExists(0)}
        {hasSecondPart && hasSameBusinessSector && (
          <>
            {' '}
            et <strong>{sectorOccupations[1].occupation?.name}</strong>
          </>
        )}
      </Text>
      {hasSecondPart && !hasSameBusinessSector && (
        <Text>
          {' '}
          J&lsquo;aimerais travailler dans{' '}
          <Tag content={sectorOccupations[1].businessSector?.name} />
          {getOccupationIfExists(1)}
        </Text>
      )}
    </>
  );
};
