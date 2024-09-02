import _ from 'lodash';
// import moment from 'moment';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import {
  CandidatCardContentStyled,
  CandidatCardPictureContainerStyled,
  CandidatCardPictureOverlay,
  CandidatCardStyled,
  CandidateCardBusinessLinesStyled,
} from 'src/components/cards/CandidatCard.styles';

import { Img, Tag } from 'src/components/utils';
import { AMBITIONS_PREFIXES, BUSINESS_LINES } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { findConstantFromValue, sortByOrder } from 'src/utils';

export const CandidatCard = ({
  url,
  imgSrc,
  firstName,
  ambitions,
  businessLines,
  locations,
}) => {
  const { asPath, push } = useRouter();

  const isCandidatsPage = asPath.includes('/candidats');

  const onCvClickEvent = isCandidatsPage
    ? GA_TAGS.PAGE_GALERIE_CV_CLIC
    : GA_TAGS.HOME_CV_CLIC;

  const showShareOptions = !asPath.includes('/entreprises');

  const linkToCV = `/cv/${url}?hideShareOptions=${!showShareOptions}`;

  const onCardClicked = () => {
    gaEvent(onCvClickEvent);
    push(linkToCV);
  };

  const sortedAmbitions =
    ambitions && ambitions.length > 0 ? sortByOrder(ambitions) : null;

  const sortedLocations =
    locations && locations.length > 0 ? sortByOrder(locations) : null;

  const sortedBusinessLines =
    businessLines && businessLines.length > 0
      ? sortByOrder(businessLines)
      : null;

  const isNewCareerPath = sortedBusinessLines?.every(({ order }) => {
    return order > -1;
  });

  return (
    <CandidatCardStyled>
      <CandidatCardPictureContainerStyled onClick={onCardClicked}>
        <Img src={imgSrc} alt={firstName} cover />
        <CandidatCardPictureOverlay>
          <p className="name">{firstName}</p>
          {sortedLocations?.length > 0 && <p>{sortedLocations[0].name}</p>}
        </CandidatCardPictureOverlay>
      </CandidatCardPictureContainerStyled>
      <CandidatCardContentStyled onClick={onCardClicked}>
        <h1>
          {sortedAmbitions?.length > 0
            ? sortedAmbitions[0].name
            : 'Ouvert à toutes les opportunités'}
        </h1>
        {sortedBusinessLines?.length > 0 && (
          <>
            <p>Je recherche un emploi dans :</p>
            <CandidateCardBusinessLinesStyled>
              {isNewCareerPath
                ? _.uniqWith(sortedBusinessLines.slice(0, 2), (a, b) => {
                    // @ts-expect-error after enable TS strict mode. Please, try to fix it
                    return a.name === b.name;
                    // @ts-expect-error after enable TS strict mode. Please, try to fix it
                  }).map(({ name }, index) => {
                    return (
                      <Tag
                        key={index}
                        size="small"
                        style="hoverBlue"
                        content={
                          findConstantFromValue(name, BUSINESS_LINES).label
                        }
                      />
                    );
                  })
                : sortedAmbitions?.slice(0, 2).map(({ name }, index) => {
                    return (
                      <Tag
                        key={index}
                        size="small"
                        style="hoverBlue"
                        content={name}
                      />
                    );
                  })}
            </CandidateCardBusinessLinesStyled>
          </>
        )}
      </CandidatCardContentStyled>
    </CandidatCardStyled>
  );
};
CandidatCard.propTypes = {
  url: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  ambitions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
      prefix: PropTypes.oneOf(
        AMBITIONS_PREFIXES.map(({ value }) => {
          return value;
        })
      ),
    })
  ).isRequired,
  businessLines: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
    })
  ).isRequired,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  imgSrc: PropTypes.string,
  // skills: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     name: PropTypes.string.isRequired,
  //   })
  // ).isRequired,
  // catchphrase: PropTypes.string,
  // employed: PropTypes.bool,
  // endOfContract: PropTypes.string,
};

CandidatCard.defaultProps = {
  imgSrc: '/static/img/arthur.jpg',
  // employed: false,
  // endOfContract: undefined,
  // catchphrase: "cherche un job pour s'en sortir",
};
