import _ from 'lodash';
// import moment from 'moment';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from 'react-share';

import FacebookIcon from 'assets/icons/facebook.svg';
import LinkedInIcon from 'assets/icons/linked-in.svg';
import TwitterIcon from 'assets/icons/twitter.svg';
import {
  CandidatCardContentStyled,
  CandidatCardFooterStyled,
  CandidatCardPictureContainerStyled,
  CandidatCardPictureOverlay,
  CandidatCardSharerStyled,
  CandidatCardStyled,
  CandidateCardBusinessLinesStyled,
} from 'src/components/cards/CandidatCard.styles';

import { updateSharesCount } from 'src/components/cv/updateSharesCount';
import { openModal } from 'src/components/modals/Modal';
import { ModalShareCV } from 'src/components/modals/Modal/ModalGeneric/StepperModal/ModalShareCV';
import { Img, SimpleLink, Tag } from 'src/components/utils';
import { AMBITIONS_PREFIXES, BUSINESS_LINES } from 'src/constants';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import {
  buildBusinessLineForSentence,
  findConstantFromValue,
  sortByOrder,
} from 'src/utils';

export const CandidatCard = ({
  url,
  imgSrc,
  firstName,
  ambitions,
  businessLines,
  locations,
  // skills,
  // catchphrase,
  // employed,
  // endOfContract,
  id,
}) => {
  const { asPath, push } = useRouter();

  const isCandidatsPage = asPath.includes('/candidats');

  const onCvClickEvent = isCandidatsPage
    ? GA_TAGS.PAGE_GALERIE_CV_CLIC
    : GA_TAGS.HOME_CV_CLIC;

  const showShareOptions = !asPath.includes('/entreprises');

  const link = encodeURI(`${process.env.SERVER_URL}/cv/${url}`);
  const hashtags = ['Entourage Pro'];
  const sharedDescription = `La précarité n'exclut pas les compétences\xa0! Avec Entourage Pro, aidons ${firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`;
  const title = `Entourage Pro\xa0: Aidez ${firstName} à retrouver un emploi`;
  const linkToCV = `/cv/${url}?hideShareOptions=${!showShareOptions}`;

  const openNewsletterModal = () => {
    openModal(<ModalShareCV firstName={firstName} />);
  };

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
          <p>{sortedLocations?.length > 0 ? sortedLocations[0].name : ''}</p>
        </CandidatCardPictureOverlay>
      </CandidatCardPictureContainerStyled>
      <CandidatCardContentStyled onClick={onCardClicked}>
        <h1>{sortedAmbitions[0].name}</h1>
        <p>Je recherche un emploi dans</p>
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
                    size="default"
                    style="hoverBlue"
                    content={buildBusinessLineForSentence(
                      findConstantFromValue(name, BUSINESS_LINES)
                    )}
                  />
                );
              })
            : sortedAmbitions?.slice(0, 2).map(({ name }, index) => {
                return (
                  <Tag
                    key={index}
                    size="default"
                    style="hoverBlue"
                    content={name}
                  />
                );
              })}
        </CandidateCardBusinessLinesStyled>
      </CandidatCardContentStyled>
      <CandidatCardFooterStyled>
        <SimpleLink
          className="uk-link-toggle"
          href={linkToCV}
          onClick={() => {
            gaEvent(onCvClickEvent);
          }}
        >
          Voir le CV
        </SimpleLink>
        <CandidatCardSharerStyled>
          <span>Partager</span>
          <ul className="uk-iconnav">
            <li>
              <LinkedinShareButton
                onShareWindowClose={async () => {
                  gaEvent(
                    isCandidatsPage
                      ? GA_TAGS.PAGE_GALERIE_PARTAGE_CV_LINKEDIN_CLIC
                      : GA_TAGS.HOME_PARTAGE_CV_LINKEDIN_CLIC
                  );
                  fbEvent(FB_TAGS.SHARE_CV_SEND);
                  await updateSharesCount(id, 'linkedin');
                  openNewsletterModal();
                }}
                onClick={() => {
                  fbEvent(FB_TAGS.SHARE_CV_OPEN);
                }}
                url={link}
                title={title}
                summary={sharedDescription}
                style={{ cursor: 'pointer' }}
                className="uk-icon-button light-icon-button"
              >
                <LinkedInIcon
                  className={`share-linkedin-${firstName}`}
                  width={20}
                  height={20}
                />
              </LinkedinShareButton>
            </li>
            <li>
              <FacebookShareButton
                onShareWindowClose={async () => {
                  gaEvent(
                    isCandidatsPage
                      ? GA_TAGS.PAGE_GALERIE_PARTAGE_CV_FACEBOOK_CLIC
                      : GA_TAGS.HOME_PARTAGE_CV_FACEBOOK_CLIC
                  );
                  fbEvent(FB_TAGS.SHARE_CV_SEND);
                  await updateSharesCount(id, 'facebook');
                  openNewsletterModal();
                }}
                onClick={() => {
                  fbEvent(FB_TAGS.SHARE_CV_OPEN);
                }}
                url={link}
                quote={sharedDescription}
                hashtags={hashtags}
                style={{ cursor: 'pointer' }}
                className="uk-icon-button light-icon-button"
              >
                <FacebookIcon
                  className={`share-facebook-${firstName}`}
                  width={20}
                  height={20}
                />
              </FacebookShareButton>
            </li>
            <li>
              <TwitterShareButton
                onShareWindowClose={async () => {
                  gaEvent(
                    isCandidatsPage
                      ? GA_TAGS.PAGE_GALERIE_PARTAGE_CV_TWITTER_CLIC
                      : GA_TAGS.HOME_PARTAGE_CV_TWITTER_CLIC
                  );
                  fbEvent(FB_TAGS.SHARE_CV_SEND);
                  await updateSharesCount(id, 'twitter');
                  openNewsletterModal();
                }}
                onClick={() => {
                  fbEvent(FB_TAGS.SHARE_CV_OPEN);
                }}
                url={link}
                title={title}
                hashtags={hashtags}
                via="R_Entourage"
                style={{ cursor: 'pointer' }}
                className="uk-icon-button light-icon-button"
              >
                <TwitterIcon
                  className={`share-twitter-${firstName}`}
                  width={20}
                  height={20}
                />
              </TwitterShareButton>
            </li>
          </ul>
        </CandidatCardSharerStyled>
      </CandidatCardFooterStyled>
    </CandidatCardStyled>
  );

  // TODO : Determine if we need to display the employed status
  // {employed && (
  //   <div
  //     style={{
  //       backgroundColor: endOfContract
  //         ? 'rgba(72, 72, 72, 0.7)'
  //         : 'rgba(245, 95, 36, .7)',
  //     }}
  //     className="uk-width-1-1 uk-position-bottom uk-flex uk-flex-middle uk-flex-right" // uk-position-cover
  //   >
  //     <div className="uk-width-1-2 uk-padding-small uk-text-center">
  //       <Img
  //         width={17}
  //         height={25}
  //         src="/static/img/logo-white.png"
  //         alt="logo entourage"
  //       />
  //       <p
  //         className="uk-text-uppercase"
  //         style={{ color: '#FFF', margin: '8px 0 0 0' }}
  //       >
  //         {endOfContract
  //           ? `en emploi jusqu'au ${moment(endOfContract).format(
  //               'DD/MM/YYYY'
  //             )}`
  //           : 'a retrouvé un emploi'}
  //       </p>
  //     </div>
  //   </div>
  // )}
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
  id: PropTypes.string.isRequired,
};

CandidatCard.defaultProps = {
  imgSrc: '/static/img/arthur.jpg',
  // employed: false,
  // endOfContract: undefined,
  // catchphrase: "cherche un job pour s'en sortir",
};
