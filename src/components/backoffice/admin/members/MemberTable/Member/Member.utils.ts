import { UserCandidateWithUsers, UserWithUserCandidate } from 'src/api/types';
import { getUserCandidateFromCoachOrCandidate } from 'src/utils/Finding';

export const renderCVStatus = (member: UserWithUserCandidate): string => {
  const relatedCandidate = getUserCandidateFromCoachOrCandidate(
    member
  ) as UserCandidateWithUsers;
  if (relatedCandidate?.cvs?.[0]?.status) {
    return relatedCandidate.cvs[0].status;
  }
  return 'none';
};
