import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid, SimpleLink } from 'src/components/utils';
import ImgProfile from 'src/components/headers/ImgProfile';
import { USER_ROLES } from 'src/constants';
import { IconNoSSR } from 'src/components/utils/Icon';
import { getRelatedUser } from 'src/utils';

const CandidatHeader = ({ user, showZone }) => {
  if (!user) return null;
  return (
    <Grid row gap="small">
      <ImgProfile user={user} size={48} />
      <Grid column gap="collapse">
        <h3 className="uk-text-bold">
          {user.firstName} {user.lastName}
        </h3>
        <Grid row gap="small" middle className="uk-margin-small-top">
          <IconNoSSR name="user" style={{ width: 20 }} />
          <span>
            {_.capitalize(user.role)} de{' '}
            {getRelatedUser(user) ? (
              <span className="uk-text-italic">
                {getRelatedUser(user).firstName} {getRelatedUser(user).lastName}
              </span>
            ) : (
              'personne'
            )}
          </span>
        </Grid>

        {(user.role === USER_ROLES.CANDIDAT ||
          (user.role === USER_ROLES.COACH && user.coach)) && (
          <Grid row gap="small" middle className="uk-margin-small-top">
            <IconNoSSR name="link" style={{ width: 20 }} />
            <SimpleLink
              className="uk-link-text uk-margin-small-top"
              target="_blank"
              href={`/cv/${
                user[user.role === USER_ROLES.CANDIDAT ? 'candidat' : 'coach']
                  .url
              }`}
            >
              <span>
                {process.env.SERVER_URL}/cv/
                {
                  user[user.role === USER_ROLES.CANDIDAT ? 'candidat' : 'coach']
                    .url
                }
              </span>
            </SimpleLink>
          </Grid>
        )}
        {showZone && (
          <Grid row gap="small" middle className="uk-margin-small-top">
            <span className="uk-label">
              {user.zone ? _.capitalize(user.zone) : 'Non renseign??e'}
            </span>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

CandidatHeader.defaultProps = {
  showZone: false,
};

CandidatHeader.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    urlImg: PropTypes.string,
    role: PropTypes.string,
    candidat: PropTypes.shape({
      url: PropTypes.string,
      coach: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
    coach: PropTypes.shape({
      url: PropTypes.string,
      candidat: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
    zone: PropTypes.string,
  }).isRequired,
  showZone: PropTypes.bool,
};

export default CandidatHeader;
