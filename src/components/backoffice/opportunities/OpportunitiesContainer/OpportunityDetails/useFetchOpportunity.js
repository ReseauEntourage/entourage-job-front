import { useContext, useEffect, useState } from 'react';
import { Api } from 'src/api/index.ts';
import { usePrevious } from 'src/hooks/utils';
import { UserContext } from 'src/store/UserProvider';
import { USER_ROLES } from 'src/constants';

export function useFetchOpportunity(
  opportunityId,
  candidateId,
  fetchOpportunities
) {
  const { user } = useContext(UserContext);
  const [opportunity, setOpportunity] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const prevOpportunityId = usePrevious(opportunityId);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchOpportunity() {
      const { data: fetchedOpportunity } = await Api.getOpportunityById(
        opportunityId
      );
      if (
        user.role !== USER_ROLES.ADMIN &&
        candidateId &&
        (!fetchedOpportunity.opportunityUsers ||
          !fetchedOpportunity.opportunityUsers.seen)
      ) {
        const { data: opportunityUsers } = await Api.postJoinOpportunity({
          opportunityId: fetchedOpportunity.id,
          candidateId,
        });
        setOpportunity({ ...fetchedOpportunity, opportunityUsers });
        await fetchOpportunities();
      } else {
        setOpportunity(fetchedOpportunity);
      }
      setIsLoading(false);
      setRefresh(false);
    }

    if (refresh || (opportunityId && opportunityId !== prevOpportunityId)) {
      setIsLoading(true);
      fetchOpportunity();
    }
  }, [
    candidateId,
    opportunity,
    opportunityId,
    prevOpportunityId,
    user.role,
    refresh,
    fetchOpportunities,
  ]);

  function refreshOpportunity() {
    setRefresh(true);
  }

  return { opportunity, isLoading, refreshOpportunity };
}
