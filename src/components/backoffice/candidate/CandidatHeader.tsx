import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import { useCandidateId } from 'src/components/backoffice/opportunities/useCandidateId';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import { Grid, SimpleLink } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import {
  CANDIDATE_USER_ROLES,
  USER_ROLES,
  COACH_USER_ROLES,
} from 'src/constants/users';
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

  const relatedUser = getRelatedUser(user);

  const [candidate, setCandidate] = useState<UserWithUserCandidate>();
  const [candidateCVUrl, setCandidateCVUrl] = useState<string>();

  useEffect(() => {
    if (candidateId && user) {
      if (isRoleIncluded(COACH_USER_ROLES, user.role)) {
        const candidatesList: UserWithUserCandidate[] = getRelatedUser(user);
        const currentCandidate: UserWithUserCandidate = candidatesList.filter(
          (cand) => (cand.id = candidateId)
        )[0];
        setCandidateCVUrl(getUserCandidateFromCoach(user, candidateId).url);
        setCandidate(currentCandidate);
      } else if (isRoleIncluded(CANDIDATE_USER_ROLES, user.role)) {
        setCandidate(user);
        setCandidateCVUrl(user.candidat.url);
      }
    }
  }, [user, candidateId]);

  if (!user || !connectedUser) return null;

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
          {candidate && (
            <>
              <Grid row gap="small" middle className="uk-margin-small-top">
                <IconNoSSR name="user" style={{ width: 20 }} />
                <span className="uk-text-italic">
                  {candidate.firstName} {candidate.lastName}
                </span>
              </Grid>
              <Grid row gap="small" middle className="uk-margin-small-top">
                <IconNoSSR name="link" style={{ width: 20 }} />
                <SimpleLink
                  className="uk-link-text uk-margin-small-top"
                  target="_blank"
                  href={`/cv/${candidateCVUrl}`}
                >
                  <span>
                    {process.env.SERVER_URL}/cv/{candidateCVUrl}
                  </span>
                </SimpleLink>
              </Grid>
            </>
          )}
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

export default CandidatHeader;
