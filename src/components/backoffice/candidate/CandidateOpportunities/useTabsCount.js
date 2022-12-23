import API from 'src/api/index.ts';
import { UserContext } from 'src/components/store/UserProvider';
import { useCallback, useContext, useEffect, useState } from 'react';

export function useTabsCount() {
  const [tabCounts, setTabCounts] = useState();
  const { user } = useContext(UserContext);

  const fetchTabsCount = useCallback(async () => {
    if (user) {
      const { data } = await API.getOpportunitiesTabCountByCandidate(user.id);
      setTabCounts(data);
    }
  }, [user]);

  useEffect(() => {
    fetchTabsCount();
  }, [fetchTabsCount]);

  return { tabCounts, fetchTabsCount };
}
