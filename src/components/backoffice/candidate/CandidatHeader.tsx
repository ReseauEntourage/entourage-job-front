import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import { Grid, SimpleLink } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { ImgProfile } from 'src/components/utils/ImgProfile';
import { UserRoles } from 'src/constants/users';
import { useCandidateId } from 'src/hooks/queryParams/useCandidateId';
import { isRoleIncluded } from 'src/utils/Finding';

export const CandidatHeader = ({
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
    if (user.role === UserRoles.COACH) {
      const cand = user.coaches?.find(
        ({ candidat }) => candidat.id === candidateId
      );
      setRelatedUser(cand?.candidat);
      setCandidateCVUrl(
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        cand?.url
      );
    } else if (isRoleIncluded([UserRoles.REFERER], user.role)) {
      const cand = user.referredCandidates?.find(
        ({ candidat }) => candidat.id === candidateId
      );
      setRelatedUser(cand?.candidat);
      setCandidateCVUrl(
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        cand?.url
      );
    } else {
      setRelatedUser(user.candidat?.coach);
      setCandidateCVUrl(
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        user.candidat.url
      );
    }
  }, [user, candidateId]);

  return (
    <Grid row gap="small">
      <ImgProfile
        user={user}
        size={48}
        hasPicture={user.userProfile?.hasPicture || false}
      />
      <Grid column gap="collapse">
        <h3 className="uk-text-bold">
          {user.firstName} {user.lastName}
          {user.organization ? ` - ${user.organization.name}` : ''}
        </h3>
        <>
          {relatedUser && (
            <>
              <Grid row gap="small" middle className="uk-margin-small-top">
                <LucidIcon name="User" />
                &nbsp;
                <span className="uk-text-italic">
                  {relatedUser.firstName} {relatedUser.lastName}
                </span>
              </Grid>
              <Grid row gap="small" middle className="uk-margin-small-top">
                <LucidIcon name="Link" />
                &nbsp;
                <SimpleLink
                  className="uk-link-text"
                  target="_blank"
                  href={`/cv/${candidateCVUrl}`}
                >
                  <span>
                    {process.env.NEXT_PUBLIC_SERVER_URL}/cv/{candidateCVUrl}
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
