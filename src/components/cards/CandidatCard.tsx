import _ from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';
import { BusinessSector, Occupation } from '@/src/api/types';
import DefaultProfilePic from 'public/static/img/arthur.jpg';
import {
  CandidatCardContentStyled,
  CandidatCardPictureContainerStyled,
  CandidatCardPictureOverlay,
  CandidatCardStyled,
  CandidateCardBusinessSectorsStyled,
} from 'src/components/cards/CandidatCard.styles';

import { Img, Tag } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { sortByOrder } from 'src/utils';

interface CandidatCardProps {
  url: string;
  imgSrc?: string;
  firstName: string;
  businessSectors: BusinessSector[];
  occupations: Occupation[];
  locations: {
    name: string;
    order: number;
  }[];
}

export const CandidatCard = ({
  url,
  imgSrc = '/static/img/arthur.jpg',
  firstName,
  occupations,
  businessSectors,
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

  const sortedOccupations = occupations;

  const sortedLocations =
    locations && locations.length > 0 ? sortByOrder(locations) : null;

  const sortedBusinessSectors = businessSectors;

  const isNewCareerPath = true;

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
                    return a.value === b.value;
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
