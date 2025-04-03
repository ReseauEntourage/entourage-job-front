import React from 'react';
import { BusinessSector, Occupation } from 'src/api/types';
import { OCCUPATIONS_PREFIXES, BUSINESS_SECTORS } from 'src/constants';
import {
  buildBusinessSectorForSentence,
  findConstantFromValue,
  getOccupationsLinkingSentence,
  sortByOrder,
} from 'src/utils';
import { StyledCareerPathSentenceContainer } from './CVCareerPathSentence.styles';

interface CVCareerPathSentenceNewProps {
  occupations: Occupation[];
  businessSectors: BusinessSector[];
}

export const CVCareerPathSentenceNew = ({
  businessSectors,
  occupations,
}: CVCareerPathSentenceNewProps) => {
  const sortedOccupations =
    occupations?.length > 0 ? sortByOrder(occupations) : null;

  const sortedBusinessSectors =
    businessSectors?.length > 0 ? sortByOrder(businessSectors) : null;

  const isNewCareerPath = sortedBusinessSectors?.every(({ order }) => {
    return order > -1;
  });

  if (!isNewCareerPath) {
    if (sortedOccupations) {
      return (
        <>
          J&apos;aimerais travailler{' '}
          {sortedOccupations[0].prefix ||
            OCCUPATIONS_PREFIXES[0].label.toLowerCase()}{' '}
          <span className="orange">{sortedOccupations[0].name}</span>
          {sortedOccupations.length > 1 && (
            <>
              {getOccupationsLinkingSentence(sortedOccupations)}
              <span className="orange">{sortedOccupations[1].name}</span>
            </>
          )}
        </>
      );
    }
    return null;
  }

  if (sortedBusinessSectors) {
    const careerPaths = sortedBusinessSectors.reduce(
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
            businessSector: {
              ...findConstantFromValue(curr.value, BUSINESS_SECTORS),
              label: buildBusinessSectorForSentence(
                findConstantFromValue(curr.value, BUSINESS_SECTORS)
              ),
            },
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
            {OCCUPATIONS_PREFIXES[1].label.toLowerCase()}{' '}
            <span className="orange">{careerPaths[index].occupation}</span>
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
      <StyledCareerPathSentenceContainer>
        J&apos;aimerais travailler {OCCUPATIONS_PREFIXES[0].label.toLowerCase()}{' '}
        <span>{careerPaths[0].businessSector.label.toLowerCase()}</span>
        {getOccupationIfExists(0)}
        {hasSecondPart && (
          <>
            {hasSameBusinessSector ? (
              <> ou {getOccupationIfExists(1)}</>
            ) : (
              <>
                {' '}
                ou {OCCUPATIONS_PREFIXES[0].label.toLowerCase()}{' '}
                <span>{careerPaths[1].businessSector.label.toLowerCase()}</span>
                {getOccupationIfExists(1)}
              </>
            )}
          </>
        )}
      </StyledCareerPathSentenceContainer>
    );
  }
  return null;
};
