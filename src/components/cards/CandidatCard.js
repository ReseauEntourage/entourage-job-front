import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from 'react-share';
import { useRouter } from 'next/router';

import { Grid, Img, SimpleLink } from 'src/components/utils';
import ModalShareCV from 'src/components/modals/ModalShareCV';
import Api from 'src/Axios';
import { SharesCountContext } from 'src/components/store/SharesCountProvider';
import { gaEvent } from 'src/lib/gtag';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import moment from 'moment';
import { IconNoSSR } from 'src/components/utils/Icon';
import { openModal } from 'src/components/modals/Modal';
import { AMBITIONS_PREFIXES, BUSINESS_LINES } from 'src/constants';
import {
  buildBusinessLineForSentence,
  findConstantFromValue,
  sortByOrder,
} from 'src/utils';
import { fbEvent } from 'src/lib/fb';
import _ from 'lodash';

const CandidatCard = ({
  url,
  imgSrc,
  imgAlt,
  firstName,
  ambitions,
  businessLines,
  locations,
  skills,
  catchphrase,
  employed,
  endOfContract,
  id,
}) => {
  const router = useRouter();

  const isCandidatsPage = router.asPath.includes('/candidats');
  const isCompaniesCvsPage = router.asPath.includes('/entreprises/cvs');

  let onCvClickEvent = GA_TAGS.HOME_CV_CLIC;
  if (isCandidatsPage) {
    onCvClickEvent = GA_TAGS.PAGE_GALERIE_CV_CLIC;
  } else if (isCompaniesCvsPage) {
    onCvClickEvent = GA_TAGS.PAGE_ENTREPRISES_GALERIE_CV_CLIC;
  }

  const showShareOptions = !router.asPath.includes('/entreprises');

  const link = encodeURI(`${process.env.SERVER_URL}/cv/${url}`);
  const hashtags = ['LinkedOut'];
  const sharedDescription = `La précarité n'exclut pas les compétences\xa0! Avec LinkedOut, aidons ${firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`;
  const title = `LinkedOut\xa0: Aidez ${firstName} à retrouver un emploi`;

  const { incrementSharesCount } = useContext(SharesCountContext);

  const openNewsletterModal = () => {
    openModal(<ModalShareCV firstName={firstName} />);
  };

  const updateShareCount = (candidatId, type) => {
    Api.post('/cv/count', {
      candidatId,
      type,
    })
      .then(() => {
        incrementSharesCount();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const linkToCV = `/cv/${url}?hideShareOptions=${!showShareOptions}`;

  const sortedAmbitions =
    ambitions && ambitions.length > 0 ? sortByOrder(ambitions) : null;

  const sortedBusinessLines =
    businessLines && businessLines.length > 0
      ? sortByOrder(businessLines)
      : null;

  const isNewCareerPath = sortedBusinessLines?.every(({ order }) => {
    return order > -1;
  });

  return (
    <div className="uk-card uk-card-small uk-card-body uk-card-default uk-card-hover uk-text-small uk-text-left">
      {/* Contenue de la carte */}
      <SimpleLink
        href={linkToCV}
        className="uk-link-toggle"
        onClick={() => {
          gaEvent(onCvClickEvent);
        }}
      >
        <div
          className="uk-cover-container uk-margin-bottom"
          style={{
            height: 350,
          }}
        >
          {/* Image de fond */}
          <Img src={imgSrc} alt={imgAlt} cover />
          {/* Bandeau à retrouvé un emploie */}
          {employed && (
            <div
              style={{
                backgroundColor: endOfContract
                  ? 'rgba(72, 72, 72, 0.7)'
                  : 'rgba(245, 95, 36, .7)',
              }}
              className="uk-width-1-1 uk-position-bottom uk-flex uk-flex-middle uk-flex-right" // uk-position-cover
            >
              <div className="uk-width-1-2 uk-padding-small uk-text-center">
                <Img src="/static/img/logo-white.png" alt="logo entourage" />
                <p
                  className="uk-text-uppercase"
                  style={{ color: '#FFF', margin: '8px 0 0 0' }}
                >
                  {endOfContract
                    ? `en emploi jusqu'au ${moment(endOfContract).format(
                        'DD/MM/YYYY'
                      )}`
                    : 'a retrouvé un emploi'}
                </p>
              </div>
            </div>
          )}
          {/* Informations du candidat */}
          <div
            style={{
              borderRadius: '0px 2px 2px 0px',
              background: 'white', // 'linear-gradient(90deg, white 50%, transparent 200%)',
              padding: '10px 10px 10px 0px',
            }}
            // ent-gradiant-default
            className="uk-width-1-2 uk-position-center-left"
          >
            {/*  uk-margin-small-bottom uk-margin-small-top uk-margin-small-right */}
            <Grid
              gap="collapse"
              between
              column
              childWidths={['1-1']}
              style={{
                minHeight: 240,
              }}
              className="uk-height-1-1"
            >
              <div
                style={{
                  marginBottom: 0,
                }}
              >
                <h5 className="uk-margin-remove uk-text-uppercase uk-text-bold ent-line-clamp-1">
                  {firstName}
                </h5>
                <p
                  style={{
                    fontSize: '0.775rem',
                    marginTop: '5px !important',
                  }}
                  className="uk-text-small ent-line-clamp-3 uk-margin-remove"
                >
                  {catchphrase || "Cherche un job pour s'en sortir"}
                </p>
              </div>
              {skills && skills.length > 0 && (
                <Grid
                  column
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                  }}
                  gap="collapse"
                  childWidths={['1-1']}
                  className="uk-text-lowercase uk-text-bold uk-text-primary "
                  items={skills.slice(0, 2).map((a, index) => {
                    return (
                      <span key={index} className="ent-line-clamp-1">
                        {a}
                      </span>
                    );
                  })}
                />
              )}
              {(sortedAmbitions || sortedBusinessLines) && (
                <div
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                  }}
                >
                  <p
                    style={{ fontSize: '0.775rem' }}
                    className="uk-margin-remove uk-margin-small-top"
                  >
                    Je souhaite
                    <br />
                    travailler{' '}
                    {!isNewCareerPath &&
                    sortedAmbitions &&
                    sortedAmbitions[0].prefix
                      ? sortedAmbitions[0].prefix
                      : AMBITIONS_PREFIXES[0].label}
                    &nbsp;:
                  </p>
                  <Grid column gap="collapse" childWidths={['1-1']}>
                    {isNewCareerPath
                      ? _.uniqWith(sortedBusinessLines.slice(0, 2), (a, b) => {
                          return a.name === b.name;
                        }).map(({ name }, index) => {
                          return (
                            <span
                              key={index}
                              className="uk-label uk-text-lowercase ent-card-ambition"
                            >
                              {buildBusinessLineForSentence(
                                findConstantFromValue(name, BUSINESS_LINES)
                              )}
                            </span>
                          );
                        })
                      : sortedAmbitions?.slice(0, 2).map(({ name }, index) => {
                          return (
                            <span
                              key={index}
                              className="uk-label uk-text-lowercase ent-card-ambition"
                            >
                              {name}
                            </span>
                          );
                        })}
                  </Grid>
                </div>
              )}
              {locations && locations.length > 0 && (
                <Grid
                  column
                  gap="collapse"
                  childWidths={['1-1']}
                  style={{ marginTop: 10 }}
                >
                  {locations.slice(0, 2).map((text, index) => {
                    return (
                      <div
                        key={text + index}
                        className="uk-flex uk-flex-middle"
                      >
                        <IconNoSSR name="location" ratio={0.6} />
                        &nbsp;
                        <span
                          className="uk-text-meta uk-flex-1"
                          style={{
                            fontSize: '0.775rem',
                          }}
                        >
                          {text}
                        </span>
                      </div>
                    );
                  })}
                </Grid>
              )}
            </Grid>
          </div>
        </div>
      </SimpleLink>
      {/* Bas de carte */}
      {showShareOptions ? (
        <Grid gap="small" between middle eachWidths={['expand', 'auto']}>
          <SimpleLink
            href={linkToCV}
            className="uk-link-toggle"
            onClick={() => {
              gaEvent(onCvClickEvent);
            }}
          >
            <u className="uk-text-link uk-text-primary">Voir le CV</u>
          </SimpleLink>
          <Grid middle center gap="small">
            <span>Partager :</span>
            <ul className="uk-iconnav">
              <li>
                <LinkedinShareButton
                  onShareWindowClose={() => {
                    gaEvent(
                      isCandidatsPage
                        ? GA_TAGS.PAGE_GALERIE_PARTAGE_CV_LINKEDIN_CLIC
                        : GA_TAGS.HOME_PARTAGE_CV_LINKEDIN_CLIC
                    );
                    fbEvent(FB_TAGS.SHARE_CV);
                    updateShareCount(id, 'linkedin');
                    openNewsletterModal();
                  }}
                  url={link}
                  title={title}
                  summary={sharedDescription}
                  style={{ cursor: 'pointer' }}
                  className="uk-icon-button light-icon-button"
                >
                  <IconNoSSR
                    name="linkedin"
                    ratio={0.9}
                    className={`share-linkedin-${firstName}`}
                  />
                </LinkedinShareButton>
              </li>
              <li>
                <FacebookShareButton
                  onShareWindowClose={() => {
                    gaEvent(
                      isCandidatsPage
                        ? GA_TAGS.PAGE_GALERIE_PARTAGE_CV_FACEBOOK_CLIC
                        : GA_TAGS.HOME_PARTAGE_CV_FACEBOOK_CLIC
                    );
                    fbEvent(FB_TAGS.SHARE_CV);
                    updateShareCount(id, 'facebook');
                    openNewsletterModal();
                  }}
                  url={link}
                  quote={sharedDescription}
                  hashtags={hashtags}
                  style={{ cursor: 'pointer' }}
                  className="uk-icon-button light-icon-button"
                >
                  <IconNoSSR
                    name="facebook"
                    ratio={0.9}
                    className={`share-facebook-${firstName}`}
                  />
                </FacebookShareButton>
              </li>
              <li>
                <TwitterShareButton
                  onShareWindowClose={() => {
                    gaEvent(
                      isCandidatsPage
                        ? GA_TAGS.PAGE_GALERIE_PARTAGE_CV_TWITTER_CLIC
                        : GA_TAGS.HOME_PARTAGE_CV_TWITTER_CLIC
                    );
                    fbEvent(FB_TAGS.SHARE_CV);

                    updateShareCount(id, 'twitter');
                    openNewsletterModal();
                  }}
                  url={link}
                  title={title}
                  hashtags={hashtags}
                  via="R_Entourage"
                  style={{ cursor: 'pointer' }}
                  className="uk-icon-button light-icon-button"
                >
                  <IconNoSSR
                    name="twitter"
                    ratio={0.9}
                    className={`share-twitter-${firstName}`}
                  />
                </TwitterShareButton>
              </li>
            </ul>
          </Grid>
        </Grid>
      ) : (
        <div className="uk-text-center">
          <SimpleLink
            href={linkToCV}
            className="uk-link-toggle uk-text-center"
            onClick={() => {
              gaEvent(onCvClickEvent);
            }}
          >
            <u className="uk-text-link uk-text-primary">Voir le CV</u>
          </SimpleLink>
        </div>
      )}
    </div>
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
  locations: PropTypes.arrayOf(PropTypes.string).isRequired,
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string.isRequired,
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
  catchphrase: PropTypes.string,
  employed: PropTypes.bool,
  endOfContract: PropTypes.string,
  id: PropTypes.string.isRequired,
};

CandidatCard.defaultProps = {
  imgSrc: 'static/img/arthur.jpg',
  employed: false,
  endOfContract: undefined,
  catchphrase: "cherche un job pour s'en sortir",
};
export default CandidatCard;
