import _ from 'lodash';
import React, { useContext } from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import { useCandidateId } from 'src/components/backoffice/opportunities/useCandidateId';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import { Grid, SimpleLink } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { UserContext } from 'src/store/UserProvider';
import {
  isRoleIncluded,
  getRelatedUser,
  getUserCandidateFromCoach,
} from 'src/utils/Finding';

const CandidatHeader = ({
  user,
  showZone,
}: {
  user: UserWithUserCandidate;
  showZone?: boolean;
}) => {
  const { user: connectedUser } = useContext(UserContext);

  const candidateId = useCandidateId();

  if (!user || !connectedUser) return null;

  const relatedUser = getRelatedUser(user);

  return (
    <Grid row gap="small">
      <ImgProfile user={user} size={48} />
      <Grid column gap="collapse">
        <h3 className="uk-text-bold">
          {user.firstName} {user.lastName}
          {user.organization ? ` - ${user.organization.name}` : ''}
        </h3>
        {USER_ROLES.COACH_EXTERNAL !== user.role && (
          <Grid row gap="small" middle className="uk-margin-small-top">
            <>{`${_.capitalize(user.role)} de ${
              !relatedUser || relatedUser.length === 0
                ? 'personne'
                : `${relatedUser[0].firstName} ${relatedUser[0].lastName}`
            }`}</>
          </Grid>
        )}
        <>
          {candidateId &&
            relatedUser &&
            relatedUser.map(({ firstName, lastName, id }) => {
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
              if (candidateId !== id) {
                return null;
              }

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
        </>
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

// CandidatHeader.propTypes = {
//   user: PropTypes.shape({
//     firstName: PropTypes.string,
//     lastName: PropTypes.string,
//     urlImg: PropTypes.string,
//     role: PropTypes.string,
//     candidat: PropTypes.shape({
//       url: PropTypes.string,
//       coach: PropTypes.shape({
//         firstName: PropTypes.string,
//         lastName: PropTypes.string,
//       }),
//     }),
//     coaches: PropTypes.arrayOf(
//       PropTypes.shape({
//         url: PropTypes.string,
//         candidat: PropTypes.shape({
//           firstName: PropTypes.string,
//           lastName: PropTypes.string,
//         }),
//       })
//     ),
//     zone: PropTypes.string,
//     organization: PropTypes.shape({
//       name: PropTypes.string.isRequired,
//     }),
//   }).isRequired,
//   showZone: PropTypes.bool,
// };

export default CandidatHeader;
