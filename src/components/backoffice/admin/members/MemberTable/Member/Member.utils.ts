import { getUserCandidateFromCoachOrCandidate } from 'src/utils/Finding';

export const renderCVStatus = (member) => {
  if (getUserCandidateFromCoachOrCandidate(member)?.cvs?.[0]?.status) {
    return getUserCandidateFromCoachOrCandidate(member).cvs[0].status;
  }
  return 'none';
};
