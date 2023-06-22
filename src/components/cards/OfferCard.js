import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { Grid, Icon } from 'src/components/utils';
import { OFFER_STATUS } from 'src/constants';
import { findOfferStatus } from 'src/utils';

export const OfferCard = ({
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
  opportunityUsers,
  isValidated,
  isAdmin,
  department,
  isSelected,
}) => {
  const renderStatus = (oppUser, isOppPublic) => {
    if (oppUser.status !== undefined) {
      const offerStatus = findOfferStatus(
        oppUser.status,
        isOppPublic,
        oppUser.recommended
      );
      return (
        <span className={`uk-text-meta uk-text-${offerStatus.color}`}>
          {offerStatus.label}
        </span>
      );
    }
    return null;
  };

  const opportunityUsersWithoutDefaultStatus = Array.isArray(opportunityUsers)
    ? opportunityUsers.filter((oppUser) => {
        return oppUser.status !== OFFER_STATUS[0].value || oppUser.recommended;
      })
    : null;

  const specificOpportunityUser =
    opportunityUsers && !Array.isArray(opportunityUsers)
      ? opportunityUsers
      : null;

  const shouldShowRecommandationBadge =
    isPublic && (specificOpportunityUser?.recommended || recommended);

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
              <Icon name="bolt" ratio={0.5} className="ent-color-amber" />
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
            {(specificOpportunityUser?.bookmarked || bookmarked) && (
              <Icon
                name="star"
                className="ent-color-amber uk-margin-small-left"
                ratio={0.8}
              />
            )}
            {(specificOpportunityUser?.archived || (!isAdmin && archived)) && (
              <Icon
                name="archive"
                className="ent-color-amber uk-margin-small-left"
                ratio={0.8}
              />
            )}
          </div>
        </div>
        <Grid gap="small" middle eachWidths={['auto', 'expand']}>
          <Icon name="world" />
          <p>{shortDescription}</p>
        </Grid>
        {department && (
          <Grid gap="small" middle eachWidths={['auto', 'expand']}>
            <Icon name="location" />
            <p>{department}</p>
          </Grid>
        )}
        {isAdmin && from && (
          <Grid gap="small" middle eachWidths={['auto', 'expand']}>
            <Icon name="user" />
            <p>{from}</p>
          </Grid>
        )}

        <Grid gap="small" middle eachWidths={['auto', 'expand']}>
          <Icon name="info" />
          <div>
            {isPublic ? (
              <div>
                <p className="uk-margin-remove-bottom">Offre générale</p>
                {opportunityUsers &&
                  (Array.isArray(opportunityUsers)
                    ? opportunityUsersWithoutDefaultStatus.length > 0 &&
                      isAdmin && (
                        <span className="uk-text-meta">
                          {opportunityUsersWithoutDefaultStatus.length}
                          &nbsp;candidat
                          {opportunityUsersWithoutDefaultStatus.length !== 1
                            ? 's'
                            : ''}{' '}
                          sur l&apos;offre
                        </span>
                      )
                    : renderStatus(opportunityUsers, isPublic))}
              </div>
            ) : (
              <div>
                <p className="uk-margin-remove-bottom">
                  {isExternal ? 'Offre externe' : 'Offre privée'}
                </p>
                {opportunityUsers &&
                  (Array.isArray(opportunityUsers)
                    ? opportunityUsers.length > 0 &&
                      opportunityUsers.map((oppUser) => {
                        return (
                          <div
                            key={oppUser.id + oppUser.UserId}
                            className="uk-flex uk-flex-column"
                            style={{ marginTop: 5 }}
                          >
                            <span className="uk-text-meta uk-text-secondary">
                              {oppUser.user.firstName} {oppUser.user.lastName}
                            </span>
                            {renderStatus(oppUser, isPublic)}
                          </div>
                        );
                      })
                    : renderStatus(opportunityUsers, isPublic))}
              </div>
            )}
          </div>
        </Grid>
        {date && (
          <Grid gap="small" middle eachWidths={['auto', 'expand']}>
            <Icon name="calendar" />
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
                  Publiée&nbsp;
                  <Icon name="check" />
                </div>
              ) : (
                <div className="uk-flex uk-flex-middle uk-text-warning">
                  À valider
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
  opportunityUsers: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.shape({})),
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
  opportunityUsers: undefined,
  isAdmin: false,
  department: undefined,
  isSelected: false,
};
