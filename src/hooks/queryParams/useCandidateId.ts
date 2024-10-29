import { useRouter } from 'next/router';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils/Finding';

export function useCandidateId() {
  const user = useAuthenticatedUser();
  const {
    query: { candidateId },
  } = useRouter();

  if (USER_ROLES.COACH === user.role && !candidateId) {
    return getCandidateIdFromCoachOrCandidate(user)?.[0] as string;
  }

  return (user.role === USER_ROLES.CANDIDATE ? user.id : candidateId) as string;
}
