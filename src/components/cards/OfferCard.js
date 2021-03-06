import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Grid } from 'src/components/utils';
import { findOfferStatus } from 'src/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import { OFFER_STATUS } from 'src/constants';

const OfferCard = ({
  title,
  from,
  shortDescription,
  bookmarked,
  isNew,
  isExternal,
  archived,
  recommended,
  isPublic,
  date,
  userOpportunity,
  isValidated,
  isAdmin,
  department,
  isSelected,
}) => {
  const renderStatus = (userOpp, isOppPublic) => {
    if (userOpp.status !== undefined) {
      const offerStatus = findOfferStatus(
        userOpp.status,
        isOppPublic,
        userOpp.recommended
      );
      return (
        <span className={`uk-text-meta uk-text-${offerStatus.color}`}>
          {offerStatus.label}
        </span>
      );
    }
    return null;
  };

  const userOpportunitiesWithoutDefaultStatus = Array.isArray(userOpportunity)
    ? userOpportunity.filter((userOpp) => {
        return userOpp.status !== OFFER_STATUS[0].value || userOpp.recommended;
      })
    : null;

  const specificUserOpportunity =
    userOpportunity && !Array.isArray(userOpportunity) ? userOpportunity : null;

  const shouldShowRecommandationBadge =
    isPublic && (specificUserOpportunity?.recommended || recommended);

  const background = archived ? 'secondary' : 'default';

  return (
    <div
      className={`ent-offer${
        isSelected ? '-selected' : ''
      } uk-card uk-card-hover uk-card-body ${
        isExternal && !archived ? 'ent-external-offer' : ''
      } uk-card-${background}`}
    >
      {(isNew || shouldShowRecommandationBadge) && (
        <div
          className={
            isNew ? 'ent-offer-badge' : 'ent-offer-badge-recommandation'
          }
        >
          {shouldShowRecommandationBadge ? (
            <>
              R e c o&nbsp;
              <IconNoSSR name="bolt" ratio={0.5} className="ent-color-amber" />
            </>
          ) : (
            ''
          )}
        </div>
      )}
      <Grid
        gap="medium"
        childWidths={['1-1']}
        className="uk-height-max-large uk-overflow-auto"
      >
        <div className="uk-flex">
          <h5 className="uk-flex-1 uk-text-bold">{title}</h5>
          <div className="uk-flex uk-flex-right uk-flex-top">
            {' '}
            {(specificUserOpportunity?.bookmarked || bookmarked) && (
              <IconNoSSR
                name="star"
                className="ent-color-amber uk-margin-small-left"
                ratio={0.8}
              />
            )}
            {(specificUserOpportunity?.archived || (!isAdmin && archived)) && (
              <IconNoSSR
                name="archive"
                className="ent-color-amber uk-margin-small-left"
                ratio={0.8}
              />
            )}
          </div>
        </div>
        <Grid gap="small" middle eachWidths={['auto', 'expand']}>
          <IconNoSSR name="world" />
          <p>{shortDescription}</p>
        </Grid>
        {department && (
          <Grid gap="small" middle eachWidths={['auto', 'expand']}>
            <IconNoSSR name="location" />
            <p>{department}</p>
          </Grid>
        )}
        {isAdmin && from && (
          <Grid gap="small" middle eachWidths={['auto', 'expand']}>
            <IconNoSSR name="user" />
            <p>{from}</p>
          </Grid>
        )}

        <Grid gap="small" middle eachWidths={['auto', 'expand']}>
          <IconNoSSR name="info" />
          <div>
            {isPublic ? (
              <div>
                <p className="uk-margin-remove-bottom">Offre g??n??rale</p>
                {userOpportunity &&
                  (Array.isArray(userOpportunity)
                    ? userOpportunitiesWithoutDefaultStatus.length > 0 &&
                      isAdmin && (
                        <span className="uk-text-meta">
                          {userOpportunitiesWithoutDefaultStatus.length}
                          &nbsp;candidat
                          {userOpportunitiesWithoutDefaultStatus.length !== 1
                            ? 's'
                            : ''}{' '}
                          sur l&apos;offre
                        </span>
                      )
                    : renderStatus(userOpportunity, isPublic))}
              </div>
            ) : (
              <div>
                <p className="uk-margin-remove-bottom">
                  {isExternal ? 'Offre externe' : 'Offre priv??e'}
                </p>
                {userOpportunity &&
                  (Array.isArray(userOpportunity)
                    ? userOpportunity.length > 0 &&
                      userOpportunity.map((userOpp) => {
                        return (
                          <div
                            key={userOpp.id + userOpp.UserId}
                            className="uk-flex uk-flex-column"
                            style={{ marginTop: 5 }}
                          >
                            <span className="uk-text-meta uk-text-secondary">
                              {userOpp.User.firstName} {userOpp.User.lastName}
                            </span>
                            {renderStatus(userOpp, isPublic)}
                          </div>
                        );
                      })
                    : renderStatus(userOpportunity, isPublic))}
              </div>
            )}
          </div>
        </Grid>
        {date && (
          <Grid gap="small" middle eachWidths={['auto', 'expand']}>
            <IconNoSSR name="calendar" />
            <p>{moment(date).format('DD/MM/YYYY')}</p>
          </Grid>
        )}
      </Grid>
      <div className="uk-flex uk-flex-between uk-flex-bottom uk-margin-medium-top">
        {isAdmin && (
          <div className="uk-flex-1 uk-text-left uk-text-meta uk-text-success uk-flex uk-flex-bottom">
            {!archived &&
              (isValidated ? (
                <div className="uk-flex uk-flex-middle">
                  Publi??e&nbsp;
                  <IconNoSSR name="check" />
                </div>
              ) : (
                <div className="uk-flex uk-flex-middle uk-text-warning">
                  ?? valider
                </div>
              ))}
          </div>
        )}
        <u className="uk-link-muted uk-flex-1 uk-text-right">
          Voir l&rsquo;offre
        </u>
      </div>
    </div>
  );
};

OfferCard.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  bookmarked: PropTypes.bool,
  archived: PropTypes.bool,
  recommended: PropTypes.bool,
  isNew: PropTypes.bool,
  isPublic: PropTypes.bool,
  isExternal: PropTypes.bool,
  date: PropTypes.string,
  userOpportunity: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.arrayOf(PropTypes.shape()),
  ]),
  isValidated: PropTypes.bool,
  isAdmin: PropTypes.bool,
  department: PropTypes.string,
  isSelected: PropTypes.bool,
};

OfferCard.defaultProps = {
  bookmarked: undefined,
  archived: undefined,
  recommended: undefined,
  isNew: undefined,
  isPublic: undefined,
  isExternal: undefined,
  isValidated: undefined,
  date: undefined,
  userOpportunity: undefined,
  isAdmin: false,
  department: undefined,
  isSelected: false,
};
export default OfferCard;
