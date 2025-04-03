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
  CandidateCardBusinessSectorsStyled,
} from 'src/components/cards/CandidatCard.styles';

import { Img, Tag } from 'src/components/utils';
import { OCCUPATIONS_PREFIXES } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { sortByOrder } from 'src/utils';

export const CandidatCard = ({
  url,
  imgSrc,
  firstName,
  occupations,
  businessSectors,
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

  const sortedOccupations =
    occupations && occupations.length > 0 ? sortByOrder(occupations) : null;

  const sortedLocations =
    locations && locations.length > 0 ? sortByOrder(locations) : null;

  const sortedBusinessSectors =
    businessSectors && businessSectors.length > 0
      ? sortByOrder(businessSectors)
      : null;

  const isNewCareerPath = sortedBusinessSectors?.every(({ order }) => {
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
          {sortedOccupations?.length > 0
            ? sortedOccupations[0].name
            : "A l'écoute de toutes les opportunités"}
        </h1>
        {sortedBusinessSectors?.length > 0 && (
          <>
            <p>Je recherche un emploi dans :</p>
            <CandidateCardBusinessSectorsStyled>
              {isNewCareerPath
                ? _.uniqWith(sortedBusinessSectors.slice(0, 2), (a, b) => {
                    // @ts-expect-error after enable TS strict mode. Please, try to fix it
                    return a.value === b.value;
                    // @ts-expect-error after enable TS strict mode. Please, try to fix it
                  }).map(({ name }, index) => {
                    return (
                      <Tag
                        key={index}
                        size="small"
                        style="hoverBlue"
                        content={name}
                      />
                    );
                  })
                : sortedOccupations?.slice(0, 2).map(({ name }, index) => {
                    return (
                      <Tag
                        key={index}
                        size="small"
                        style="hoverBlue"
                        content={name}
                      />
                    );
                  })}
            </CandidateCardBusinessSectorsStyled>
          </>
        )}
      </CandidatCardContentStyled>
    </CandidatCardStyled>
  );
};
CandidatCard.propTypes = {
  url: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  occupations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
      prefix: PropTypes.oneOf(
        OCCUPATIONS_PREFIXES.map(({ value }) => {
          return value;
        })
      ),
    })
  ).isRequired,
  businessSectors: PropTypes.arrayOf(
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
