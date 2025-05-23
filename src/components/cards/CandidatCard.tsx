import _ from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';
import DefaultProfilePic from 'public/static/img/arthur.jpg';
import {
  CandidatCardContentStyled,
  CandidatCardPictureContainerStyled,
  CandidatCardPictureOverlay,
  CandidatCardStyled,
  CandidateCardBusinessLinesStyled,
} from 'src/components/cards/CandidatCard.styles';

import { Img, Tag } from 'src/components/utils';
import { AmbitionsPrefixesType, BUSINESS_LINES } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { findConstantFromValue, sortByOrder } from 'src/utils';

interface CandidatCardProps {
  url: string;
  imgSrc: string;
  firstName: string;
  ambitions: {
    name: string;
    order: number;
    prefix: AmbitionsPrefixesType;
  }[];
  businessLines: {
    name: string;
    order: number;
  }[];
  locations: {
    name: string;
    order: number;
  }[];
}

export const CandidatCard = ({
  url,
  imgSrc = '/static/img/arthur.jpg',
  firstName,
  ambitions,
  businessLines,
  locations,
}: CandidatCardProps) => {
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
        <Img src={imgSrc || DefaultProfilePic} alt={firstName} cover />
        <CandidatCardPictureOverlay>
          <p className="name">{firstName}</p>
          {sortedLocations && sortedLocations.length > 0 && (
            <p>{sortedLocations[0].name}</p>
          )}
        </CandidatCardPictureOverlay>
      </CandidatCardPictureContainerStyled>
      <CandidatCardContentStyled onClick={onCardClicked}>
        <h1>
          {sortedAmbitions && sortedAmbitions.length > 0
            ? sortedAmbitions[0].name
            : "A l'écoute de toutes les opportunités"}
        </h1>
        {sortedBusinessLines && sortedBusinessLines.length > 0 && (
          <>
            <p>Je recherche un emploi dans :</p>
            <CandidateCardBusinessLinesStyled>
              {isNewCareerPath
                ? _.uniqWith(sortedBusinessLines.slice(0, 2), (a, b) => {
                    return a.name === b.name;
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
