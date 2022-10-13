import { getCandidateFromCoachOrCandidate } from 'src/utils';

export const renderCVStatus = (member) => {
  if (getCandidateFromCoachOrCandidate(member)?.cvs?.[0]?.status) {
    return getCandidateFromCoachOrCandidate(member).cvs[0].status;
  }
  return 'none';
};
