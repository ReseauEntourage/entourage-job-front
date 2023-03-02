import API from 'src/api/index.ts';
import { UserContext } from 'src/store/UserProvider';
import { useCallback, useContext, useState } from 'react';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';

export function useTabsCount() {
  const [tabCounts, setTabCounts] = useState();
  const { user } = useContext(UserContext);

  const fetchTabsCount = useCallback(async () => {
    const candidateId = getCandidateIdFromCoachOrCandidate(user);
    const { data } = await API.getOpportunitiesTabCountByCandidate(candidateId);
    setTabCounts(data);
  }, [user]);

  return { tabCounts, fetchTabsCount };
}
