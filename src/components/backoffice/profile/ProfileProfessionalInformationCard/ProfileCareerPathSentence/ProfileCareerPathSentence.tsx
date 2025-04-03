import React from 'react';
import { BusinessSector, Occupation } from 'src/api/types';
import { Text } from 'src/components/utils';
import { Tag } from 'src/components/utils/Tag';
import { OCCUPATIONS_PREFIXES } from 'src/constants';
import { sortByOrder } from 'src/utils';

interface CareerPath {
  order: number;
  occupation: Occupation;
  businessSector: BusinessSector;
}

interface ProfileCareerPathSentenceProps {
  occupations: Occupation[];
  businessSectors: BusinessSector[];
}

export const ProfileCareerPathSentence = ({
  businessSectors,
  occupations,
}: ProfileCareerPathSentenceProps) => {
  const sortedOccupations =
    occupations?.length > 0 ? sortByOrder(occupations) : null;

  const sortedBusinessSectors =
    businessSectors?.length > 0 ? sortByOrder(businessSectors) : null;

  if (sortedBusinessSectors) {
    const careerPaths = sortedBusinessSectors.reduce<CareerPath[]>(
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      (acc, curr) => {
        const correspondingOccupation = sortedOccupations?.find(({ order }) => {
          return order === curr.order;
        });
        return [
          ...acc,
          {
            order: curr.order,
            occupation: correspondingOccupation?.name,
            businessSector: curr.name,
          },
        ];
      },
      []
    );

    const getOccupationIfExists = (index) => {
      if (careerPaths[index].occupation) {
        return (
          <>
            {' '}
            {OCCUPATIONS_PREFIXES[1].label}{' '}
            <strong>{careerPaths[index].occupation}</strong>
          </>
        );
      }
      return null;
    };

    const hasSecondPart = careerPaths[1] && careerPaths[1].businessSector;

    const hasSameBusinessSector =
      hasSecondPart &&
      careerPaths[1].businessSector.name ===
        careerPaths[0].businessSector.name &&
      careerPaths[1].occupation;

    return (
      <>
        <Text>
          J&apos;aimerais travailler {OCCUPATIONS_PREFIXES[0].label}{' '}
          <Tag content={careerPaths[0].businessSector} />
          {getOccupationIfExists(0)}
          {hasSecondPart && hasSameBusinessSector && (
            <> et {getOccupationIfExists(1)}</>
          )}
        </Text>
        {hasSecondPart && !hasSameBusinessSector && (
          <Text>
            {' '}
            J&lsquo;aimerais travailler {OCCUPATIONS_PREFIXES[0].label}{' '}
            <Tag content={careerPaths[1].businessSector.name} />
            {getOccupationIfExists(1)}
          </Text>
        )}
      </>
    );
  }
  return null;
};
