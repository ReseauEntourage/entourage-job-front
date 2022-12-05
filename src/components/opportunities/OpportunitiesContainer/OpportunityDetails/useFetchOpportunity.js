import { useEffect, useState } from 'react';
import Api from 'src/api/index.ts';
import { usePrevious } from 'src/hooks/utils';

export function useFetchOpportunity(opportunityId) {
  const [currentOpportunity, setCurrentOpportunity] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const prevOpportunityId = usePrevious(opportunityId);

  useEffect(() => {
    async function fetchOpportunity() {
      const { data: opportunity } = await Api.getOpportunityById(opportunityId);
      setCurrentOpportunity(opportunity);
      setIsLoading(false);
    }

    if (opportunityId && opportunityId !== prevOpportunityId) {
      setIsLoading(true);
      fetchOpportunity();
    }
  }, [opportunityId, prevOpportunityId]);

  return { currentOpportunity, isLoading };
}
