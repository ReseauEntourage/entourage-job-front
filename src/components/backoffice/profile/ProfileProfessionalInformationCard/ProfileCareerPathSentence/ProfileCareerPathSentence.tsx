import React from 'react';
import { UserProfileSectorOccupation } from 'src/api/types';
import { Text } from 'src/components/utils';
import { Tag } from 'src/components/utils/Tag';

interface ProfileCareerPathSentenceProps {
  sectorOccupations: UserProfileSectorOccupation[];
}

export const ProfileCareerPathSentence = ({
  sectorOccupations,
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
  return null;
};
