import React from 'react';
import { UserProfileSectorOccupation } from 'src/api/types';
import { Text, TextSize, TextWeight } from 'src/components/utils';
import { Tag } from 'src/components/utils/Tag';
import { StyledCareerPathSimpleSentenceTag } from './ProfileCareerPathSentence.styles';

interface ProfileCareerPathSentenceProps {
  sectorOccupations: UserProfileSectorOccupation[];
  asSimpleSentence?: boolean;
  size?: TextSize;
  weight?: TextWeight;
}

export const ProfileCareerPathSentence = ({
  sectorOccupations,
  asSimpleSentence = false,
  size = 'normal',
  weight = 'normal',
}: ProfileCareerPathSentenceProps) => {
  if (!sectorOccupations || sectorOccupations.length === 0) {
    return <>Je suis ouvert à toutes les opportunités</>;
  }
  const hasSecondPart = sectorOccupations?.length > 1;

  const getOccupationIfExists = (index, accent = false) => {
    if (sectorOccupations[index].occupation) {
      return (
        <>
          {' comme '}
          {accent ? (
            <StyledCareerPathSimpleSentenceTag>
              {sectorOccupations[index].occupation?.name}
            </StyledCareerPathSimpleSentenceTag>
          ) : (
            <strong>{sectorOccupations[index].occupation?.name}</strong>
          )}
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
      <Text size={size} weight={weight}>
        J&apos;aimerais travailler dans{' '}
        {asSimpleSentence && sectorOccupations[0].businessSector?.prefixes && (
          <span>
            {sectorOccupations[0].businessSector?.prefixes.split(',')[0]}
          </span>
        )}
        {asSimpleSentence ? (
          <span>{sectorOccupations[0].businessSector?.name}</span>
        ) : (
          <Tag content={sectorOccupations[0].businessSector?.name} />
        )}
        {getOccupationIfExists(0, asSimpleSentence)}
        {hasSecondPart && hasSameBusinessSector && (
          <>
            {' '}
            et{' '}
            {asSimpleSentence ? (
              <StyledCareerPathSimpleSentenceTag>
                {sectorOccupations[1].occupation?.name}
              </StyledCareerPathSimpleSentenceTag>
            ) : (
              <strong>{sectorOccupations[1].occupation?.name}</strong>
            )}
          </>
        )}
        {hasSecondPart && !hasSameBusinessSector && (
          <>
            {' '}
            {!asSimpleSentence && (
              <>
                <br />
                <br />
              </>
            )}
            {asSimpleSentence ? 'ou dans' : "J'aimerais travailler dans"}{' '}
            {asSimpleSentence &&
              sectorOccupations[1].businessSector?.prefixes && (
                <span>
                  {sectorOccupations[1].businessSector?.prefixes.split(',')[0]}{' '}
                </span>
              )}
            {asSimpleSentence ? (
              <span>{sectorOccupations[1].businessSector?.name}</span>
            ) : (
              <Tag content={sectorOccupations[1].businessSector?.name} />
            )}
            {getOccupationIfExists(1, asSimpleSentence)}
          </>
        )}
      </Text>
    </>
  );
};
