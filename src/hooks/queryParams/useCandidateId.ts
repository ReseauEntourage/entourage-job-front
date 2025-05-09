import { useRouter } from 'next/router';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils/Finding';

export function useCandidateId() {
  const user = useAuthenticatedUser();
  const {
    query: { candidateId },
  } = useRouter();

  if (UserRoles.COACH === user.role && !candidateId) {
    return getCandidateIdFromCoachOrCandidate(user)?.[0] as string;
  }

  return (user.role === UserRoles.CANDIDATE ? user.id : candidateId) as string;
}
