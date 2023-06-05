import { useCallback, useState } from 'react';
import { Api } from 'src/api';

export function useTabsCount(candidateId: string) {
  const [tabCounts, setTabCounts] = useState();

  const fetchTabsCount = useCallback(async () => {
    const { data } = await Api.getOpportunitiesTabCountByCandidate(candidateId);
    setTabCounts(data);
  }, [candidateId]);

  return { tabCounts, fetchTabsCount };
}
