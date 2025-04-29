import React from 'react';
import { UserProfileSectorOccupation } from 'src/api/types';
import { Text } from 'src/components/utils';
import { Tag } from 'src/components/utils/Tag';
import { OCCUPATIONS_PREFIXES } from 'src/constants';

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
          {' '}
          {OCCUPATIONS_PREFIXES[1].label}{' '}
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
        J&apos;aimerais travailler {OCCUPATIONS_PREFIXES[0].label}{' '}
        <Tag content={sectorOccupations[0].businessSector?.name} />
        {getOccupationIfExists(0)}
        {hasSecondPart && hasSameBusinessSector && (
          <> et {sectorOccupations[1].occupation?.name}</>
        )}
      </Text>
      {hasSecondPart && !hasSameBusinessSector && (
        <Text>
          {' '}
          J&lsquo;aimerais travailler {OCCUPATIONS_PREFIXES[0].label}{' '}
          <Tag content={sectorOccupations[1].businessSector?.name} />
          {getOccupationIfExists(1)}
        </Text>
      )}
    </>
  );
  return null;
};
