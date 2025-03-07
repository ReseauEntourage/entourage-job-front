import React from 'react';
import {
  AMBITIONS_PREFIXES,
  BUSINESS_LINES,
  AmbitionsPrefixesType,
} from 'src/constants';
import {
  buildBusinessLineForSentence,
  findConstantFromValue,
  getAmbitionsLinkingSentence,
  sortByOrder,
} from 'src/utils';
import { StyledCareerPathSentenceContainer } from './CVCareerPathSentence.styles';

interface CVCareerPathSentenceNewProps {
  ambitions: {
    name: string;
    order: number;
    prefix: AmbitionsPrefixesType;
  }[];
  businessLines: {
    name: string;
    order: number;
  }[];
}

export const CVCareerPathSentenceNew = ({
  businessLines,
  ambitions,
}: CVCareerPathSentenceNewProps) => {
  const sortedAmbitions = ambitions?.length > 0 ? sortByOrder(ambitions) : null;

  const sortedBusinessLines =
    businessLines?.length > 0 ? sortByOrder(businessLines) : null;

  const isNewCareerPath = sortedBusinessLines?.every(({ order }) => {
    return order > -1;
  });

  if (!isNewCareerPath) {
    if (sortedAmbitions) {
      return (
        <>
          J&apos;aimerais travailler{' '}
          {sortedAmbitions[0].prefix ||
            AMBITIONS_PREFIXES[0].label.toLowerCase()}{' '}
          <span className="orange">{sortedAmbitions[0].name}</span>
          {sortedAmbitions.length > 1 && (
            <>
              {getAmbitionsLinkingSentence(sortedAmbitions)}
              <span className="orange">{sortedAmbitions[1].name}</span>
            </>
          )}
        </>
      );
    }
    return null;
  }

  if (sortedBusinessLines) {
    const careerPaths = sortedBusinessLines.reduce(
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      (acc, curr) => {
        const correspondingAmbition = sortedAmbitions?.find(({ order }) => {
          return order === curr.order;
        });
        return [
          ...acc,
          {
            order: curr.order,
            ambition: correspondingAmbition?.name,
            businessLine: {
              ...findConstantFromValue(curr.name, BUSINESS_LINES),
              label: buildBusinessLineForSentence(
                findConstantFromValue(curr.name, BUSINESS_LINES)
              ),
            },
          },
        ];
      },
      []
    );

    const getAmbitionIfExists = (index) => {
      if (careerPaths[index].ambition) {
        return (
          <>
            {' '}
            {AMBITIONS_PREFIXES[1].label.toLowerCase()}{' '}
            <span className="orange">{careerPaths[index].ambition}</span>
          </>
        );
      }
      return null;
    };

    const hasSecondPart = careerPaths[1] && careerPaths[1].businessLine;

    const hasSameBusinessLine =
      hasSecondPart &&
      careerPaths[1].businessLine.value === careerPaths[0].businessLine.value &&
      careerPaths[1].ambition;

    return (
      <StyledCareerPathSentenceContainer>
        J&apos;aimerais travailler {AMBITIONS_PREFIXES[0].label.toLowerCase()}{' '}
        <span>{careerPaths[0].businessLine.label.toLowerCase()}</span>
        {getAmbitionIfExists(0)}
        {hasSecondPart && (
          <>
            {hasSameBusinessLine ? (
              <> ou {getAmbitionIfExists(1)}</>
            ) : (
              <>
                {' '}
                ou {AMBITIONS_PREFIXES[0].label.toLowerCase()}{' '}
                <span>{careerPaths[1].businessLine.label.toLowerCase()}</span>
                {getAmbitionIfExists(1)}
              </>
            )}
          </>
        )}
      </StyledCareerPathSentenceContainer>
    );
  }
  return null;
};
