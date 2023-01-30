import API from 'src/api/index.ts';
import { UserContext } from 'src/components/store/UserProvider';
import { useCallback, useContext, useEffect, useState } from 'react';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';

export function useTabsCount() {
  const [tabCounts, setTabCounts] = useState();
  const { user } = useContext(UserContext);

  const fetchTabsCount = useCallback(async () => {
    if (user) {
      const candidateId = getCandidateIdFromCoachOrCandidate(user);
      const { data } = await API.getOpportunitiesTabCountByCandidate(
        candidateId
      );
      setTabCounts(data);
    }
  }, [user]);

  useEffect(() => {
    fetchTabsCount();
  }, [fetchTabsCount]);

  return { tabCounts, fetchTabsCount };
}
