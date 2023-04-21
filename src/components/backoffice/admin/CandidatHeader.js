import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid, SimpleLink } from 'src/components/utils';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users.ts';
import { IconNoSSR } from 'src/components/utils/Icon';
import {
  isRoleIncluded,
  getRelatedUser,
  getUserCandidateFromCoach,
} from 'src/utils';
import { UserContext } from 'src/store/UserProvider';

const CandidatHeader = ({ user, showZone }) => {
  const { user: connectedUser } = useContext(UserContext);

  if (!user || !connectedUser) return null;

  const relatedUser = getRelatedUser(user);

  const relatedUserArray =
    relatedUser && !Array.isArray(relatedUser) ? [relatedUser] : relatedUser;

  return (
    <Grid row gap="small">
      <ImgProfile user={user} size={48} />
      <Grid column gap="collapse">
        <h3 className="uk-text-bold">
          {user.firstName} {user.lastName}
          {user.organization ? ` - ${user.organization.name}` : ''}
        </h3>
        <Grid row gap="small" middle className="uk-margin-small-top">
          <>{`${_.capitalize(user.role)} de ${
            !relatedUserArray || relatedUserArray.length === 0 ? 'personne' : ''
          }`}</>
        </Grid>
        {relatedUserArray &&
          relatedUserArray.map(({ firstName, lastName, id }) => {
            const cvUrl = isRoleIncluded(CANDIDATE_USER_ROLES, user.role)
              ? user.candidat.url
              : getUserCandidateFromCoach(user, id).url;

            const nameLinkComponent =
              connectedUser.role === USER_ROLES.ADMIN ? (
                <SimpleLink
                  className="uk-link-text uk-margin-small-top"
                  href={`/backoffice/admin/membres/${id}`}
                >
                  <span className="uk-text-italic">
                    {firstName} {lastName}
                  </span>
                </SimpleLink>
              ) : (
                <span className="uk-text-italic">
                  {firstName} {lastName}
                </span>
              );

            return (
              <>
                <Grid row gap="small" middle className="uk-margin-small-top">
                  <IconNoSSR name="user" style={{ width: 20 }} />
                  {nameLinkComponent}
                </Grid>
                <Grid row gap="small" middle className="uk-margin-small-top">
                  <IconNoSSR name="link" style={{ width: 20 }} />
                  <SimpleLink
                    className="uk-link-text uk-margin-small-top"
                    target="_blank"
                    href={`/cv/${cvUrl}`}
                  >
                    <span>
                      {process.env.SERVER_URL}/cv/{cvUrl}
                    </span>
                  </SimpleLink>
                </Grid>
              </>
            );
          })}

        {showZone && (
          <Grid row gap="small" middle className="uk-margin-small-top">
            <span className="uk-label">
              {user.zone ? _.capitalize(user.zone) : 'Non renseignée'}
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
    coaches: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        candidat: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
        }),
      })
    ),
    zone: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  showZone: PropTypes.bool,
};

export default CandidatHeader;
