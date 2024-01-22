import { useRouter } from 'next/router';
import { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import {
  getCandidateIdFromCoachOrCandidate,
  isRoleIncluded,
} from 'src/utils/Finding';
import { useAuthenticatedUser } from './authentication/useAuthenticatedUser'; // only used for coaches and candidates

// only used for coaches and candidates
export const useCandidateAndCoachRedirections = () => {
  const [isUrlChecked, setIsUrlChecked] = useState(false);

  const { replace, asPath, query } = useRouter();

  const user = useAuthenticatedUser();

  useDeepCompareEffect(() => {
    if (
      !isUrlChecked &&
      // wait for user and router to be loaded
      user &&
      // doesn't apply if role is admin
      user.role !== USER_ROLES.ADMIN
    ) {
      // if external coach, redirect to list
      if (user.role === USER_ROLES.COACH_EXTERNAL) {
        replace(`/backoffice/candidat/list`);
        // if not, send to path in param or default CV page
      } else {
        const candidateId = isRoleIncluded(CANDIDATE_USER_ROLES, user.role)
          ? user.id
          : getCandidateIdFromCoachOrCandidate(user)?.[0];

        if (candidateId) {
          const newRoute = asPath.replace(
            '/candidat',
            `/candidat/${candidateId}`
          );

          const { slug, ...restQuery } = query;
          replace(
            {
              pathname: newRoute,
              query: restQuery,
            },
            undefined,
            {
              shallow: true,
            }
          );
        } else {
          replace(`/backoffice/annuaire`);
        }
      }
      setIsUrlChecked(true);
    }
  }, [user, asPath, query, replace, isUrlChecked]);

  return {
    isUrlChecked,
  };
};
