import { useContext } from 'react';
import { UserContext } from 'src/components/store/UserProvider';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';

export function useCandidateId() {
  const { user } = useContext(UserContext);

  return getCandidateIdFromCoachOrCandidate(user);
}
