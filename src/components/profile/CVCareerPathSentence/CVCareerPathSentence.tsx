import React from 'react';
import { BusinessSector, Occupation } from 'src/api/types';
import { Text } from 'src/components/utils';
import { OCCUPATIONS_PREFIXES, BUSINESS_SECTORS } from 'src/constants';
import {
  buildBusinessSectorForSentence,
  findConstantFromValue,
  getOccupationsLinkingSentence,
  sortByOrder,
} from 'src/utils';
import {
  StyledCareerPathHightlightBusinessSector,
  StyledCareerPathHightlightOccupation,
} from './CVCareerPathSentence.styles';

interface CVCareerPathSentenceProps {
  occupations: Occupation[];
  businessSectors: BusinessSector[];
}

export const CVCareerPathSentence = ({
  businessSectors,
  occupations,
}: CVCareerPathSentenceProps) => {
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
          {sortedOccupations[0].prefix || OCCUPATIONS_PREFIXES[0].label}{' '}
          <span
            className="uk-label uk-text-lowercase"
            style={{
              lineHeight: 'unset',
              verticalAlign: 'bottom',
              fontSize: 'inherit',
            }}
          >
            {sortedOccupations[0].name}
          </span>
          {sortedOccupations.length > 1 && (
            <>
              {getOccupationsLinkingSentence(sortedOccupations)}
              <StyledCareerPathHightlightOccupation>
                {sortedOccupations[1].name}
              </StyledCareerPathHightlightOccupation>
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
            {OCCUPATIONS_PREFIXES[1].label}{' '}
            <StyledCareerPathHightlightOccupation>
              {careerPaths[index].occupation}
            </StyledCareerPathHightlightOccupation>
          </>
        );
      }
      return null;
    };

    const hasSecondPart = careerPaths[1] && careerPaths[1].businessSector;

    const hasSameBusinessSector =
      hasSecondPart &&
      careerPaths[1].businessSector.value ===
        careerPaths[0].businessSector.value &&
      careerPaths[1].occupation;

    return (
      <Text>
        J&apos;aimerais travailler {OCCUPATIONS_PREFIXES[0].label}{' '}
        <StyledCareerPathHightlightBusinessSector>
          {careerPaths[0].businessSector.label}
        </StyledCareerPathHightlightBusinessSector>
        {getOccupationIfExists(0)}
        {hasSecondPart && (
          <>
            {hasSameBusinessSector ? (
              <> ou {getOccupationIfExists(1)}</>
            ) : (
              <>
                {' '}
                ou {OCCUPATIONS_PREFIXES[0].label}{' '}
                <StyledCareerPathHightlightBusinessSector>
                  {careerPaths[1].businessSector.label}
                </StyledCareerPathHightlightBusinessSector>
                {getOccupationIfExists(1)}
              </>
            )}
          </>
        )}
      </Text>
    );
  }
  return null;
};
