import { useRouter } from 'next/router';
import { useContext } from 'react';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { UserContext } from 'src/store/UserProvider';
import {
  getCandidateIdFromCoachOrCandidate,
  isRoleIncluded,
} from 'src/utils/Finding';

export function useCandidateId() {
  const { user } = useContext(UserContext);
  const {
    query: { candidateId },
  } = useRouter();

  if (user && USER_ROLES.COACH === user.role && !candidateId) {
    return getCandidateIdFromCoachOrCandidate(user)?.[0] as string;
  }

  return (
    user && isRoleIncluded(CANDIDATE_USER_ROLES, user.role)
      ? user.id
      : candidateId
  ) as string;
}
