import React from 'react';
import { Tag } from 'src/components/utils/Tag';
import {
  AMBITIONS_PREFIXES,
  BUSINESS_LINES,
  AmbitionsPrefixesType,
  BusinessLineValue,
} from 'src/constants';
import {
  buildBusinessLineForSentence,
  findConstantFromValue,
  sortByOrder,
} from 'src/utils';
import { StyledProfileCareerPathLi } from './ProfileCareerPathSentence.styles';

interface CareerPath {
  order: number;
  ambition: string | undefined;
  businessLine: {
    label: string;
    value: BusinessLineValue;
    prefix: string | string[];
  };
}

type Ambition = {
  name: string;
  order: number;
  prefix: AmbitionsPrefixesType;
};

type BusinessLine = {
  name: string;
  order: number;
};

interface ProfileCareerPathSentenceProps {
  ambitions: Ambition[];
  businessLines: BusinessLine[];
}

export const ProfileCareerPathSentence = ({
  businessLines,
  ambitions,
}: ProfileCareerPathSentenceProps) => {
  const sortedAmbitions = ambitions?.length > 0 ? sortByOrder(ambitions) : null;

  const sortedBusinessLines =
    businessLines?.length > 0 ? sortByOrder(businessLines) : null;

  if (sortedBusinessLines) {
    const careerPaths = sortedBusinessLines.reduce<CareerPath[]>(
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
            {AMBITIONS_PREFIXES[1].label}{' '}
            <strong>{careerPaths[index].ambition}</strong>
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
      <>
        <StyledProfileCareerPathLi>
          J&apos;aimerais travailler {AMBITIONS_PREFIXES[0].label}{' '}
          <Tag content={careerPaths[0].businessLine.label} noMargin />
          {getAmbitionIfExists(0)}
          {hasSecondPart && hasSameBusinessLine && (
            <> et {getAmbitionIfExists(1)}</>
          )}
        </StyledProfileCareerPathLi>
        {hasSecondPart && !hasSameBusinessLine && (
          <StyledProfileCareerPathLi>
            {' '}
            J&lsquo;aimerais travailler {AMBITIONS_PREFIXES[0].label}{' '}
            <Tag noMargin content={careerPaths[1].businessLine.label} />
            {getAmbitionIfExists(1)}
          </StyledProfileCareerPathLi>
        )}
      </>
    );
  }
  return null;
};
