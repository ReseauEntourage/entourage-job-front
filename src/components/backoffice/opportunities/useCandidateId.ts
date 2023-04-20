import { useRouter } from 'next/router';
import { useContext } from 'react';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { UserContext } from 'src/store/UserProvider';
import { isRoleIncluded } from 'src/utils/Finding';

export function useCandidateId() {
  const { user } = useContext(UserContext);
  const {
    query: { candidateId },
  } = useRouter();

  return (
    isRoleIncluded(CANDIDATE_USER_ROLES, user.role) ? user.id : candidateId
  ) as string;
}
