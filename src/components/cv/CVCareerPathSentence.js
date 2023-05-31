import React from 'react';
import {
  buildBusinessLineForSentence,
  findConstantFromValue,
  getAmbitionsLinkingSentence,
  sortByOrder,
} from 'src/utils';
import { AMBITIONS_PREFIXES, BUSINESS_LINES } from 'src/constants/index.ts';
import PropTypes from 'prop-types';

export const CVCareerPathSentence = ({ businessLines, ambitions }) => {
  const sortedAmbitions =
    ambitions && ambitions.length > 0 ? sortByOrder(ambitions) : null;

  const sortedBusinessLines =
    businessLines && businessLines.length > 0
      ? sortByOrder(businessLines)
      : null;

  const isNewCareerPath = sortedBusinessLines?.every(({ order }) => {
    return order > -1;
  });

  if (!isNewCareerPath) {
    if (sortedAmbitions) {
      return (
        <>
          J&apos;aimerais travailler{' '}
          {sortedAmbitions[0].prefix || AMBITIONS_PREFIXES[0].label}{' '}
          <span
            className="uk-label uk-text-lowercase"
            style={{
              lineHeight: 'unset',
              verticalAlign: 'bottom',
              fontSize: 'inherit',
            }}
          >
            {sortedAmbitions[0].name || sortedAmbitions[0]}
          </span>
          {sortedAmbitions.length > 1 && (
            <>
              {getAmbitionsLinkingSentence(sortedAmbitions)}
              <span
                className="uk-label uk-text-lowercase"
                style={{
                  lineHeight: 'unset',
                  verticalAlign: 'bottom',
                  fontSize: 'inherit',
                }}
              >
                {sortedAmbitions[1].name || sortedAmbitions[1]}
              </span>
            </>
          )}
        </>
      );
    }
    return null;
  }

  if (sortedBusinessLines) {
    const careerPaths = sortedBusinessLines.reduce((acc, curr) => {
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
    }, []);

    const getAmbitionIfExists = (index) => {
      if (careerPaths[index].ambition) {
        return (
          <>
            {' '}
            {AMBITIONS_PREFIXES[1].label}{' '}
            <span
              className="uk-text-primary uk-text-bold uk-text-lowercase"
              style={{
                lineHeight: 'unset',
                verticalAlign: 'bottom',
                fontSize: 'inherit',
              }}
            >
              {careerPaths[index].ambition}
            </span>
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
        J&apos;aimerais travailler {AMBITIONS_PREFIXES[0].label}{' '}
        <span
          className="uk-label uk-text-lowercase"
          style={{
            lineHeight: 'unset',
            verticalAlign: 'bottom',
            fontSize: 'inherit',
          }}
        >
          {careerPaths[0].businessLine.label}
        </span>
        {getAmbitionIfExists(0)}
        {hasSecondPart && (
          <>
            {hasSameBusinessLine ? (
              <> ou {getAmbitionIfExists(1)}</>
            ) : (
              <>
                {' '}
                ou {AMBITIONS_PREFIXES[0].label}{' '}
                <span
                  className="uk-label uk-text-lowercase"
                  style={{
                    lineHeight: 'unset',
                    verticalAlign: 'bottom',
                    fontSize: 'inherit',
                  }}
                >
                  {careerPaths[1].businessLine.label}
                </span>
                {getAmbitionIfExists(1)}
              </>
            )}
          </>
        )}
      </>
    );
  }
  return null;
};

CVCareerPathSentence.propTypes = {
  ambitions: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        order: PropTypes.number.isRequired,
        prefix: PropTypes.oneOf(
          AMBITIONS_PREFIXES.map(({ value }) => {
            return value;
          })
        ),
      })
    ),
    PropTypes.string,
  ]).isRequired,
  businessLines: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        order: PropTypes.number.isRequired,
      })
    ),
    PropTypes.string,
  ]).isRequired,
};
