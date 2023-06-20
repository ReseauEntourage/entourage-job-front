import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import { useCandidateId } from 'src/components/backoffice/opportunities/useCandidateId';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import { Grid, SimpleLink, IconNoSSR } from 'src/components/utils';
import { USER_ROLES, COACH_USER_ROLES } from 'src/constants/users';
import { isRoleIncluded } from 'src/utils/Finding';

const CandidatHeader = ({
  user,
  showZone,
}: {
  user: UserWithUserCandidate;
  showZone?: boolean;
}) => {
  const candidateId = useCandidateId();

  const [relatedUser, setRelatedUser] = useState<UserWithUserCandidate>();
  const [candidateCVUrl, setCandidateCVUrl] = useState<string>('');

  useEffect(() => {
    if (!user) {
      return;
    }
    if (isRoleIncluded(COACH_USER_ROLES, user.role)) {
      const cand = user.coaches?.find(
        ({ candidat }) => candidat.id === candidateId
      );
      setRelatedUser(cand?.candidat);
      setCandidateCVUrl(cand?.url);
    } else {
      setRelatedUser(user.candidat?.coach);
      setCandidateCVUrl(user.candidat?.url);
    }
  }, [user, candidateId]);

  if (!user) return null;

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
              !relatedUser
                ? 'personne'
                : `${relatedUser.firstName} ${relatedUser.lastName}`
            }`}</>
          </Grid>
        )}
        <>
          {relatedUser && (
            <>
              <Grid row gap="small" middle className="uk-margin-small-top">
                <IconNoSSR name="user" style={{ width: 20 }} />
                <span className="uk-text-italic">
                  {relatedUser.firstName} {relatedUser.lastName}
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
