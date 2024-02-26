import { useCallback, useState } from 'react';
import { Api } from 'src/api';
import { OpportunityTabCount } from 'src/api/types';

export function useTabsCount(candidateId: string) {
  const [tabCounts, setTabCounts] = useState<OpportunityTabCount[]>([]);

  const fetchTabsCount = useCallback(async () => {
    const { data } = await Api.getOpportunitiesTabCountByCandidate(candidateId);
    setTabCounts(data);
  }, [candidateId]);

  return { tabCounts, fetchTabsCount };
}
