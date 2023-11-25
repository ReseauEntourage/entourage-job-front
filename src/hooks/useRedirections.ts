import { useRouter } from 'next/router';
import { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { USER_ROLES, CANDIDATE_USER_ROLES } from 'src/constants/users';
import {
  getCandidateIdFromCoachOrCandidate,
  isRoleIncluded,
} from 'src/utils/Finding';
import { useAuthenticatedUser } from './authentication/useAuthenticatedUser';

// only used for coaches and candidates
export const useCandidateAndCoachRedirections = () => {
  const [isUrlChecked, setIsUrlChecked] = useState(false);

  const router = useRouter();

  const user = useAuthenticatedUser();

  useDeepCompareEffect(() => {
    if (
      !isUrlChecked &&
      // wait for user and router to be loaded
      user &&
      // doesn't apply if role is admin
      user.role !== USER_ROLES.ADMIN &&
      router
    ) {
      // if external coach, redirect to list
      if (user.role === USER_ROLES.COACH_EXTERNAL) {
        router.replace(
          {
            pathname: `/backoffice/candidat/list`,
          },
          undefined,
          {
            shallow: true,
          }
        );
        // if not, send to path in param or default CV page
      } else {
        const candidateId = isRoleIncluded(CANDIDATE_USER_ROLES, user.role)
          ? user.id
          : getCandidateIdFromCoachOrCandidate(user)?.[0];

        const newRoute = router.asPath.replace(
          '/candidat',
          `/candidat/${candidateId}`
        );

        const { slug, ...restQuery } = router.query;
        router.replace(
          {
            pathname: newRoute,
            query: restQuery,
          },
          undefined,
          {
            shallow: true,
          }
        );
      }
      setIsUrlChecked(true);
    }
  }, [user, router]);

  return {
    isUrlChecked,
  };
};
